#!/usr/bin/env bun
/**
 * generate-llms.mjs — public/llms.txt from the Part-1 nav file (Part 6).
 *
 * WHY GENERATED: nav.ts is the single typed source the sidebar, search, and
 * llms.txt all read — a hand-maintained llms.txt is a third opinion that
 * drifts the day a route is added to the sidebar but not to the text file.
 * The generator reads NAV_SECTIONS (titles, hrefs, hints) and emits the
 * standard llms.txt shape: title, summary, H2 sections, linked pages.
 * A route with no hint fails loudly below rather than shipping a blank line —
 * the hint is the page's one-line contract with readers AND crawlers.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NAV_SECTIONS } from "../src/systems/nav.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "public", "llms.txt");
// No absolute domain: wrangler.jsonc declares no custom domain, so any
// hostname here would be invented. Relative links resolve against the host,
// and the repo URL below is the one the footer already links.
const REPO = "https://github.com/xoroh/kern";

const lines = [
  "# Kern",
  "",
  "> Kern UI by Xoroh — an open-source design system following Material",
  "> Design 3. One contract, web and native. Full docs: /docs",
  "",
  "## AI agents",
  "",
  "Prefer these machine surfaces over scraping HTML:",
  "- /llms.txt (this file) — the page map",
  "- Copy as Markdown button on every component and Foundations page — page prose + code + links, live-demo controls excluded",
  `- Agent skills in the repo: .agents/skills/kern/SKILL.md and .agents/skills/docs/SKILL.md (${REPO}/tree/main/.agents/skills)`,
  "",
];

for (const section of NAV_SECTIONS) {
  lines.push(`## ${section.label}`, "");
  for (const leaf of section.leaves) {
    if (!leaf.hint.trim()) {
      console.error(
        `x    nav leaf ${leaf.href} carries no hint — llms.txt refuses a blank line`,
      );
      process.exit(1);
    }
    lines.push(`- [${leaf.label}](${leaf.href}): ${leaf.hint}`);
  }
  lines.push("");
}

mkdirSync(join(HERE, "..", "public"), { recursive: true });
writeFileSync(OUT, lines.join("\n"));
const leaves = NAV_SECTIONS.reduce((n, s) => n + s.leaves.length, 0);
console.log(`generate-llms: wrote ${leaves} links to public/llms.txt`);
