// Generates src/themes/matrix.json from the live resolver.
// Run from the repo root: bun packages/kern-tokens/scripts/gen-theme-matrix.mjs
// The output is the CI-visible artifact for "what does this preset change?":
// every mode x contrast x preset context, flattened. check:theme-matrix
// fails when the committed file drifts from what this script produces.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildThemeMatrix } from "../src/pipeline.ts";

const ROOT = new URL("../../..", import.meta.url).pathname;

/** Deterministic serialization: object keys sorted recursively. */
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

const matrix = buildThemeMatrix();
writeFileSync(
  join(ROOT, "packages/kern-tokens/src/themes/matrix.json"),
  `${stable(matrix)}\n`,
);
console.log(
  `theme matrix: ${matrix.cells.length} cells ` +
    `(${matrix.modes.length} modes x ${matrix.contrasts.length} contrasts x ${matrix.presets.length} presets)`,
);
