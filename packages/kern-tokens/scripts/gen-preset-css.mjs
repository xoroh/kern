// Emits a preset as plain CSS custom properties (KERN-066).
// Run from the repo root:
//   bun packages/kern-tokens/scripts/gen-preset-css.mjs --preset xoroh --out <file>
// A CustomTheme (including XOROH_PRESET) resolves to role tables per mode;
// this projects light to `:root` and dark to `.dark`, so a consumer that
// cannot run the JS resolver — or must not shift visuals during migration —
// gets the exact values as CSS. Deterministic output; the file it writes is
// the consumer's, not a generated artifact of this repo (no registry entry).
import { writeFileSync } from "node:fs";
import { resolveThemeDetails } from "../src/resolve.ts";
import { XOROH_PRESET } from "../src/xoroh-preset.ts";
import { themeFromSeed } from "../src/seed-theme.ts";
import { varName as roleVar } from "../src/resolve.ts";

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

const selection =
  id === "xoroh"
    ? XOROH_PRESET
    : id.startsWith("#")
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
