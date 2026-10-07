#!/usr/bin/env bun
/**
 * check:theme-matrix — the P5C theming gate.
 *
 * 1. SYNC. The committed `themes/matrix.json` must equal what the live
 *    resolver produces. A hand-edit to the artifact (or a code change that
 *    moves a rendered value) fails here with the regen command, not silently.
 * 2. SINGLE ROLE TABLE. Every cell carries exactly the kern role set —
 *    presets extend kern via overrides, never a second role table.
 * 3. CATALOG DISCIPLINE. Every `themes/index.json` entry resolves to a file
 *    whose `extends` canonicalizes to kern, and whose overrides touch only
 *    known color/shape roles.
 * 4. COVERAGE. The matrix spans the full mode x contrast x preset cross
 *    product, and the legacy `m3` alias still resolves to kern.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { assertSingleRoleTable, buildThemeMatrix } from "../src/pipeline.ts";
import { resolveTheme, resolveThemeDetails, themeIds } from "../src/resolve.ts";

const ROOT = new URL("../../..", import.meta.url).pathname;
const THEMES = join(ROOT, "packages/kern-tokens/src/themes");
const violations = [];

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

// 1. SYNC --------------------------------------------------------------------
const committedPath = join(THEMES, "matrix.json");
if (!existsSync(committedPath)) {
  violations.push(
    "packages/kern-tokens/src/themes/matrix.json is missing — run `bun packages/kern-tokens/scripts/gen-theme-matrix.mjs`",
  );
} else {
  const committed = readFileSync(committedPath, "utf8");
  const fresh = `${stable(buildThemeMatrix())}\n`;
  if (committed !== fresh) {
    violations.push(
      "packages/kern-tokens/src/themes/matrix.json drifted from the live resolver — " +
        "run `bun packages/kern-tokens/scripts/gen-theme-matrix.mjs` and commit the result. " +
        "If the diff moves a rendered value, that is a D6 defect, not a regen.",
    );
  }
}

// 2. SINGLE ROLE TABLE --------------------------------------------------------
try {
  assertSingleRoleTable(buildThemeMatrix());
} catch (error) {
  violations.push(error.message);
}

// 3. CATALOG DISCIPLINE -------------------------------------------------------
{
  const catalog = JSON.parse(readFileSync(join(THEMES, "index.json"), "utf8"));
  const base = resolveThemeDetails("light", "standard", "kern");
  const colorRoles = new Set(Object.keys(base.color));
  const shapeRoles = new Set(Object.keys(base.shape));
  for (const entry of catalog.themes ?? []) {
    const file = join(THEMES, entry.file);
    if (!existsSync(file)) {
      violations.push(
        `themes/index.json lists "${entry.id}" -> ${entry.file}, which does not exist`,
      );
      continue;
    }
    if (entry.id === "kern") continue;
    const preset = JSON.parse(readFileSync(file, "utf8"));
    const extendsBase =
      preset.extends === undefined || preset.extends === "m3"
        ? "kern"
        : preset.extends;
    if (extendsBase !== "kern") {
      violations.push(
        `themes/${entry.file}: extends "${preset.extends}" — presets must extend "kern", never a second role table`,
      );
    }
    for (const mode of ["light", "dark"]) {
      for (const role of Object.keys(preset.overrides?.color?.[mode] ?? {})) {
        if (!colorRoles.has(role)) {
          violations.push(
            `themes/${entry.file}: override color.${mode}.${role} is not a kern color role`,
          );
        }
      }
    }
    for (const shape of Object.keys(preset.overrides?.shape ?? {})) {
      if (!shapeRoles.has(shape)) {
        violations.push(
          `themes/${entry.file}: override shape.${shape} is not a kern shape role`,
        );
      }
    }
  }
  const ids = new Set((catalog.themes ?? []).map((entry) => entry.id));
  for (const id of themeIds()) {
    if (id !== "kern" && !ids.has(id)) {
      violations.push(
        `resolveThemeDetails knows preset "${id}" but themes/index.json does not catalog it`,
      );
    }
  }
}

// 4. COVERAGE -----------------------------------------------------------------
{
  const matrix = buildThemeMatrix();
  const modes = ["light", "dark"];
  const contrasts = ["standard", "medium", "high"];
  const expected = modes.length * contrasts.length * themeIds().length;
  if (matrix.cells.length !== expected) {
    violations.push(
      `theme matrix has ${matrix.cells.length} cells, expected the full cross product ${expected} ` +
        `(2 modes x 3 contrasts x ${themeIds().length} presets)`,
    );
  }
  const seen = new Set(
    matrix.cells.map((cell) => `${cell.mode}/${cell.contrast}/${cell.preset}`),
  );
  for (const mode of modes) {
    for (const contrast of contrasts) {
      for (const preset of themeIds()) {
        if (!seen.has(`${mode}/${contrast}/${preset}`)) {
          violations.push(
            `theme matrix is missing cell ${mode}/${contrast}/${preset}`,
          );
        }
      }
    }
  }
  // Legacy alias: "m3" canonicalizes to kern, so it resolves identically.
  const legacy = resolveTheme("light", "standard", "m3");
  const kern = resolveTheme("light", "standard", "kern");
  if (stable(legacy) !== stable(kern)) {
    violations.push('legacy preset alias "m3" no longer resolves to kern');
  }
}

if (violations.length > 0) {
  console.error(`theme matrix violations (${violations.length}):`);
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log(
  `theme matrix passes: ${buildThemeMatrix().cells.length} cells in sync, ` +
    `single role table, catalog extends kern, legacy alias resolves`,
);
