#!/usr/bin/env bun
/**
 * generate-llms.mjs — public/llms.txt, the COMPLETE page map (T3).
 *
 * Part 6 shipped the shape (title, summary, agents section, nav sections)
 * but only 16 nav leaves — wayfinding, not a map. A page map that omits
 * 192 family pages is the omission class this file exists to prevent: an
 * agent reading it concludes the site has 16 pages. T3 completes it.
 *
 * Three single sources, no hand-listed pages:
 * - NAV_SECTIONS (src/systems/nav.ts) — curated wayfinding (hubs, guides).
 * - WEB_DOCS / MOBILE_DOCS (src/content/web|mobile/*.ts) — every family
 *   page, with its own name + oneLiner as the link text (nothing invented).
 * - FOUNDATIONS (src/foundations/shell.tsx) — the 7 styles pages.
 * A page with an empty label/hint fails loudly rather than shipping a blank
 * line. check-llms.mjs asserts every family + foundations + nav leaf is
 * present, so a new page without a map entry fails the gate, not the reader.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NAV_SECTIONS } from "../src/systems/nav.ts";
import { FOUNDATIONS } from "../src/foundations/shell.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const OUT = join(APP, "public", "llms.txt");
// No absolute domain: wrangler.jsonc declares no custom domain, so any
// hostname here would be invented. Relative links resolve against the host,
// and the repo URL below is the one the footer already links.
const REPO = "https://github.com/xoroh/kern";

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

const link = (label, href, hint) => {
  if (!label.trim() || !hint.trim()) {
    console.error(`x    llms entry ${href} carries no label/hint — refusing a blank line`);
    process.exit(1);
  }
  return `- [${label}](${href}): ${hint}`;
};

const lines = [
  "# Kern",
  "",
  "> Kern UI by Xoroh — an open-source design system following Material",
  "> Design 3. One contract, web and native. Full docs: /docs",
  "",
  "## AI agents",
  "",
  "Prefer these machine surfaces over scraping HTML:",
  "- /llms.txt (this file) — the complete page map, generated from the nav, the content docs and the foundations registry",
  "- Copy as Markdown button on every component and Foundations page — page prose + code + links, live-demo controls excluded",
  `- Agent skills in the repo: .agents/skills/kern/SKILL.md and .agents/skills/docs/SKILL.md (${REPO}/tree/main/.agents/skills)`,
  "",
];

for (const section of NAV_SECTIONS) {
  lines.push(`## ${section.label}`, "");
  for (const leaf of section.leaves) lines.push(link(leaf.label, leaf.href, leaf.hint));
  lines.push("");
}

lines.push("## Foundations pages", "");
for (const page of FOUNDATIONS) {
  lines.push(link(page.title, `/styles/${page.slug}`, page.oneLiner));
}
lines.push("");

const families = { web: await loadDocs("web"), mobile: await loadDocs("mobile") };
for (const [platform, docs] of Object.entries(families)) {
  lines.push(`## Component families — ${platform}`, "");
  for (const doc of docs) {
    lines.push(link(doc.name, `/components/${platform}/${doc.slug}`, doc.oneLiner));
  }
  lines.push("");
}

mkdirSync(join(APP, "public"), { recursive: true });
writeFileSync(OUT, lines.join("\n"));
const total = lines.filter((l) => l.startsWith("- [")).length;
console.log(`generate-llms: wrote ${total} links to public/llms.txt`);
