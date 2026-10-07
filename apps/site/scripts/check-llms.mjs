#!/usr/bin/env bun
/**
 * check-llms.mjs — public/llms.txt is the COMPLETE page map (T3 gate).
 *
 * WHAT IT ASSERTS: every component family (web + mobile content docs),
 * every foundations page, and every nav leaf has exactly one link entry
 * with the exact href the site routes on. A new page without a map entry
 * fails here — the agent reading llms.txt must never conclude the site has
 * fewer pages than it does (the Part-6 16-leaf omission, closed by T3).
 *
 * WHAT IT DOES NOT ASSERT: link prose quality (oneLiners are the pages'
 * own), reachability (routes are check-nav's lane), or freshness against a
 * re-run — the pre-commit freshness hook owns regen comparison.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NAV_SECTIONS } from "../src/systems/nav.ts";
import { FOUNDATIONS } from "../src/foundations/shell.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

const text = readFileSync(join(APP, "public", "llms.txt"), "utf8");
const hrefs = new Set();
for (const m of text.matchAll(/^- \[.*?]\(([^)]+)\)/gm)) hrefs.add(m[1]);

async function loadDocs(subdir) {
  const dir = join(APP, "src", "content", subdir);
  const docs = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts")).sort()) {
    const mod = await import(join(dir, file));
    for (const doc of Object.values(mod)) {
      if (doc && typeof doc === "object" && doc.slug && doc.name) docs.push(doc);
    }
  }
  return docs;
}

let failures = 0;
const want = (href, why) => {
  if (!hrefs.has(href)) {
    failures++;
    console.error(`x    llms.txt omits ${href} (${why}) — regen (bun run generate)`);
  }
};

for (const section of NAV_SECTIONS) {
  for (const leaf of section.leaves) want(leaf.href, `nav leaf "${leaf.label}"`);
}
for (const page of FOUNDATIONS) want(`/foundations/${page.slug}`, "foundations page");
for (const [platform, docs] of [["web", await loadDocs("web")], ["mobile", await loadDocs("mobile")]]) {
  for (const doc of docs) want(`/components/${platform}/${doc.slug}`, `family "${doc.name}"`);
}

if (failures > 0) {
  console.error(`check-llms: ${failures} missing link(s)`);
  process.exit(1);
}
console.log(`check-llms: ok — ${hrefs.size} links cover nav + foundations + all families`);
