#!/usr/bin/env bun
/**
 * check-page-md — every docs page emits its .md (Phase 3 grammar gate).
 *
 * WHAT IT ASSERTS
 *
 * 1. EMISSION: every component family (web + mobile) and every foundations
 *    page produces a non-empty .md through the SAME module the emitter uses
 *    (`scripts/lib/page-md.mjs` — one function, two callers, so the two can
 *    never disagree). A page the emitter drops fails here.
 * 2. FRESHNESS TRIPWIRE: each family .md embeds its own one-liner. A stale
 *    emission (content edited, .md not regenerated) still carries the old
 *    sentence — and a regenerated one carries the new one — so the tripwire
 *    catches drift without byte-comparing 200 files.
 * 3. GRAMMAR ORDER: each non-exempt family .md carries the expected h2
 *    sequence (`expectedHeadings(doc)`) in order. The machine surface follows
 *    the same grammar as the page, or it is a second opinion.
 * 4. VISIBLE AFFORDANCE: the Copy-as-Markdown button renders on component
 *    pages AND foundations pages, against a `data-copy-md-root` article.
 *    An emission nobody can reach from the page is a dark surface.
 *
 * WHAT IT DOES NOT ASSERT: byte-freshness of public/md/ against a regen.
 * Those files are gitignored build output (see generate-page-md.mjs); the
 * census gate owns committed artefacts, and this gate owns the emission
 * contract instead.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FOUNDATIONS, neighbours } from "../src/foundations/shell.tsx";
import { exemptionReason } from "../src/systems/grammar.ts";
import {
  expectedHeadings,
  foundationMarkdown,
  pageMarkdown,
} from "./lib/page-md.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

let failures = 0;
const bad = (msg) => {
  failures++;
  console.error(`x    ${msg}`);
};

async function loadDocs(subdir) {
  const dir = join(APP, "src", "content", subdir);
  const docs = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = await import(join(dir, file));
    for (const doc of Object.values(mod)) {
      if (doc && typeof doc === "object" && doc.slug && doc.name)
        docs.push(doc);
    }
  }
  return docs;
}

const { WEB_DEMOS } = await import(
  join(APP, "src", "demos", "web", "registry.tsx")
);
const { MOBILE_DEMOS } = await import(
  join(APP, "src", "demos", "mobile", "registry.tsx")
);
const registries = { web: WEB_DEMOS, mobile: MOBILE_DEMOS };

let emitted = 0;
for (const platform of ["web", "mobile"]) {
  for (const doc of await loadDocs(platform)) {
    const key = `${platform}/${doc.slug}`;
    const liveDemo = registries[platform][doc.parts[0]] !== undefined;
    let md;
    try {
      md = pageMarkdown(doc, platform, { liveDemo });
    } catch (err) {
      bad(`${key}: emission threw — ${err.message}`);
      continue;
    }
    if (!md.trim()) {
      bad(`${key}: emits an empty .md`);
      continue;
    }
    emitted++;
    if (!md.includes(doc.oneLiner)) {
      bad(`${key}: .md does not embed its one-liner — the freshness tripwire`);
    }
    if (exemptionReason(doc) !== null) continue;
    const want = expectedHeadings(doc);
    const got = md
      .split("\n")
      .filter((l) => l.startsWith("## "))
      .map((l) => l.slice(3).trim());
    if (got.join("\n") !== want.join("\n")) {
      bad(
        `${key}: .md headings [${got.join(" → ")}] are not the grammar [${want.join(" → ")}]`,
      );
    }
  }
}

let foundations = 0;
for (const page of FOUNDATIONS) {
  const md = foundationMarkdown(page, neighbours(page.slug));
  if (!md.trim()) {
    bad(`foundations/${page.slug}: emits an empty .md`);
    continue;
  }
  foundations++;
  if (!md.includes(page.oneLiner)) {
    bad(`foundations/${page.slug}: .md does not embed its one-liner`);
  }
}

// The visible affordance, pinned by source: the button plus the root it reads.
for (const [file, rel] of [
  ["component pages", "src/components/docs/component-page.tsx"],
  ["foundations pages", "src/foundations/shell.tsx"],
]) {
  const text = readFileSync(join(APP, rel), "utf8");
  if (!text.includes("CopyMarkdownButton")) {
    bad(
      `${file} (${rel}) do not render CopyMarkdownButton — the emission has no visible affordance`,
    );
  }
  if (!text.includes("data-copy-md-root")) {
    bad(
      `${file} (${rel}) carry no data-copy-md-root — the button has nothing to convert`,
    );
  }
}

console.log(
  `check-page-md: ${emitted} familie(s) + ${foundations} foundations page(s) emit well-formed .md`,
);

if (failures > 0) {
  console.error(`check-page-md: ${failures} failure(s)`);
  process.exit(1);
}
console.log(
  "check-page-md: ok — every docs page emits its .md in grammar order",
);
