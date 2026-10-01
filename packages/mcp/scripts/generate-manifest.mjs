// Regenerates ../mcp/src/manifest.ts from the components directories.
// Run from the repo root: bun packages/mcp/scripts/generate-manifest.mjs
// A file counts as real when it contains no "not implemented yet" throw.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
const AREAS = [
  { dir: "packages/kern/src/components", platform: "web" },
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
  const barrelPkg =
    platform === "web"
      ? "packages/kern/src/components"
      : "packages/kern-native/src";
  const barrel = readFileSync(join(ROOT, `${barrelPkg}/index.ts`), "utf8");
  for (const file of readdirSync(join(ROOT, dir)).sort()) {
    if (
      !file.endsWith(".tsx") ||
      file.endsWith(".test.tsx") ||
      file.endsWith(".rntest.tsx")
    )
      continue;
    const src = readFileSync(join(ROOT, dir, file), "utf8");
    const path =
      platform === "web" ? `src/components/${file}` : `src/components/${file}`;
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
        candidates.has(exportName)
      ) {
        continue;
      }
      unseenExports.push({ platform, file, exportName });
    }

    for (const exportName of candidates) {
      if (
        exportName.endsWith("Styles") ||
        exportName.endsWith("Variants") ||
        (!isStub && !exportNames.has(exportName))
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
