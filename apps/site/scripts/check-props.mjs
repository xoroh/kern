#!/usr/bin/env node
/**
 * check-props — the props coverage contract (Part 0 of the redesign).
 *
 * WHY
 *
 * Component pages carry hand-typed `api` arrays. Of six repos audited, only
 * shadcn hand-writes props tables — the rot risk. `generate-props` extracts
 * the truth from source; this gate enforces both halves that are always rot:
 *
 *   ENFORCED: no stale rows. A content `api` name that NOTHING in the
 *   component's type carries — not local, not Base UI passthrough, not even
 *   react-intrinsic — documents nothing. Always a failure, with the part and
 *   prop named. Zero is the only passing count: there is no baseline and no
 *   ratchet (the 471-row burn-down that used to live here is done).
 *
 *   ENFORCED (gate 2, flipped once the burn-down reached zero): coverage.
 *   Every generated (local + Base UI) name missing from the content `api`
 *   fails with the export and prop named. Content still curates — it
 *   documents the props users need without transcribing all 100+
 *   intrinsics — but an undocumented generated prop is now a defect, not
 *   debt. (MUI explicitly omits native props too.)
 *
 * SCOPED ROWS. A row may carry `for: ["PartA", ...]` to document a prop
 * only on the parts whose types carry it (compound families: `nativeButton`
 * on triggers, `initialFocus` on content). Unscoped rows attribute to every
 * part in the file, as always. A scope naming a non-part, a part with no
 * generated export, or a name none of the scoped parts carries is a scope
 * error and fails — a scope that documents nothing is the rot class.
 *
 * SCOPE (stated, not implied)
 *
 * Web content only (`src/content/web`). The generator extracts web Props
 * types; native has no Props-type convention yet. Mobile content is checked
 * when the generator covers it — not silently, this paragraph says so.
 * Type-text and `default` equality are NOT compared (formatting, friendlier
 * rendering). `note` is never generated — what a prop implies is judgment.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readContentApiRows } from "./lib/content-api-names.mjs";
import { computeCoverage } from "./lib/prop-coverage.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const generated = await import(join(SITE, "src", "generated", "props.ts"));
const GEN = generated.GENERATED_PROPS;
const ALL = generated.ALL_PROP_NAMES ?? {};

// Content api rows, per file — one parser shared with generate-props.
const files = readContentApiRows(join(SITE, "src", "content", "web"));

const {
  stale,
  uncovered,
  uncoveredByExport,
  unjudgeable,
  checked,
  scopeErrors,
} = computeCoverage({ gen: GEN, all: ALL, files });

if (scopeErrors.length) {
  console.error(
    `props coverage contract FAILED — ${scopeErrors.length} scoped row(s) document nothing:\n`,
  );
  for (const e of scopeErrors) console.error(`  - ${e}`);
  process.exit(1);
}

if (unjudgeable.length) {
  console.log(
    `unjudgeable (type did not resolve — neither pass nor fail asserted): ${unjudgeable.join(", ")}`,
  );
}

// The stale burn-down is done (471 -> 0 across the gate-2 lane): a content
// `api` name nothing in the part's type carries documents nothing, and the
// gate fails on the first one, with the part and prop named. There is no
// baseline and no ratchet any more — zero is the only passing count.
if (stale.length) {
  console.error(
    `props coverage contract FAILED — ${stale.length} stale row(s) document nothing:\n`,
  );
  for (const v of stale) console.error(`  - ${v}`);
  process.exit(1);
}
console.log(
  `check-props passes: ${checked} web exports cross-checked, stale rows 0.`,
);
if (uncoveredByExport.length) {
  console.error(
    `props coverage contract FAILED — ${uncovered} generated prop(s) not documented:\n`,
  );
  for (const line of uncoveredByExport) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("coverage debt: zero — every generated prop is documented.");
