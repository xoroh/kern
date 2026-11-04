// Shared tier derivation for the Kern Core / Components / Blocks IA
// (D1003, corrected by D1004).
//
// ONE rule, used by every emitter and every gate:
//
//   - A source file under the three AREAS is `core` when it has no
//     sibling-component value imports, `component` when it imports any.
//   - A block is NEVER derived: blocks are declared by living in
//     `apps/site/src/blocks/` + one row in `src/blocks/manifest.ts`.
//     (D1004: "imports any component -> block" is wrong — composites may
//     compose composites.)
//
// Sibling-component import = a relative `from "./x"` / `from "../start/x"` /
// `from "../components/x"` whose target module exports >= 1 component name
// (PascalCase per `isComponentName`, same shape the manifest generator
// recognises). `import type` statements and inline `type` specifiers are
// ignored: a type-only edge is not composition. `../utils/*`, theme modules
// and non-component helpers (focus-ring, cn) are ignored because their
// targets export no component.
//
// Curated overrides live in `./tier-overrides.mjs` (checked in, each entry
// cites its evidence). Effective tier = override ?? derived. The gate
// (`apps/site/scripts/check-tiers.mjs`) fails a stale override (override
// equals derived — remove it), an unknown override path, an upward import
// (effective-core importing effective-component), a web/native tier mismatch
// on one export, and any block->block edge.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { FOUNDATION_MODULES } from "./tier-overrides.mjs";

/** True for render-infrastructure modules (never promote their importers). */
export function isFoundation(key) {
  return FOUNDATION_MODULES.has(key);
}

export const AREAS = [
  { dir: "packages/kern/src/components", platform: "web" },
  { dir: "packages/kern/src/start", platform: "web" },
  { dir: "packages/kern-native/src/components", platform: "native" },
];

/** Manifest-style relative path for one area file, e.g. `src/components/button.tsx`. */
export function manifestPath(dir, file) {
  return `src/${dir.includes("/start") ? "start" : "components"}/${file}`;
}

/**
 * A COMPONENT name, not a constant, a type, or a style helper. Same rule as
 * `packages/mcp/scripts/generate-manifest.mjs:isComponentName` — the two must
 * agree on what a component is, or derivation and registration drift.
 */
export function isComponentName(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name) && /[a-z]/.test(name);
}

const VALUE_EXPORT_PATTERNS = [
  /export function (\w+)/g,
  /export const ([A-Z]\w*) = \{/g,
  /export const ([A-Z]\w*) = forwardRef</g,
  /export const ([A-Z]\w*) = memo\(/g,
  /export class ([A-Z]\w*)/g,
];

/** Component export names declared in one source file (value exports only). */
export function fileComponentExports(src) {
  const names = new Set();
  for (const pattern of VALUE_EXPORT_PATTERNS) {
    for (const [, name] of src.matchAll(pattern)) {
      if (isComponentName(name)) names.add(name);
    }
  }
  for (const block of src.matchAll(/export\s*\{([^}]+)\}/g)) {
    // A bare `export { X }` block with no `from` is a local re-export.
    if (/from\s*["']/.test(block[0])) continue;
    for (const specifier of block[1].split(",")) {
      const spec = specifier.trim();
      if (!spec || /^type\s/.test(spec)) continue;
      const parts = spec.split(/\s+as\s+/);
      const local = parts[0].trim();
      const exported = (parts.at(-1) ?? local).trim();
      if (!isComponentName(exported)) continue;
      if (new RegExp(`(?:function|const|class)\\s+${local}\\b`).test(src)) {
        names.add(exported);
      }
    }
  }
  return names;
}

/**
 * Value imports from relative specifiers in one source file.
 * Returns `{ spec, names[] }` per import statement. `import type` statements
 * are skipped wholesale; inline `type` specifiers are dropped.
 */
export function fileRelativeImports(src) {
  const imports = [];
  // Strip `import type ... ;` statements first — a type-only edge is not
  // composition and must never promote a file to `component`.
  const withoutTypeImports = src.replace(/^\s*import\s+type\s+[^;]+;/gm, "");
  for (const match of withoutTypeImports.matchAll(
    /import\s+(?:[^"']+?)\s+from\s*["'](\.[^"']*)["']/g,
  )) {
    const spec = match[1];
    const clause = match[0]
      .slice(0, match[0].indexOf("from"))
      .replace(/^import\s+/, "");
    const names = [];
    const braced = clause.match(/\{([^}]*)\}/);
    if (braced) {
      for (const specifier of braced[1].split(",")) {
        const spec2 = specifier.trim();
        if (!spec2 || /^type\s/.test(spec2)) continue;
        names.push(
          spec2
            .split(/\s+as\s+/)
            .at(-1)
            .trim(),
        );
      }
    } else {
      // Default or namespace import: a value edge with no symbol names.
      names.push("*default*");
    }
    imports.push({ spec, names });
  }
  return imports;
}

/** Resolve a relative spec from one area file to `dir/file` within AREAS. */
function resolveSibling(dir, spec) {
  if (!spec.startsWith(".")) return null;
  const parts = dir.split("/");
  const specParts = spec.split("/");
  // `dir` is a package-relative DIRECTORY (no filename in it), so resolution
  // starts from the full dir: `.` stays, `..` pops one level.
  const base = [...parts];
  for (const part of specParts) {
    if (part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part);
  }
  let resolved = base.join("/");
  if (!resolved.endsWith(".tsx") && !resolved.endsWith(".ts")) {
    resolved += ".tsx";
  }
  const file2 = resolved.split("/").pop();
  const dir2 = resolved.split("/").slice(0, -1).join("/");
  const area = AREAS.find((a) => a.dir === dir2);
  if (!area) return null;
  return { dir: dir2, file: file2, platform: area.platform };
}

/**
 * Scan all AREAS under `root` (repo root). Returns
 * `Map<`${platform}:${path}`, { platform, path, dir, file, tier, builtFrom, componentExports }>`.
 * `builtFrom` is the sorted unique symbol names imported from sibling
 * component modules (may name helpers with no registry row — link what
 * resolves, render the rest as text).
 */
export function loadTierData(root) {
  const sources = new Map();
  for (const { dir, platform } of AREAS) {
    let files = [];
    try {
      files = readdirSync(join(root, dir)).sort();
    } catch {
      continue;
    }
    for (const file of files) {
      if (
        !file.endsWith(".tsx") ||
        file.endsWith(".test.tsx") ||
        file.endsWith(".rntest.tsx")
      ) {
        continue;
      }
      const path = manifestPath(dir, file);
      sources.set(`${platform}:${path}`, {
        src: readFileSync(join(root, dir, file), "utf8"),
        dir,
        file,
        platform,
        path,
      });
    }
  }
  // Tier is ONE level, not transitive closure: a file is `component` when it
  // imports a component export of another component-exporting module —
  // EXCEPT imports from foundation modules (render infrastructure both
  // renderers share: typography, state layers, press/portal helpers). A
  // native accordion rendering `Text` is still a primitive; a data table
  // composing `Checkbox`/`Menu`/`Table` is a composite. The foundation set
  // is curated in `tier-overrides.mjs` (each entry cites evidence) and the
  // gate requires foundation modules to have no edges to non-foundation
  // component modules — a foundation that composes composites is a
  // composite wearing a costume.
  const hasComponents = new Map();
  const exportsByKey = new Map();
  for (const [key, entry] of sources) {
    const names = fileComponentExports(entry.src);
    exportsByKey.set(key, names);
    hasComponents.set(key, names.size > 0);
  }
  // Edges: file -> Map(targetKey -> imported symbol names). An edge exists
  // only for a VALUE import that names a component the target module
  // actually exports. Importing a constant (FOCUS_RING_CLASS,
  // statusToneClassNames) or a hook (useKernPress) from a module is
  // sharing, not composition, and forms no edge. Foundation modules
  // (typography, state layers, press/portal helpers) never promote their
  // importers even though they export components — see tier-overrides.mjs.
  const edges = new Map();
  for (const [key, entry] of sources) {
    const targets = new Map();
    for (const { spec, names } of fileRelativeImports(entry.src)) {
      const target = resolveSibling(entry.dir, spec);
      if (!target) continue;
      const targetKey = `${target.platform}:${manifestPath(target.dir, target.file)}`;
      if (!sources.has(targetKey)) continue;
      if (targetKey === key) continue;
      if (!hasComponents.get(targetKey)) continue;
      if (isFoundation(targetKey)) continue;
      if (names.every((n) => n === "*default*")) {
        targets.set(targetKey, names);
        continue;
      }
      const targetExports = exportsByKey.get(targetKey);
      if (names.some((n) => targetExports.has(n))) {
        targets.set(targetKey, names);
      }
    }
    edges.set(key, targets);
  }
  // Tier is ONE level: a component-exporting file with >= 1 composition
  // edge is `component`, everything else is `core`.
  const componentModules = new Set();
  for (const [key, targets] of edges) {
    if (!hasComponents.get(key)) continue;
    if (targets.size > 0) componentModules.add(key);
  }
  const data = new Map();
  for (const [key, entry] of sources) {
    // Built-from = the composition edges' symbol names. A default-only
    // edge (no named component import) still counts as composition and is
    // recorded as `*module*` so "Built from" never silently drops it.
    const builtFrom = new Set();
    for (const [targetKey, names] of edges.get(key) ?? []) {
      for (const name of names) {
        if (name !== "*default*") builtFrom.add(name);
      }
      if (names.every((n) => n === "*default*")) {
        const targetFile = targetKey.slice(targetKey.lastIndexOf("/") + 1);
        builtFrom.add(`*${targetFile.slice(0, -4)}*`);
      }
    }
    data.set(key, {
      platform: entry.platform,
      path: entry.path,
      dir: entry.dir,
      file: entry.file,
      // Tier is set membership (ONE level: has a composition edge or not),
      // NOT builtFrom size — builtFrom only names symbols, and a file whose
      // edges all resolve through the edge filter is component even when a
      // symbol list cannot be named.
      tier: componentModules.has(key) ? "component" : "core",
      builtFrom: [...builtFrom].sort((a, b) => a.localeCompare(b)),
      componentExports: [...exportsByKey.get(key)].sort((a, b) =>
        a.localeCompare(b),
      ),
    });
  }
  return data;
}

/**
 * Effective tiers with curated file overrides applied. `overrides` maps
 * `<platform>:<path>` -> `{ tier, why }`. Returns
 * `{ tiers: Map<key, "core"|"component">, derived: Map<key, ...> }`.
 */
export function applyOverrides(data, overrides) {
  const derived = new Map();
  const tiers = new Map();
  for (const [key, entry] of data) {
    derived.set(key, entry.tier);
    tiers.set(key, overrides[key]?.tier ?? entry.tier);
  }
  return { tiers, derived };
}

/**
 * Effective tier of one manifest row (one export on one platform):
 * a PARITY_TIERS pin wins (mixed-module artifact, export span verified),
 * else the file tier after TIER_OVERRIDES. `fileTiers` is
 * `applyOverrides(data, tierOverrides).tiers`.
 */
export function effectiveExportTier(
  fileTiers,
  parityTiers,
  platform,
  exportName,
  path,
) {
  const pin = parityTiers[`${platform}:${exportName}`];
  if (pin) return pin.tier;
  return fileTiers.get(`${platform}:${path}`);
}

/**
 * Resolve a registry export to its tier-data file. Prefers `preferredPath`
 * (the generator's row path); falls back to any same-platform file exporting
 * the name (dedup-collapsed rows keep the first path). Returns the data key
 * or null when no scanned file exports the name.
 */
export function resolveExportFile(data, platform, exportName, preferredPath) {
  const preferred = `${platform}:${preferredPath}`;
  const entry = data.get(preferred);
  if (entry && entry.componentExports.includes(exportName)) return preferred;
  for (const [key, candidate] of data) {
    if (
      candidate.platform === platform &&
      candidate.componentExports.includes(exportName)
    ) {
      return key;
    }
  }
  return null;
}
