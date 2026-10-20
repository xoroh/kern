#!/usr/bin/env node
/**
 * check-grammar — the docs page grammar gate (the ONE standard, ADR-115).
 *
 * WHAT IT ASSERTS
 *
 * Every component page follows one grammar —
 * lede → demo → example → props → accessibility → limitations → spec →
 * customization — and the assertion is structural, not visual:
 *
 *   1. TEMPLATE ORDER: the h2 sections the template renders, in render
 *      order, equal `GRAMMAR_ORDER` from `src/systems/grammar.ts` exactly. A
 *      section added, dropped or moved fails here.
 *   2. TOC AGREEMENT: the "On this page" rail lists the same ids in the same
 *      order. A rail that names a section the page does not render (or omits
 *      one it does) fails here, not in a reader's click.
 *   3. PREDICATE WIRING: the page assembly applies the shared predicates
 *      (`hasLimitations` / `hasCustomization`) rather than inline conditions
 *      of its own. An inline condition is a second opinion on when a section
 *      renders, and second opinions drift.
 *   4. LEDE: the header renders the h1 and the one-liner, and NOTHING else.
 *      The features prose moved to `docs/m3-guidance/<family>.md` — a lede
 *      that renders it again says the same thing twice, on two surfaces that
 *      will drift apart.
 *   5. THE ORDER IS PARTITIONED: every grammar slot is either required or
 *      conditional, exactly once. A slot that is neither is unasserted.
 *   6. CONTENT, per doc: the rendered sequence is a subsequence of the
 *      grammar in grammar order; a present-but-blank `grammarExempt` is an
 *      unfinished thought and fails; exempt pages are LISTED and skipped by
 *      the order checks — known debt, not a silent pass.
 *
 * WHY THE TEMPLATE ORDER IS DERIVED, NOT A LIST
 *
 * The first version of this gate hardcoded a map from section-component name
 * to heading id (`Demo` → `demo`, `ApiReference` → `props`, …). That map was
 * a SECOND copy of the grammar: rename a component and the gate fails with a
 * message about a heading that never moved, and add a section and the gate
 * says nothing until someone remembers the map. So the gate now reads the
 * template's own headings — the h2 ids it renders, in the order it renders
 * them — and compares THAT to `GRAMMAR_ORDER`. The template is the thing
 * being asserted; the grammar module is the single source of truth; nothing
 * in between is a list.
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

/**
 * The template's top-level declarations, one per part.
 *
 * Split BEFORE every top-level `function`/`const` declaration (column 0), so
 * each part is one component's source and the components' bodies never bleed
 * into each other. Arrow-function components are included on purpose: the
 * template is allowed to change its mind about syntax, and a gate that only
 * understands `function` declarations fails a rename into `const` for a
 * reason that has nothing to do with the grammar.
 */
const parts = src.split(/^(?=(?:export\s+)?(?:function|const)\s)/m);

/** component name -> its source. */
const bodies = new Map();
for (const part of parts) {
  const name =
    /^(?:export\s+)?function\s+([A-Za-z0-9_]+)/.exec(part)?.[1] ??
    /^(?:export\s+)?const\s+([A-Za-z0-9_]+)/.exec(part)?.[1];
  if (!name) continue;
  bodies.set(name, part);
}

/**
 * The h2 ids each component renders.
 *
 * Every `<Heading>` WITHOUT `level={3}` is an h2; the ones with it are h3s
 * inside a section and do not take a grammar slot. A component may render the
 * SAME id in two branches (only one branch renders at a time) — that is one
 * slot, so the ids are collected as a SET.
 */
const h2ByComponent = new Map();
for (const [name, body] of bodies) {
  const ids = new Set();
  for (const m of body.matchAll(/<Heading\b([^>]*)>/g)) {
    if (/level=\{3\}/.test(m[1])) continue;
    const id = m[1].match(/id="([^"]+)"/);
    if (id) ids.add(id[1]);
  }
  if (ids.size > 0) h2ByComponent.set(name, [...ids]);
}

// The page assembly: the component that lays the page out. Its body is the
// root of the render tree the order is read from.
const assembly = bodies.get("ComponentPage");
if (!assembly) {
  fail(
    "component-page.tsx has no `ComponentPage` component — the gate cannot read " +
      "the page's render order, so it would pass while asserting nothing",
  );
}

/**
 * The h2 ids the template renders, in render order.
 *
 * Depth-first over the JSX tree, following LOCAL components only (an imported
 * one has no source here to read). A section nested inside another section
 * (the example slot rendered inside the demo slot) still counts, and it
 * counts where it renders — which is what a reader sees.
 */
function renderOrder(source, seen = new Set()) {
  const ids = [];
  for (const m of source.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g)) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    const body = bodies.get(name);
    if (body === undefined) continue;
    const own = h2ByComponent.get(name);
    if (own) {
      if (own.length > 1) {
        fail(
          `section component ${name} renders ${own.length} h2 headings ` +
            `(${own.join(", ")}) — one h2 per grammar slot, both branches alike`,
        );
      }
      ids.push(own[0]);
    }
    ids.push(...renderOrder(body, seen));
  }
  return ids;
}

const rendered = assembly ? renderOrder(assembly) : [];
// A slot rendered by two different components would be listed twice; the
// second mention is the same slot, not a new one.
const order = rendered.filter((id, i) => rendered.indexOf(id) === i);

if (order.join("\n") !== GRAMMAR_ORDER.join("\n")) {
  fail(
    `rendered h2 order [${order.join(", ")}] is not the grammar ` +
      `[${GRAMMAR_ORDER.join(", ")}] — sections render in grammar order and no other`,
  );
}

// The set check, stated separately because it fails DIFFERENTLY: the order
// check says "the template renders the wrong sections", the set check says
// "the template renders a heading the grammar does not have" — a stray h2
// that no order comparison would ever notice.
{
  const extra = order.filter((id) => !GRAMMAR_ORDER.includes(id));
  const missing = GRAMMAR_ORDER.filter((id) => !order.includes(id));
  if (extra.length > 0) {
    fail(
      `the template renders h2 heading(s) the grammar does not have: ` +
        `${extra.join(", ")} — every h2 on a component page is a grammar slot`,
    );
  }
  if (missing.length > 0) {
    fail(
      `the template renders no h2 for grammar slot(s): ${missing.join(", ")} — ` +
        `a slot the grammar promises and the page does not deliver`,
    );
  }
}

// The rail: OnThisPageRail in site-layout.tsx scrapes h2[id] from the
// rendered page, so it mirrors whatever sections render by construction —
// no static list to drift. Assert the mechanism, not a literal list.
const layoutSrc = readFileSync(
  new URL("../src/domains/shared/chrome/site-layout.tsx", import.meta.url),
  "utf8",
);
if (
  !layoutSrc.includes("function OnThisPageRail") ||
  !layoutSrc.includes('querySelectorAll("h2[id]")')
) {
  fail(
    "OnThisPageRail in site-layout.tsx must scrape h2[id] from the rendered page — the rail mirrors the sections by construction",
  );
}

// Predicate wiring: the assembly gates conditional sections on the shared
// predicates, not on inline conditions.
for (const pred of ["hasLimitations(doc)", "hasCustomization(doc)"]) {
  if (!src.includes(pred)) {
    fail(
      `component-page.tsx never applies ${pred} — a conditional section gated ` +
        `on an inline condition is a second opinion that will drift`,
    );
  }
}

// The predicates must come from the shared module, not from a local copy.
if (!/from\s+"[^"]*systems\/grammar"/.test(src)) {
  fail(
    "component-page.tsx does not import the predicates from systems/grammar — " +
      "the gate reads that module, so a local copy is a second source of truth",
  );
}

// Lede presence: h1 + one-liner, and nothing else. The features prose moved
// to the guidance file; rendering it here would say it twice, on two
// surfaces that drift.
for (const [what, needle] of [
  ["h1", "<h1"],
  ["one-liner", "doc.oneLiner"],
]) {
  if (!src.includes(needle)) {
    fail(
      `lede is missing its ${what} (${needle}) — the grammar starts with the lede`,
    );
  }
}
if (/\bdoc\.features\b/.test(src)) {
  fail(
    "component-page.tsx still renders doc.features — the features prose moved to " +
      "docs/m3-guidance/<family>.md, and the lede keeps the one-liner only",
  );
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
const coverage = { limitations: 0, customization: 0 };
for (const { file, doc } of pages) {
  const at = (msg) => `${file}: ${msg}`;
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
  // The rendered sequence is expectedSections(doc) by construction (§6 above);
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
  // Every REQUIRED slot must be present on every page: a required section
  // that the predicates can drop is a required section that is optional.
  for (const id of GRAMMAR_REQUIRED) {
    if (!seq.includes(id)) {
      fail(
        at(
          `the required section "${id}" is missing from the expected sequence — ` +
            `a required section that can be dropped is not required`,
        ),
      );
    }
  }
  for (const id of GRAMMAR_CONDITIONAL) {
    if (seq.includes(id)) coverage[id] += 1;
  }
}

// ------------------------------------------------------------------ report
console.log(
  `check-grammar: ${pages.length} content page(s), template order [${order.join(" → ")}]`,
);
console.log(
  `check-grammar: conditional coverage — limitations ${coverage.limitations}, ` +
    `customization ${coverage.customization} (cut when empty, per convention)`,
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
