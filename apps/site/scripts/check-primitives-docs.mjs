#!/usr/bin/env bun
/**
 * check-primitives-docs — every kernel module page is real documentation.
 *
 * Runs under bun (like check-search.mjs): the catalogue is TS with
 * transitive imports, which node ESM cannot resolve. Text-scraping the
 * modules would assert the scraper, not the page data.
 *
 * WHAT IT ASSERTS
 *
 * G3/G4's bar is "per-module pages (anatomy + API + example)". A stub that
 * lists the barrel exports and says "later work" meets none of it, and
 * nothing else on the site would notice — the route renders, the nav
 * resolves, the page is in llms.txt. This gate is the bar itself:
 *
 *   1. SHAPE: every `PRIMITIVE_MODULES` entry has non-empty `anatomy`
 *      (>= 2 parts), `api` (>= 1 row) and `example` (non-blank). A blank
 *      section is an unfinished page, not a page with nothing to say.
 *   2. EXAMPLE PRESENCE: the example is one of `PRIMITIVE_EXAMPLES` — the
 *      constants `check-snippets.mjs` compiles against the real package. An
 *      example that exists only as prose is not an example.
 *   3. BARREL COVERAGE: every `exports` name on a module page is exported
 *      from `libs/kern-primitives/src/index.ts`, and every barrel export
 *      is named by exactly one module page. Two pages documenting one symbol
 *      and a symbol no page documents are the same failure.
 *   4. NAV AGREEMENT: `PRIMITIVES_NAV` lists the landing plus exactly the
 *      module slugs, so a module added to the catalogue but not the sidebar
 *      fails here rather than in a reader's search.
 *   5. PAGE GRAMMAR: `$module.tsx` renders Anatomy → API → Example in that
 *      order (the h2 ids, in source order). Order is pinned for the same
 *      reason `check-grammar` pins the component grammar: a section moved
 *      because someone was editing near it is drift.
 *
 * WHAT IT DOES NOT ASSERT: prose quality (read the page), that the example
 * compiles (`check-snippets` owns that), or that the signatures are current
 * against the source (they are restated by hand; a rename is caught by 3).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PRIMITIVE_EXAMPLES } from "../src/domains/primitives/examples.ts";
import { PRIMITIVE_MODULES } from "../src/domains/primitives/modules.ts";
import { PRIMITIVES_NAV } from "../src/domains/primitives/primitives-nav.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

const errors = [];
const fail = (m) => errors.push(m);

/* ------------------------------------------------- 1 + 2. Page completeness */

for (const mod of PRIMITIVE_MODULES) {
  if (!Array.isArray(mod.anatomy) || mod.anatomy.length < 2) {
    fail(
      `"${mod.slug}" anatomy needs >= 2 parts (got ${mod.anatomy?.length ?? 0}) — the page has no mental model to teach.`,
    );
  } else {
    for (const row of mod.anatomy) {
      if (!row.part?.trim() || !row.role?.trim()) {
        fail(`"${mod.slug}" anatomy row is blank (part or role missing).`);
      }
    }
  }
  if (!Array.isArray(mod.api) || mod.api.length < 1) {
    fail(`"${mod.slug}" has no API rows — the barrel is the contract.`);
  } else {
    for (const row of mod.api) {
      if (!row.signature?.trim() || !row.description?.trim()) {
        fail(
          `"${mod.slug}" API row is blank (signature or description missing).`,
        );
      }
    }
  }
  if (!mod.example?.trim()) {
    fail(`"${mod.slug}" has no example.`);
  } else if (PRIMITIVE_EXAMPLES[mod.slug] === undefined) {
    fail(
      `"${mod.slug}" example is not one of the PRIMITIVE_EXAMPLES constants — it would never reach check-snippets.`,
    );
  } else if (PRIMITIVE_EXAMPLES[mod.slug] !== mod.example) {
    fail(
      `"${mod.slug}" example drifted from PRIMITIVE_EXAMPLES.${mod.slug} — one source, one snippet.`,
    );
  }
}

/* --------------------------------------------------- 3. Barrel coverage */

const barrel = readFileSync(
  join(APP, "..", "..", "libs", "kern-primitives", "src", "index.ts"),
  "utf8",
);
// Both block and one-line `export { ... } from "..."` forms; `type` modifiers
// and `as` aliases are stripped so the public NAME is what lands in the set.
// Comments are stripped first: the selection block carries a multi-line
// comment containing a literal `}`, which would otherwise end the brace
// match early and drop the whole block from the set.
const clean = barrel
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^[ \t]*\/\/.*$/gm, "");
const barrelExports = new Set();
for (const m of clean.matchAll(
  /export\s*\{([^}]+)\}\s*from\s*["'][^"']+["']/g,
)) {
  for (const part of m[1].split(",")) {
    const name = part
      .replace(/\btype\s+/g, "")
      .trim()
      .split(/\s+as\s+/)
      .pop()
      ?.trim();
    if (name) barrelExports.add(name);
  }
}

const documented = new Map();
for (const mod of PRIMITIVE_MODULES) {
  for (const name of mod.exports) {
    if (documented.has(name)) {
      fail(
        `"${name}" is documented by both "${documented.get(name)}" and "${mod.slug}".`,
      );
    }
    documented.set(name, mod.slug);
    if (!barrelExports.has(name)) {
      fail(
        `"${mod.slug}" documents "${name}", which the primitives barrel does not export.`,
      );
    }
  }
}
for (const name of barrelExports) {
  if (name === "default") continue;
  if (!documented.has(name)) {
    fail(`barrel export "${name}" is documented by no module page.`);
  }
}

/* ------------------------------------------------------ 4. Nav agreement */

const navSlugs = PRIMITIVES_NAV.leaves
  .map((leaf) => leaf.href)
  .filter((href) => href.startsWith("/primitives/"))
  .map((href) => href.slice("/primitives/".length));
const catalogSlugs = PRIMITIVE_MODULES.map((m) => m.slug);

if (PRIMITIVES_NAV.leaves[0]?.href !== "/primitives") {
  fail('PRIMITIVES_NAV must open with the "/primitives" landing leaf.');
}
for (const slug of catalogSlugs) {
  if (!navSlugs.includes(slug)) {
    fail(`module "${slug}" is in the catalogue but not in PRIMITIVES_NAV.`);
  }
}
for (const slug of navSlugs) {
  if (!catalogSlugs.includes(slug)) {
    fail(`PRIMITIVES_NAV lists "${slug}", which is not in the catalogue.`);
  }
}

/* ----------------------------------------------------- 5. Page grammar */

const page = readFileSync(
  join(APP, "src", "routes", "primitives", "$module.tsx"),
  "utf8",
);
const wanted = ["anatomy", "api", "example"];
const found = [...page.matchAll(/id="(anatomy|api|example|exports)"/g)].map(
  (m) => m[1],
);
const sequence = found.filter((id) => wanted.includes(id));
if (sequence.join(",") !== wanted.join(",")) {
  fail(
    `$module.tsx section order is [${sequence.join(", ")}] — expected Anatomy → API → Example.`,
  );
}

/* ------------------------------------------------------------------ Report */

if (errors.length > 0) {
  console.error("check-primitives-docs FAILED:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}
console.log(
  `check-primitives-docs passes: ${PRIMITIVE_MODULES.length} module pages each carry anatomy + API + example, ` +
    `${documented.size} barrel exports documented once, nav agrees, page grammar held.`,
);
