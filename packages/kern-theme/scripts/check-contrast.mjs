// Certifies semantic role-pair contrast in every shipped mode/context.
// Run from repo root: bun packages/kern-theme/scripts/check-contrast.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  contrastIssues,
  TEXT_ROLE_PAIRS,
  UI_ROLE_PAIRS,
} from "../src/contrast.ts";

const ROOT = new URL("../../..", import.meta.url).pathname;
const M3 = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-theme/src/themes/m3.json"), "utf8"),
);
const SHARP = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-theme/src/themes/sharp.json"), "utf8"),
);
const BRAND = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-theme/src/themes/brand.json"), "utf8"),
);
const TOKENS = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-theme/src/tokens.json"), "utf8"),
);
const allowedColors = new Set([
  ...Object.values(TOKENS.palettes).flatMap((palette) =>
    Object.values(palette).map((step) => step.srgb.toLowerCase()),
  ),
  ...Object.values(TOKENS.base).map((value) => value.srgb.toLowerCase()),
]);
let issues = 0;

const colorTables = [
  ...Object.values(M3.color),
  ...Object.values(M3.contrast),
  ...[SHARP, BRAND].flatMap((theme) =>
    Object.values(theme.overrides?.color ?? {}).filter(Boolean),
  ),
];
for (const roles of colorTables) {
  for (const [role, value] of Object.entries(roles)) {
    if (!allowedColors.has(value.toLowerCase())) {
      console.error(
        `FAIL token source: ${role} ${value} is not in tokens.json`,
      );
      issues++;
    }
  }
}

for (const [presetId, preset] of [
  ["m3", { overrides: {} }],
  ["sharp", SHARP],
  ["brand", BRAND],
]) {
  for (const mode of ["light", "dark"]) {
    for (const [contrast, minimum] of [
      ["standard", 4.5],
      ["medium", 4.5],
      ["high", 7],
    ]) {
      const roles = {
        ...M3.color[mode],
        ...(contrast === "standard" ? {} : M3.contrast[`${mode}-${contrast}`]),
        ...(preset.overrides?.color?.[mode] ?? {}),
      };
      const failures = contrastIssues(roles, minimum, 3);
      for (const failure of failures) {
        console.error(`FAIL ${presetId}/${mode}-${contrast}: ${failure}`);
        issues++;
      }
    }
  }
}

if (issues > 0) {
  console.error(`${issues} contrast check(s) failed`);
  process.exit(1);
}
console.log(
  `WCAG contrast passes: ${TEXT_ROLE_PAIRS.length + UI_ROLE_PAIRS.length} role pairs across 3 presets × 2 modes × 3 contrast levels; all colors are canonical tokens`,
);
