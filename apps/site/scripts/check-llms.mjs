#!/usr/bin/env bun
/**
 * check-llms.mjs — public/llms.txt is the COMPLETE page map (T3 gate).
 *
 * WHAT IT ASSERTS
 *
 * - every component family (the content slug union — one family page at its
 *   CANONICAL tier home, D1003: pure-core at /core, the rest at
 *   /components/m3), every foundations page, every declared block
 *   (/blocks/<name> from apps/site/src/blocks/manifest.ts), and every nav
 *   leaf has exactly one link entry with the exact href the site routes on.
 * - tier sections cover every family exactly once: the Core section lists
 *   precisely the pure-core families, the Components section the rest.
 *
 * WHAT IT DOES NOT ASSERT: link prose quality (oneLiners are the pages'
 * own), reachability (routes are check-nav's lane), or freshness against a
 * re-run — the pre-commit freshness hook owns regen comparison.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FOUNDATIONS } from "../src/foundations/shell.tsx";
import { NAV_SECTIONS } from "../src/systems/nav.ts";
import { familyHref, familyTierOfSlug } from "../src/systems/tier-nav.ts";
import { loadBlockEntries } from "./lib/blocks.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

const text = readFileSync(join(APP, "public", "llms.txt"), "utf8");
const hrefs = new Set();
for (const m of text.matchAll(/^- \[.*?]\(([^)]+)\)/gm)) hrefs.add(m[1]);

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

let failures = 0;
const want = (href, why) => {
  if (!hrefs.has(href)) {
    failures++;
    console.error(
      `x    llms.txt omits ${href} (${why}) — regen (bun run generate)`,
    );
  }
};

for (const section of NAV_SECTIONS) {
  for (const leaf of section.leaves)
    want(leaf.href, `nav leaf "${leaf.label}"`);
}
for (const page of FOUNDATIONS)
  want(`/foundations/m3/${page.slug}`, "foundations page");
{
  // One page per family: the slug union across both renderers, each wanted
  // exactly once at its canonical tier home. Tier sections must partition
  // the union: core families under "## Core primitives", the rest under
  // "## Composite components".
  const slugs = new Set();
  for (const docs of [await loadDocs("web"), await loadDocs("mobile")]) {
    for (const doc of docs) slugs.add(doc.slug);
  }
  for (const slug of slugs)
    want(familyHref(slug), `family "${slug}" at canonical tier home`);
  for (const block of loadBlockEntries(APP)) {
    want(`/blocks/${block.name}`, `block "${block.name}"`);
  }
  // Section partition: parse the section each family href lands in.
  const sections = new Map();
  let current = null;
  for (const line of text.split("\n")) {
    const head = line.match(/^## (.+)$/);
    if (head) current = head[1];
    const href = line.match(/^- \[.*?]\(([^)]+)\)/)?.[1];
    if (href && current) sections.set(href, current);
  }
  for (const slug of slugs) {
    const href = familyHref(slug);
    const tier = familyTierOfSlug(slug) ?? "component";
    const wantSection =
      tier === "core" ? "Core primitives" : "Composite components";
    const gotSection = sections.get(href);
    if (!gotSection) {
      failures++;
      console.error(
        `x    family "${slug}" has no tier-section entry — regen (bun run generate)`,
      );
    } else if (gotSection !== wantSection) {
      failures++;
      console.error(
        `x    family "${slug}" sits under "## ${gotSection}", want "## ${wantSection}" — regen (bun run generate)`,
      );
    }
  }
}

if (failures > 0) {
  console.error(`check-llms: ${failures} missing link(s)`);
  process.exit(1);
}
console.log(
  `check-llms: ok — ${hrefs.size} links cover nav + foundations + all families`,
);
