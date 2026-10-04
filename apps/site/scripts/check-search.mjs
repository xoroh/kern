#!/usr/bin/env bun
/**
 * check-search — the scoring contract, executed (Part 2 of the redesign).
 *
 * WHY
 *
 * The palette and /search share one ranking. That ranking is the difference
 * between "local search" and "a filter box": exact > prefix > boundary >
 * substring > title-fuzzy > hint. The tiers are stated in `systems/search/score.ts`;
 * this gate executes them against fixtures. If a tier regresses (a refactor
 * drops fuzzy, a reorder demotes prefix), this fails — run it, watch it red
 * by deleting the fuzzy line in score.ts, watch it green on restore.
 *
 * Run with bun (it imports the TS scorer directly — no bundle, no aliases,
 * no test framework; the site has none wired and this gate is the honest
 * vehicle, not a smuggled one).
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const { rankEntries, scoreEntry } = await import(
  join(SITE, "src", "systems", "search", "score.ts")
);

const INDEX = [
  { title: "Button", hint: "Carry out an action with a single press" },
  { title: "Dialog", hint: "Modal tasks and decisions" },
  { title: "SearchBar", hint: "Shell furniture block" },
  { title: "App bar", hint: "Top app bar" },
  { title: "NavigationDrawer", hint: "Side navigation sheet" },
  { title: "Snackbar", hint: "Brief messages at the bottom" },
];

let failures = 0;
function top(query) {
  const ranked = rankEntries(query, INDEX);
  return ranked.length ? ranked[0].title : "(none)";
}
function check(query, expected, why) {
  const got = top(query);
  if (got !== expected) {
    console.error(
      `  - "${query}": expected "${expected}", got "${got}". ${why}`,
    );
    failures += 1;
  }
}

// Tiers, highest first — each query isolates one tier as the winner.
check("button", "Button", "exact match must win outright.");
check("but", "Button", "prefix must beat any weaker tier.");
check("bar", "App bar", "word-boundary start must beat mid-word substring.");
check(
  "alog",
  "Dialog",
  "substring must still rank when nothing stronger hits.",
);
check("single press", "Button", "hint text must match when no title does.");
// Fuzzy — the Part 2 increment. Abbreviations and dropped letters.
check("dlg", "Dialog", "abbreviation must resolve via subsequence.");
check("buton", "Button", "dropped letter must resolve via subsequence.");
check("snkbar", "Snackbar", "consonant skeleton must resolve.");
// Fuzzy ranks BELOW every contiguous tier, not above it.
{
  const sSub = scoreEntry("alog", { title: "Dialog", hint: "" });
  const sFuzz = scoreEntry("dlg", { title: "Dialog", hint: "" });
  if (!(sSub > sFuzz && sFuzz > 0)) {
    console.error(
      `  - tier order broken: substring=${sSub}, fuzzy=${sFuzz} (need sub > fuzz > 0).`,
    );
    failures += 1;
  }
  const sHint = scoreEntry("tasks", { title: "Dialog", hint: "Modal tasks" });
  if (!(sFuzz > sHint && sHint > 0)) {
    console.error(
      `  - tier order broken: fuzzy=${sFuzz}, hint=${sHint} (need fuzz > hint > 0).`,
    );
    failures += 1;
  }
}
// Empties.
if (rankEntries("", INDEX).length !== 0) {
  console.error("  - empty query must return no results.");
  failures += 1;
}
if (rankEntries("zzzqqq", INDEX).length !== 0) {
  console.error("  - unmatchable query must return no results.");
  failures += 1;
}

if (failures) {
  console.error(
    `check-search FAILED: ${failures} scoring assertion(s) broken.`,
  );
  process.exit(1);
}
console.log(
  "check-search passes: tiers exact > prefix > boundary > substring > title-fuzzy > hint hold, fuzzy resolves abbreviations and dropped letters.",
);
