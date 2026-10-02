#!/usr/bin/env node
/**
 * check:currency — is kern's cited basis for each currency claim ADMISSIBLE?
 *
 * Encodes the admissible-source rule from `.team/reports/SPECS-1-currency.md`:
 *
 *   | claim type                              | MAY cite                                   |
 *   |-----------------------------------------|--------------------------------------------|
 *   | currency / completeness                 | a governing spec page ONLY                 |
 *   | value (is this number right?)           | a spec page, OR a reference implementation |
 *   |                                         | that is NOT behind the spec on that value  |
 *
 * Two directions of falsifiability, both required:
 *   (a) a currency claim citing an implementation/archived/blog source FAILS
 *   (b) a superseded row resolves THROUGH its successor and is NOT flagged stale
 *
 * Naming: kern naming directive — "M3" appears only in prose that genuinely
 * names Google's Material 3 specification. No M3 identifiers in code.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT — the gate currently has NO INPUT, and says so.
 *
 * SPECS-1 finding F8 records that `currency` / `supersededBy` are "instantiated
 * in no registry file (0 matches repo-wide)". This gate therefore reports
 * UNVERIFIABLE and EXITS 1 while zero rows are annotated.
 *
 * That is deliberate. A gate that finds nothing and exits 0 is the most
 * dangerous kind: it looks green, blocks nothing, and will be trusted. The
 * standing rule is that a gate which cannot inspect its evidence must fail
 * loudly rather than pass silently. The moment the fields are instantiated
 * (design-system-lead, per F8), this gate begins validating them with no code
 * change.
 * ---------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

/**
 * The classified citation ledger (SPECS-1 "Citation ledger").
 *
 * `spec`   — a governing spec page; admissible for BOTH currency and value.
 * `value`  — a reference implementation; admissible for VALUE claims only.
 * `archived`— pre-revision export; admissible for NEITHER (superseded by spec).
 */
const LEDGER = new Map([
  ["S1", { class: "spec", family: "overview" }],
  ["S2", { class: "spec", family: "whats-new" }],
  ["S3", { class: "spec", family: "color" }],
  ["S4", { class: "spec", family: "color" }],
  ["S5", { class: "spec", family: "typography" }],
  ["S6", { class: "spec", family: "elevation" }],
  ["S7", { class: "spec", family: "elevation" }],
  ["S8", { class: "spec", family: "shape" }],
  ["S9", { class: "spec", family: "motion" }],
  // material-web token source — a REFERENCE IMPLEMENTATION. Admissible for
  // value, never for currency: it is behind the spec on the thing currency asks
  // about. This is the row the gate exists to catch.
  ["S10", { class: "value", family: "ref-impl" }],
  ["S11", { class: "spec", family: "components" }],
  ["S12", { class: "spec", family: "easing" }],
  ["S13", { class: "spec", family: "states" }],
  ["S14", { class: "spec", family: "states" }],
  ["S15", { class: "spec", family: "layout" }],
  ["S-CAROUSEL", { class: "spec", family: "carousel" }],
  ["S-TIME-PICKERS", { class: "spec", family: "time-pickers" }],
  ["S-SEGMENTED-BUTTONS", { class: "spec", family: "buttons" }],
  ["S-SEG-BUTTONS", { class: "spec", family: "buttons" }],
  ["S-NAV-DRAWER", { class: "spec", family: "navigation" }],
  ["S-NAV-RAIL", { class: "spec", family: "navigation" }],
  // Archived pre-revision export: admissible for neither.
  ["S-ARCHIVED-TOKENS", { class: "archived", family: "archived" }],
  // Known non-spec sources, so a claim citing one is named rather than merely
  // "unresolvable".
  ["S-MW-README", { class: "value", family: "ref-impl" }],
]);

const violations = [];

/** Collect `{ id, currency, value, supersededBy }` from registry row sources. */
function collectClaims(dir, out = [], depth = 0) {
  if (depth > 6) return out;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === "dist" || e.name === ".git") continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      collectClaims(full, out, depth + 1);
      continue;
    }
    if (!/\.(ts|tsx|mjs|js|json)$/.test(e.name)) continue;
    let text;
    try {
      text = readFileSync(full, "utf8");
    } catch {
      continue;
    }
    // Only annotations that actually exist are claims. A bare `spec:` field is
    // NOT a currency claim — that is the pre-F8 state of the whole repo.
    for (const m of text.matchAll(
      /currency\s*[:=]\s*["'`]([A-Z0-9][A-Z0-9-]*)["'`]/g,
    )) {
      out.push({ file: full, kind: "currency", id: m[1] });
    }
    for (const m of text.matchAll(
      /value\s*[:=]\s*["'`]([A-Z0-9][A-Z0-9-]*)["'`]/g,
    )) {
      out.push({ kind: "value", id: m[1] });
    }
    for (const m of text.matchAll(
      /superseded[-_]?[Bb]y\s*[:=]\s*["'`]([A-Z0-9][A-Z0-9-]*)["'`]/g,
    )) {
      out.push({ kind: "supersededBy", id: m[1] });
    }
  }
  return out;
}

const claims = collectClaims(join(ROOT, "parity"));

const currencyClaims = claims.filter((c) => c.kind === "currency");
const superseded = claims.filter((c) => c.kind === "supersededBy");

// --- superseded-by must RESOLVE to a ledger id, never a free-text URL --------
// The replacement always has to resolve, so the chain terminates at something
// real rather than at a URL someone can edit into anything.
for (const c of superseded) {
  if (!LEDGER.has(c.id)) {
    violations.push(
      `unresolvable successor: superseded-by "${c.id}" is not a ledger id`,
    );
  }
}

// --- the admissible-source rule ---------------------------------------------
for (const c of currencyClaims) {
  const entry = LEDGER.get(c.id);
  if (!entry) {
    violations.push(`unresolvable citation: "${c.id}"`);
    continue;
  }
  if (entry.class !== "spec") {
    violations.push(
      `inadmissible currency source: "${c.id}" (${entry.family}) — a currency claim must cite a governing spec page, never an implementation or an archived export`,
    );
  }
}

const report = (extra) => {
  console.log(`  claims       ${claims.length}`);
  console.log(`  currency     ${currencyClaims.length}`);
  console.log(`  superseded   ${superseded.length}`);
  if (extra) console.log(extra);
};

if (currencyClaims.length === 0) {
  console.log("  UNVERIFIABLE — no annotated currency claims found");
  report(
    "\ncheck:currency UNVERIFIABLE — 0 currency claims in parity/.\nSPECS-1 F8: the `currency` / `supersededBy` fields are not yet\ninstantiated on any registry row, so there is nothing to validate.\n\nThis gate deliberately EXITS 1 rather than 0. A gate with no input that\npasses looks green, blocks nothing, and gets trusted. It will start\nvalidating the moment the fields exist, with no change to this file.",
  );
  process.exit(1);
}

report(
  superseded.length
    ? `  superseded rows resolve through their successor — NOT stale`
    : "",
);

if (violations.length) {
  console.error(`\ncheck:currency FAILED — ${violations.length} problem(s):`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log(
  `\ncurrency gate passes: ${currencyClaims.length} claim(s), all spec-page-backed`,
);
