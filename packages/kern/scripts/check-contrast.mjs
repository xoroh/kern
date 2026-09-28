// Certifies WCAG 2.x contrast for every tonal pair in themes/m3.json.
// Run from the repo root: bun packages/kern/scripts/check-contrast.mjs
// Exits non-zero on any text-pair failure. No dependencies (pure math).
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
const M = JSON.parse(
  readFileSync(join(ROOT, "packages/kern/src/theme/themes/m3.json"), "utf8"),
);

function lum(hex) {
  const c = hex
    .replace("#", "")
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [on-role, fill role, minimum ratio]
const PAIRS = [
  ["onPrimary", "primary", 4.5],
  ["onPrimaryContainer", "primaryContainer", 4.5],
  ["onSecondary", "secondary", 4.5],
  ["onSecondaryContainer", "secondaryContainer", 4.5],
  ["onTertiary", "tertiary", 4.5],
  ["onTertiaryContainer", "tertiaryContainer", 4.5],
  ["onError", "error", 4.5],
  ["onErrorContainer", "errorContainer", 4.5],
  ["onSuccess", "success", 4.5],
  ["onSuccessContainer", "successContainer", 4.5],
  ["onWarning", "warning", 4.5],
  ["onWarningContainer", "warningContainer", 4.5],
  ["onSurface", "surface", 4.5],
  ["onSurfaceVariant", "surface", 4.5],
  ["inverseOnSurface", "inverseSurface", 4.5],
];

let failures = 0;
for (const mode of ["light", "dark"]) {
  const roles = M.color[mode];
  for (const [fg, bg, min] of PAIRS) {
    if (!(fg in roles) || !(bg in roles)) {
      console.log(`SKIP ${mode} ${fg}/${bg} (role absent)`);
      continue;
    }
    const r = ratio(roles[fg], roles[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"} ${mode} ${fg}/${bg} = ${r.toFixed(2)}:1 (min ${min})`,
    );
  }
}
if (failures > 0) {
  console.log(`\n${failures} pair(s) below threshold`);
  process.exit(1);
}
console.log("\nall pairs pass");
