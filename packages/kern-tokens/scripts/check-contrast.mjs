// Certifies semantic role-pair contrast in every shipped mode/context.
// Run from repo root: bun packages/kern-tokens/scripts/check-contrast.mjs
//
// GATE SHAPE (D-026.5', re-ruled by D-028): pairs are GENERATED from role
// families, not hand-listed, and the ORPHAN LAW makes the gate falsifiable over
// the role space — a role that exists in a scheme but is reached by no
// generated pair, and is not explicitly waived, is a failure. A gate that
// passes because it did not look is worse than a gate that fails.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  activeWaivers,
  contrastIssues,
  orphanedRoles,
  textRolePairs,
  uiRolePairs,
} from "../src/contrast.ts";

const ROOT = new URL("../../..", import.meta.url).pathname;
const M3 = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-tokens/src/themes/m3.json"), "utf8"),
);
const SHARP = JSON.parse(
  readFileSync(
    join(ROOT, "packages/kern-tokens/src/themes/sharp.json"),
    "utf8",
  ),
);
const BRAND = JSON.parse(
  readFileSync(
    join(ROOT, "packages/kern-tokens/src/themes/brand.json"),
    "utf8",
  ),
);
const TOKENS = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-tokens/src/tokens.json"), "utf8"),
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

const textPairs = textRolePairs();
const uiPairs = uiRolePairs();
const orphansSeen = new Set();
const waivedSeen = new Set();

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

      // Orphan law: every role in the scheme must be reached by a generated
      // pair, or be an explicitly named waiver.
      for (const orphan of orphanedRoles(roles)) {
        const line = `FAIL orphan role: ${orphan}`;
        if (!orphansSeen.has(line)) {
          console.error(`${line} [${presetId}/${mode}-${contrast}]`);
          orphansSeen.add(line);
        }
        issues++;
      }
      for (const [role, reason] of activeWaivers(roles)) {
        waivedSeen.add(`${role}: ${reason}`);
      }
    }
  }
}

if (issues > 0) {
  console.error(`${issues} contrast check(s) failed`);
  process.exit(1);
}
const waived = [...waivedSeen];
console.log(
  `WCAG contrast passes: ${textPairs.length} text + ${uiPairs.length} UI GENERATED role pairs ` +
    `across 3 presets x 2 modes x 3 contrast levels (${textPairs.length * 18 + uiPairs.length * 18} checks); ` +
    `0 orphan roles; all colors are canonical tokens`,
);
if (waived.length > 0) {
  console.log(`Waived from contrast gating (${waived.length}, per-role):`);
  for (const line of waived) console.log(`  - ${line}`);
}
