#!/usr/bin/env node
/**
 * check-grammar — the Phase 3 docs page grammar gate.
 *
 * WHAT IT ASSERTS
 *
 * Every component page follows one grammar —
 * lede → demo → props → tokens → semantic-dom → accessibility →
 * limitations → faq → spec — and the assertion is structural, not visual:
 *
 *   1. TEMPLATE ORDER: the h2 `Heading` ids in `component-page.tsx`, in
 *      source order, equal `GRAMMAR_ORDER` from `src/systems/grammar.ts`
 *      exactly. A section added, dropped or moved fails here.
 *   2. TOC AGREEMENT: the "On this page" rail lists the same ids in the same
 *      order. A rail that names a section the page does not render (or omits
 *      one it does) fails here, not in a reader's click.
 *   3. PREDICATE WIRING: the page assembly applies the shared predicates
 *      (`hasSemanticDom` / `hasLimitations` / `hasFaq`) rather than inline
 *      conditions of its own. An inline condition is a second opinion on
 *      when a section renders, and second opinions drift.
 *   4. LEDE: the header renders the h1, the one-liner and the features prose.
 *      The grammar's first slot is not a section, so order cannot assert it —
 *      presence is asserted instead.
 *   5. CONTENT WELL-FORMEDNESS, per doc: every `faq` row carries a non-empty
 *      question and answer; a present `grammarExempt` carries a non-empty
 *      reason (a blank exemption is an unfinished thought, not an excuse).
 *      Exempt pages are LISTED, and skipped by the order checks — known
 *      debt, not a silent pass.
 *
 * WHAT IT DOES NOT ASSERT (stated, not implied)
 *
 * The per-doc RENDERED order is not re-derived: the template is fixed, so a
 * page's rendered h2 sequence is `expectedSections(doc)` by construction, and
 * re-simulating JSX in a gate would assert the simulator, not the page. What
 * the gate pins instead is every input to that construction — the order, the
 * rail, the predicates, and the data — plus a coverage count per conditional
 * section, so a grammar that renders nowhere is visible in the log.
 *
 * Run from apps/site (`bun run check:docs`), or directly:
 *   node scripts/check-grammar.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  exemptionReason,
  expectedSections,
  GRAMMAR_CONDITIONAL,
  GRAMMAR_ORDER,
  GRAMMAR_REQUIRED,
} from "../src/systems/grammar.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const CONTENT = join(APP, "src", "content");
const PAGE = join(APP, "src", "components", "docs", "component-page.tsx");

const errors = [];
const fail = (m) => errors.push(m);

// ---------------------------------------------------------------- template
const src = readFileSync(PAGE, "utf8");

// h2 headings per section component: every <Heading> WITHOUT level={3}.
// Components are top-level `function X(`, so the source splits into chunks
// and each chunk's h2 set is the section's — both branches of a conditional
// section carry the same id (only one renders), which is asserted as a set.
const SECTION_OF = {
  Demo: "demo",
  ApiReference: "props",
  Theming: "tokens",
  SemanticDom: "semantic-dom",
  Accessibility: "accessibility",
  Limitations: "limitations",
  Faq: "faq",
  Conformance: "spec",
};

const chunks = src.split(/^(?:export )?function /m);
const h2BySection = new Map();
for (const chunk of chunks) {
  const name = chunk.slice(0, chunk.indexOf("(")).trim();
  if (!Object.hasOwn(SECTION_OF, name)) continue;
  const ids = new Set();
  for (const m of chunk.matchAll(/<Heading\b([^>]*)>/g)) {
    if (/level=\{3\}/.test(m[1])) continue;
    const id = m[1].match(/id="([^"]+)"/);
    if (id) ids.add(id[1]);
  }
  h2BySection.set(name, [...ids]);
}

for (const [component, want] of Object.entries(SECTION_OF)) {
  const got = h2BySection.get(component);
  if (!got) {
    fail(`section component ${component} not found in component-page.tsx`);
  } else if (got.join(",") !== want) {
    fail(
      `section ${component} renders h2 [${got.join(", ")}], want [${want}] — ` +
        `one h2 per grammar slot, both branches alike`,
    );
  }
}

// Render order: the section components in assembly order inside ComponentPage.
const assemblyStart = src.indexOf("export function ComponentPage");
const assembly = assemblyStart === -1 ? "" : src.slice(assemblyStart);
const order = [];
for (const m of assembly.matchAll(
  /<(Demo|ApiReference|Theming|SemanticDom|Accessibility|Limitations|Faq|Conformance)\b/g,
)) {
  if (order.at(-1) !== m[1]) order.push(m[1]);
}
const h2s = order.map((c) => SECTION_OF[c]);

if (h2s.join("\n") !== GRAMMAR_ORDER.join("\n")) {
  fail(
    `rendered h2 order [${h2s.join(", ")}] is not the grammar ` +
      `[${GRAMMAR_ORDER.join(", ")}] — sections render in grammar order and no other`,
  );
}

// The rail: hrefs inside OnThisPage, in order.
const railStart = src.indexOf("function OnThisPage");
const railEnd = src.indexOf("function TocLink");
const rail = [];
if (railStart === -1 || railEnd === -1 || railEnd < railStart) {
  fail("cannot locate OnThisPage / TocLink in component-page.tsx");
} else {
  const railSrc = src.slice(railStart, railEnd);
  for (const m of railSrc.matchAll(/href="#([^"]+)"/g)) rail.push(m[1]);
  if (rail.join("\n") !== GRAMMAR_ORDER.join("\n")) {
    fail(
      `OnThisPage rail [${rail.join(", ")}] is not the grammar ` +
        `[${GRAMMAR_ORDER.join(", ")}] — the rail mirrors the sections exactly`,
    );
  }
}

// Predicate wiring: the assembly gates conditional sections on the shared
// predicates, not on inline conditions.
for (const pred of [
  "hasSemanticDom(doc)",
  "hasLimitations(doc)",
  "hasFaq(doc)",
]) {
  if (!src.includes(pred)) {
    fail(
      `component-page.tsx never applies ${pred} — a conditional section gated ` +
        `on an inline condition is a second opinion that will drift`,
    );
  }
}

// Lede presence: h1 + one-liner + features prose in the header.
for (const [what, needle] of [
  ["h1", "<h1"],
  ["one-liner", "doc.oneLiner"],
  ["features prose", "doc.features"],
]) {
  if (!src.includes(needle)) {
    fail(
      `lede is missing its ${what} (${needle}) — the grammar starts with the lede`,
    );
  }
}

// The required/conditional split must cover the order exactly once.
const split = [...GRAMMAR_REQUIRED, ...GRAMMAR_CONDITIONAL].sort();
if (split.join("\n") !== [...GRAMMAR_ORDER].sort().join("\n")) {
  fail(
    "GRAMMAR_REQUIRED + GRAMMAR_CONDITIONAL do not partition GRAMMAR_ORDER — " +
      "a section that is neither required nor conditional is unasserted",
  );
}

// ---------------------------------------------------------------- content
async function loadContent() {
  const docs = [];
  for (const platform of ["web", "mobile"]) {
    const dir = join(CONTENT, platform);
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    } catch {
      continue;
    }
    for (const file of files.sort()) {
      const mod = await import(join(dir, file));
      for (const value of Object.values(mod)) {
        if (value && typeof value === "object" && "slug" in value) {
          docs.push({ platform, file: `${platform}/${file}`, doc: value });
        }
      }
    }
  }
  return docs;
}

const pages = await loadContent();
if (pages.length === 0) {
  fail(
    "no content pages found under src/content/ — the gate would pass while asserting nothing",
  );
}

const exempt = [];
const coverage = { semanticDom: 0, limitations: 0, faq: 0 };
for (const { file, doc } of pages) {
  const at = (msg) => `${file}: ${msg}`;
  for (const row of doc.faq ?? []) {
    if (!row.q?.trim())
      fail(at("faq row with an empty question — cut it or write it"));
    if (!row.a?.trim())
      fail(
        at(`faq "${row.q ?? "?"}" has an empty answer — cut it or write it`),
      );
  }
  if (doc.grammarExempt !== undefined && exemptionReason(doc) === null) {
    fail(
      at(
        "`grammarExempt` is present but blank — an exemption with no reason is an unfinished thought",
      ),
    );
  }
  const reason = exemptionReason(doc);
  if (reason !== null) {
    exempt.push(`${file} — ${reason}`);
    continue;
  }
  // The rendered sequence is expectedSections(doc) by construction (§5 above);
  // what is asserted here is that it is a grammar subsequence in grammar
  // order — a predicate returning sections out of order would be caught even
  // though the template is fixed.
  const seq = expectedSections(doc);
  const positions = seq.map((id) => GRAMMAR_ORDER.indexOf(id));
  if (positions.some((p) => p === -1)) {
    fail(
      at(
        `expected sections [${seq.join(", ")}] name an id outside the grammar`,
      ),
    );
  }
  if (!positions.every((p, i) => i === 0 || positions[i - 1] < p)) {
    fail(at(`expected sections [${seq.join(", ")}] are out of grammar order`));
  }
  for (const id of GRAMMAR_CONDITIONAL) {
    if (!seq.includes(id)) continue;
    if (id === "semantic-dom") coverage.semanticDom += 1;
    else if (id === "limitations") coverage.limitations += 1;
    else coverage.faq += 1;
  }
}

// ------------------------------------------------------------------ report
console.log(
  `check-grammar: ${pages.length} content page(s), template order [${h2s.join(" → ")}]`,
);
console.log(
  `check-grammar: conditional coverage — semantic-dom ${coverage.semanticDom}, ` +
    `limitations ${coverage.limitations}, faq ${coverage.faq} (cut when empty, per convention)`,
);
if (exempt.length > 0) {
  console.log(
    `\ncheck-grammar: ${exempt.length} exempt page(s) — listed, not checked:`,
  );
  for (const e of exempt) console.log(`  exempt ${e}`);
}

if (errors.length > 0) {
  console.error(`\ncheck-grammar: ${errors.length} error(s):`);
  for (const e of errors) console.error(`  x    ${e}`);
  process.exit(1);
}
console.log("check-grammar: ok — every page renders the grammar in order");
