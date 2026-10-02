#!/usr/bin/env node
/**
 * check:coverage — every shipped web component is exercised by a test.
 *
 * ## The rule
 *
 * Every module exported from `packages/kern/src/components/index.ts` must be
 * imported by at least one test file. A component that ships with nothing
 * exercising it is a component whose behaviour is asserted nowhere.
 *
 * ## Why this is an IMPORT check and not a "colocated test" check
 *
 * The obvious formulation — "every component needs its own `x.test.tsx`" — is
 * WRONG for this repo, and building it would have been a real mistake.
 *
 * Coverage here is mostly provided by GROUPED CONTRACT SUITES. As of this
 * writing, 81 component modules are covered by 33 test files, because suites
 * like `data-display.test.tsx`, `overlays.test.tsx` and `forms.test.tsx` each
 * exercise ten components across one behavioural contract (role, name, state,
 * keyboard). A 1:1 rule would have demanded ~81 new files to satisfy a property
 * that is ALREADY fully satisfied, and every one of those files would have been
 * theatre.
 *
 * The property worth asserting is therefore coverage, not file layout. A test
 * that imports the component and drives it counts, however it is organised.
 *
 * ## What this catches
 *
 * The failure mode is a NEW component landing without anything exercising it.
 * That is not hypothetical here: this gate did not exist while P2-1 was
 * assembled, and the row's proof column ("component test per item") stated an
 * intent that nothing enforced.
 *
 * ## A correction this gate exists to prevent
 *
 * While building this, the author claimed seven P2-1 components "shipped with
 * zero tests". That was wrong: they had no *colocated* 1:1 test file, and every
 * one of them was already covered by a grouped contract suite (verified by
 * running this exact analysis against the tree before P2-1 — 81/81 covered).
 * Writing the check first is what surfaced it; the claim had been made from
 * `ls` output, which answers a layout question and was read as a coverage one.
 *
 * The four defects P2-1 found were real and two were genuine behaviour bugs.
 * The framing that produced them was not.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const COMPONENTS = join(ROOT, "packages", "kern", "src", "components");

function fail(message, lines) {
  console.error(`\ncheck:coverage FAILED — ${message}`);
  for (const l of lines) console.error(`  - ${l}`);
  console.error(
    "\n  A component nothing exercises can lose its contract silently. Add it to\n" +
      "  a grouped contract suite, or give it its own colocated test — either\n" +
      "  satisfies this gate. A one-line placeholder test does not.",
  );
  process.exit(1);
}

if (!existsSync(COMPONENTS)) {
  console.error(`check:coverage — ${COMPONENTS} does not exist`);
  process.exit(1);
}

const files = readdirSync(COMPONENTS);
/**
 * Modules in this directory that are not components, each with its reason.
 * An exclusion list is only honest if it says WHY — otherwise it is a place to
 * hide a component nobody wrote a test for.
 */
const NOT_A_COMPONENT = new Map([
  ["index", "the barrel itself"],
  [
    "menu-classes",
    "shared class-name strings for the menu family, not a component",
  ],
]);

const isTest = (f) => f.includes(".test.");
// `.ts` as well as `.tsx`: `app-ready` is a non-JSX component, and a gate that
// only collects `.tsx` silently treats it as absent rather than uncovered. That
// is the worst failure mode for a coverage gate — reporting a clean pass over a
// component it never looked at.
const isComponent = (f) => /\.tsx?$/.test(f) && !isTest(f);
const componentFiles = files.filter(isComponent);
const testFiles = files.filter((f) => /\.test\.tsx?$/.test(f));

const stripExt = (f) => f.replace(/\.tsx?$/, "");
const moduleNames = new Set(
  componentFiles.map(stripExt).filter((m) => !NOT_A_COMPONENT.has(m)),
);

// The barrel is the public surface: a module nobody re-exports is not reachable
// by a consumer, so it is not what this gate should be measuring. Read the
// barrel the same way `check:primitives` does, rather than asserting on the
// directory listing.
const barrel = readFileSync(join(COMPONENTS, "index.ts"), "utf8");
const exported = new Set(
  [...barrel.matchAll(/from\s+"\.\/([A-Za-z0-9_-]+)"/g)].map((m) => m[1]),
);

// Resolve each test's relative imports the same way — a real specifier parse,
// not a substring search for a filename, which would also match a mention in a
// comment and is the proxy-for-the-property mistake this repo keeps paying for.
const covered = new Set();
for (const t of testFiles) {
  const src = readFileSync(join(COMPONENTS, t), "utf8");
  for (const m of src.matchAll(/from\s+"\.\/([A-Za-z0-9_-]+)"/g)) {
    if (moduleNames.has(m[1])) covered.add(m[1]);
  }
}

const uncovered = [...exported].filter((m) => !covered.has(m)).sort();
const unexported = [...moduleNames].filter((m) => !exported.has(m)).sort();

if (unexported.length) {
  fail(
    `${unexported.length} component file(s) exist but are not exported from the barrel`,
    unexported.map((m) => `${m} (no reason given in NOT_A_COMPONENT)`),
  );
}

if (uncovered.length) {
  fail(
    `${uncovered.length} exported component(s) are not exercised by any test`,
    uncovered.map((m) => {
      const f = componentFiles.find((c) => stripExt(c) === m);
      return `${m}  (packages/kern/src/components/${f})`;
    }),
  );
}

console.log("check:coverage — every shipped web component is exercised");
console.log(`  components      ${moduleNames.size}`);
console.log(`  test files      ${testFiles.length}`);
console.log(`  exported        ${exported.size}`);
console.log(`  exercised       ${covered.size}`);
console.log(
  `\ncoverage holds: every one of the ${exported.size} exported components is imported`,
);
console.log("by at least one test (grouped contract suites count).");
