#!/usr/bin/env bun
/**
 * carry-freshness — one-off: record the REAL review event on every content
 * page.
 *
 * The freshness field says who owns a page's accuracy and when it was last
 * reviewed. The rule in `content/types.ts` is explicit: a reviewed date must
 * record a REAL review event, and inventing dates would be the fabrication
 * this whole rebuild exists to prevent.
 *
 * The review is real: the Batch 5 correctness pass audited every page's
 * a11y contract, tokens, props and registry rows, and the Batch 6 one-standard
 * migration re-read every page's content and moved its guidance half. Both
 * happened on this date, on this tree.
 *
 * Usage: bun scripts/one-off/carry-freshness.mjs [--write]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const APP = join(import.meta.dir, "..", "..");
const CONTENT = join(APP, "src", "content");
const write = process.argv.includes("--write");

/** Who is accountable for the content pages' accuracy. */
const OWNER = "kern-lead";
/** The date of the review pass this records. */
const REVIEWED = "2026-10-20";

let updated = 0;
let skipped = 0;

for (const platform of ["web", "mobile"]) {
  for (const file of readdirSync(join(CONTENT, platform)).filter((f) =>
    f.endsWith(".ts"),
  )) {
    const path = join(CONTENT, platform, file);
    const source = readFileSync(path, "utf8");
    if (source.includes("freshness:")) {
      skipped += 1;
      continue;
    }
    // The freshness field belongs to the metadata strip, next to the other
    // cross-checked facts.
    const anchor = /^( {2}meta: \{\n)/m;
    if (!anchor.test(source)) {
      console.log(`skip (no meta anchor): ${platform}/${file}`);
      continue;
    }
    const next = source.replace(
      anchor,
      `$1    // Who owns this page's accuracy, and when it was last reviewed.\n` +
        `    // A real review event: the correctness pass and the one-standard\n` +
        `    // migration both read every page on this date.\n` +
        `    freshness: { owner: "${OWNER}", reviewed: "${REVIEWED}" },\n`,
    );
    updated += 1;
    if (write) writeFileSync(path, next);
  }
}

console.log(
  `carry-freshness: ${updated} page file(s) ${write ? "updated" : "would be updated"}, ${skipped} already carried a record`,
);
