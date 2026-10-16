// Emits a preset as plain CSS custom properties (KERN-066).
// Run from the repo root:
//   bun packages/kern-tokens/scripts/gen-preset-css.mjs --preset <id|#hex> --out <file>
// A CustomTheme resolves to role tables per mode; this projects light to
// `:root` and dark to `.dark`, so a consumer that cannot run the JS resolver —
// or must not shift visuals during migration — gets the exact values as CSS.
// Deterministic output; the file it writes is the consumer's, not a generated
// artifact of this repo (no registry entry).
import { writeFileSync } from "node:fs";
import { material3PresetRegistrations } from "../../kern-material-3/src/material-3.ts";
import { registerPreset } from "../src/resolve.ts";

// Explicit registration into THIS resolver instance (source). The M3 module's
// own import-time registration targets the built package instance, which
// scripts must not rely on — register here so resolution never depends on dist.
for (const { id, tables } of material3PresetRegistrations())
  registerPreset(id, tables);

import { themeFromSeed } from "../../kern-material-3/src/seed-theme.ts";
import { resolveThemeDetails, varName as roleVar } from "../src/resolve.ts";

const args = process.argv.slice(2);
const at = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const id = at("--preset") ?? "xoroh";
const out = at("--out");
if (!out) {
  console.error("gen-preset-css: --out <file> is required.");
  process.exit(1);
}

const selection = id.startsWith("#")
  ? themeFromSeed(id, `seed-${id.slice(1)}`)
  : id;
const light = resolveThemeDetails("light", "standard", selection).color;
const dark = resolveThemeDetails("dark", "standard", selection).color;

const block = (selector, table) =>
  `${selector} {\n` +
  Object.entries(table)
    .map(([role, value]) => `  ${roleVar(role)}: ${value};`)
    .join("\n") +
  `\n}`;

writeFileSync(
  out,
  `/* Preset "${id}" as CSS — emitted by kern gen-preset-css. Do not hand-edit;\n * re-run the generator. Light on :root, dark on .dark. */\n${block(":root", light)}\n\n${block(".dark", dark)}\n`,
);
console.log(`preset "${id}" written to ${out}`);
