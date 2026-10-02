// Regenerates ../mcp/src/manifest.ts from the components directories.
// Run from the repo root: bun packages/mcp/scripts/generate-manifest.mjs
// A file counts as real when it contains no "not implemented yet" throw.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
// `src/start/` is the web COMPOSITION tier, published as the `@xoroh/kern/start`
// subpath of the same package (see packages/kern/package.json `exports["./start"]`).
// It was absent here, so every component that only exists at that tier — Pane,
// ListDetail, TopAppBar, Split, SplitPanel, Scaffold — was invisible to the
// registry and counted as a native-only GAP while actually shipping on web.
// That is the "native-only row is not evidence of a gap; it can be evidence of a
// registration miss" finding, and it inflated a gated count without failing.
//
// A component in a subdirectory is a component: the concept is what the design
// system exposes, not which folder a reviewer happened to open.
const AREAS = [
  { dir: "packages/kern/src/components", platform: "web" },
  { dir: "packages/kern/src/start", platform: "web" },
  { dir: "packages/kern-native/src/components", platform: "native" },
];

const entries = [];
const sourceFiles = new Map();
// Barrel exports the scanners below cannot see, reported rather than swallowed.
// See the `unseenExports` block at the bottom of the loop.
const unseenExports = [];
// `exportName` -> `export-name`, the registry's slug form.
//
// The naive `([a-z0-9])([A-Z])` split only breaks on a lower/digit followed by
// an upper. It therefore cannot see an ACRONYM boundary: `InputOTPRoot` has `R`
// preceded by `P`, both upper, so no split happened and the slug came out as
// `input-otproot` — the `-root` sub-part welded onto the concept. That produced
// two phantom web-only rows (`input-otpinput`, `input-otproot`) that inflated a
// gated count without failing anything.
//
// Two passes handle it: split lower/digit -> Upper, then split an acronym run
// from a following capitalised word (`OTPRoot` -> `OTP` + `Root`).
const toName = (exportName) =>
  exportName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

// A COMPONENT name, not a constant, a type, or a style helper.
//
// PascalCase with at least one lowercase letter and no underscore. The lowercase
// requirement is what separates `ExtendedFab` from `TOP_APP_BAR_HEIGHTS`: both
// start uppercase, and a registry that lists a layout constant as a component
// dispatches work against a row no consumer can render. Seven barrel exports are
// SCREAMING_SNAKE measurement constants (`NAVIGATION_BAR_HEIGHT`,
// `SECTION_DRAWER_WIDTH`, `PANE_WIDTHS`, …) and are deliberately not components.
const isComponentName = (name) =>
  /^[A-Z][A-Za-z0-9]*$/.test(name) && /[a-z]/.test(name);
for (const { dir, platform } of AREAS) {
  // The barrel that re-exports THIS area. Deriving it from `dir` (rather than
  // from `platform`) is what lets several web directories coexist: `src/start`
  // is re-exported by `src/start/index.ts`, not by `src/components/index.ts`.
  const barrelPkg =
    dir === "packages/kern-native/src/components"
      ? "packages/kern-native/src"
      : dir;
  const barrel = readFileSync(join(ROOT, `${barrelPkg}/index.ts`), "utf8");
  for (const file of readdirSync(join(ROOT, dir)).sort()) {
    if (
      !file.endsWith(".tsx") ||
      file.endsWith(".test.tsx") ||
      file.endsWith(".rntest.tsx")
    )
      continue;
    const src = readFileSync(join(ROOT, dir, file), "utf8");
    const path = `src/${dir.includes("/start") ? "start" : "components"}/${file}`;
    const isStub = src.includes("not implemented yet");
    const status = isStub ? "stub" : "real";
    const filename = file.slice(0, -4);
    sourceFiles.set(path, src);
    // VALUE exports only. `export type { X }` and an inline `type X` specifier
    // are declarations, not components — collecting them was harmless while the
    // candidate scan was narrow, and it is what made the unseen-export check
    // below unreadable (339 hits, nearly all `…Props` types).
    const exportNames = new Set();
    for (const match of barrel.matchAll(
      new RegExp(
        `export\\s*(type\\s*)?\\{([^}]+)\\}\\s*from\\s*["']\\./(?:components/)?${filename}["']`,
        "gs",
      ),
    )) {
      if (match[1]) continue; // `export type { … }`
      for (const specifier of match[2].split(",")) {
        const spec = specifier.trim();
        if (!spec || /^type\s/.test(spec)) continue; // `type X` inline
        exportNames.add(
          spec
            .split(/\s+as\s+/)
            .at(-1)
            .trim(),
        );
      }
    }

    // `export * from "./x"` re-exports every value in the file. The named-export
    // regex above cannot see it, so `exportNames` came back EMPTY for
    // `src/start/*` and the `!exportNames.has(exportName)` filter below then
    // discarded every candidate in those files — Pane, ListDetail, TopAppBar,
    // Split, SplitPanel, Inspector — while the generator still exited 0 and
    // reported a clean "wrote 352 entries". Determinism is not currency: a
    // byte-identical re-run passed on a file that was wrong the same way every
    // time. A star re-export means the file's own value exports ARE the
    // barrel's, so treat it as such.
    const starReexport = new RegExp(
      `export\\s*\\*\\s*from\\s*["']\\./(?:components/)?${filename}["']`,
    ).test(barrel);

    // One entry per exported component: function components, PascalCase
    // namespace objects (Dialog, Field, Tabs, …), components wrapped in a HOC,
    // class components, and aliased re-exports. Types, variant maps, and style
    // helpers are excluded.
    //
    // Each of these shapes was added because the shape it covers was MISSING a
    // registry row while every gate stayed green. Native `ExtendedFab` is
    // `export const ExtendedFab = forwardRef<…>`; native `ErrorBoundary` is an
    // `export class`; native `FieldRoot` is `export { Root as FieldRoot }`. All
    // three are in the barrel, all three were invisible, and the generator was
    // deterministic about it — so "re-run and the file is byte-identical"
    // passed on a file that was wrong in the same way every time. Determinism
    // is not currency. The `unseenExports` assertion is what stops the next one
    // from being silent.
    const candidates = new Set();
    for (const [, exportName] of src.matchAll(/export function (\w+)/g)) {
      candidates.add(exportName);
    }
    for (const [, exportName] of src.matchAll(
      /export const ([A-Z]\w*) = \{/g,
    )) {
      candidates.add(exportName);
    }
    for (const [, exportName] of src.matchAll(
      /export const ([A-Z]\w*) = forwardRef</g,
    )) {
      candidates.add(exportName);
    }
    for (const [, exportName] of src.matchAll(
      /export const ([A-Z]\w*) = memo\(/g,
    )) {
      candidates.add(exportName);
    }
    for (const [, exportName] of src.matchAll(/export class ([A-Z]\w*)/g)) {
      candidates.add(exportName);
    }
    // Aliased re-exports: `export { Root as FieldRoot }`. The BARREL carries the
    // aliased name, so that is the name the registry must record — matching the
    // local identifier instead would produce `root`, which the concept rule
    // would then collapse into `field` and the registry would report a name no
    // consumer can import.
    for (const block of src.matchAll(/export\s*\{([^}]+)\}/g)) {
      for (const specifier of block[1].split(",")) {
        const spec = specifier.trim();
        if (!spec || /^type\s/.test(spec)) continue;
        const parts = spec.split(/\s+as\s+/);
        const local = parts[0].trim();
        const exported = (parts.at(-1) ?? local).trim();
        if (!/^[A-Z]/.test(exported)) continue;
        // Only a local DECLARATION re-exported under another name — a
        // `export … from "./other"` re-export is not a component of this file.
        if (new RegExp(`(?:function|const|class)\\s+${local}\\b`).test(src)) {
          candidates.add(exported);
        }
      }
    }

    // A barrel export no scanner recognised is either a component this
    // generator cannot see, or a deliberate exclusion. Both need a name;
    // silence is how the three components above lost their rows.
    for (const exportName of exportNames) {
      if (!isComponentName(exportName)) continue; // constant or lowercase value
      if (
        exportName.endsWith("Styles") ||
        exportName.endsWith("Variants") ||
        candidates.has(exportName) ||
        starReexport
      ) {
        continue;
      }
      unseenExports.push({ platform, file, exportName });
    }

    for (const exportName of candidates) {
      if (
        exportName.endsWith("Styles") ||
        exportName.endsWith("Variants") ||
        // `isComponentName` is the guard that keeps SCREAMING_SNAKE measurement
        // constants (APP_SHELL_HEIGHTS, SIDEBAR_WIDTHS, TOP_APP_BAR_HEIGHTS) out
        // of the registry. The named-barrel path applied it via `unseenExports`
        //; the star-re-export path must apply it here or `export *` becomes a
        // door for every constant in the file.
        !isComponentName(exportName) ||
        (!isStub && !exportNames.has(exportName) && !starReexport)
      ) {
        continue;
      }
      entries.push({
        name: toName(exportName),
        export: exportName,
        platform,
        path,
        status,
      });
    }
  }
}

// DEDUP AT THE SOURCE. `AREAS` is scanned independently per directory, so two
// web files exporting the same symbol produced two rows for one export: the
// generator wrote 394 rows for 393 real components, and `docs/components.md`
// shipped the duplicate to every consumer. The site generator downstream
// collapsed it — which is why the site's manifest said 393 while the inventory
// said 394 and neither number was wrong about itself.
//
// A registry row is a (platform, name) pair, not a file. Collapse on that key
// HERE so one number reaches every consumer, and keep the collision VISIBLE:
// a same-export duplicate is a rename that missed a file, and it is printed
// rather than swallowed. Two DIFFERENT exports fighting over one (platform,
// name) is a real API ambiguity with no correct resolution here — that fails.
const byRegistryKey = new Map();
const duplicates = [];
for (const entry of entries) {
  const key = `${entry.platform}/${entry.name}`;
  const existing = byRegistryKey.get(key);
  if (existing === undefined) {
    byRegistryKey.set(key, entry);
    continue;
  }
  if (existing.export === entry.export) {
    duplicates.push(
      `${key}: \`${entry.export}\` is exported from both ${existing.path} and ${entry.path} — collapsed to one row`,
    );
    continue;
  }
  console.error(
    `\ngenerate-manifest FAILED — ${key} is claimed by two different exports:\n` +
      `  - ${existing.path}: \`${existing.export}\`\n` +
      `  - ${entry.path}: \`${entry.export}\`\n` +
      "  Two components cannot share one registry name. This is an API\n" +
      "  collision, not a duplicate row: RENAME one of them (see\n" +
      "  .team/reports/kern-split-ruling.md for the precedent) rather than\n" +
      "  deleting a row to make the count match.",
  );
  process.exit(1);
}
if (duplicates.length > 0) {
  console.log(
    `\ngenerate-manifest: ${duplicates.length} same-export duplicate row(s) collapsed:`,
  );
  for (const d of duplicates) console.log(`  ${d}`);
}
entries.length = 0;
entries.push(...byRegistryKey.values());

// (No special cases: every export lives in its component file and the
// entry points re-export. If that ever changes, add an explicit entry here
// instead of guessing.)

// FAIL LOUDLY on a barrel export no scanner could see. Both lists are in hand
// here, so the difference between "this component does not exist" and "this
// component exists and the generator is blind to it" is knowable — and the two
// must never be conflated. Silently dropping the second is exactly how native
// `ExtendedFab` lost its registry row: the generator was deterministic, the
// gate was green, and a "re-run is byte-identical" check passed on a file that
// was wrong in the same way every time. Determinism is not currency.
//
// To exclude a name deliberately, teach a scanner about it above rather than
// listing it here: this failure is for shapes the scanner does not recognise.
if (unseenExports.length > 0) {
  console.error(
    `\ngenerate-manifest FAILED — ${unseenExports.length} barrel export(s) no scanner recognises:`,
  );
  for (const { platform, file, exportName } of unseenExports) {
    console.error(`  - ${platform} ${file}: ${exportName}`);
  }
  console.error(
    "\n  These are exported from the barrel but produced no candidate, so they " +
      "would silently get NO registry row — the ExtendedFab defect. Either the " +
      "export shape is not one the scanner matches, or the name needs an " +
      "explicit exclusion. Do not 'fix' this by deleting the check.",
  );
  process.exit(1);
}

const render = (e) =>
  `  {\n    name: "${e.name}",\n    export: "${e.export}",\n    platform: "${e.platform}",\n    path: "${e.path}",\n    status: "${e.status}",\n  },`;
const out = `// GENERATED by scripts/generate-manifest.mjs — do not hand-edit.
export type ComponentStatus = "real" | "stub";

export type ComponentEntry = {
  name: string;
  export: string;
  platform: "web" | "native";
  path: string;
  status: ComponentStatus;
};

export const COMPONENTS: ComponentEntry[] = [
${entries.map(render).join("\n")}
];
`;
writeFileSync(join(ROOT, "packages/mcp/src/manifest.ts"), out);
console.log(`wrote ${entries.length} entries`);

const sourceModule = `// GENERATED by scripts/generate-manifest.mjs — do not hand-edit.
export const COMPONENT_SOURCES: Record<string, string> = ${JSON.stringify(Object.fromEntries(sourceFiles), null, 2)};
`;
writeFileSync(
  join(ROOT, "packages/mcp/src/component-sources.ts"),
  sourceModule,
);
console.log(`embedded ${sourceFiles.size} component sources`);

const byPlatform = (platform) =>
  entries
    .filter((e) => e.platform === platform)
    .sort((a, b) => a.name.localeCompare(b.name));
const rows = (platform) =>
  byPlatform(platform)
    .map((e) => `| \`${e.name}\` | \`${e.export}\` | ${e.status} |`)
    .join("\n");
const doc = `# Component inventory

Status: current

Generated by \`packages/mcp/scripts/generate-manifest.mjs\` — do not hand-edit.
Real = implemented and exported from the platform entry. Tests may live beside a component or in an aggregate platform suite. Stub = planned placeholder, not exported.

## Web (\`@xoroh/kern\`)

| name | export | status |
|---|---|---|
${rows("web")}

## Native (\`@xoroh/kern/native\`)

| name | export | status |
|---|---|---|
${rows("native")}
`;
writeFileSync(join(ROOT, "docs/components.md"), doc);
console.log("docs/components.md regenerated");
