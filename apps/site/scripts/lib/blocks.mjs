/**
 * Block manifest reader for the machine surfaces (D1003/D1004 step 8).
 *
 * Shared by generate-llms (the Blocks section) and check-llms (the gate:
 * every declared block linked). Parses `src/blocks/manifest.ts` with
 * regexes — the same posture as check-blocks and the CLI's loadBlocks: the
 * manifest is a typed TS source of truth, and a shared runtime import would
 * couple these scripts to the site's bundler. Fields read: name, title,
 * category, description, file. Blocks are tier "block" by DECLARATION here,
 * never by derivation (see scripts/lib/tiers.mjs).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function loadBlockEntries(siteRoot) {
  const src = readFileSync(
    join(siteRoot, "src", "blocks", "manifest.ts"),
    "utf8",
  );
  const chunks = src.split(/^\s*\{/m).slice(1);
  const entries = [];
  for (const chunk of chunks) {
    const name = chunk.match(/name:\s*"([^"]+)"/)?.[1];
    const file = chunk.match(/file:\s*"([^"]+)"/)?.[1];
    if (!name || !file) continue;
    entries.push({
      name,
      title: chunk.match(/title:\s*"([^"]+)"/)?.[1] ?? name,
      category: chunk.match(/category:\s*"([^"]+)"/)?.[1] ?? "Settings",
      description: chunk.match(/description:\s*"([^"]+)"/)?.[1] ?? "",
      file,
    });
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}
