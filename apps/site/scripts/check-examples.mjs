#!/usr/bin/env bun
/**
 * check-examples.mjs — the ExampleSpec contract, enforced.
 *
 * review-m3 4a notes (2026-10-03-part4a-exampletabs-review.md): two
 * content-author error classes no gate asserted —
 *   (1) whitespace-only `code` is truthy, so tabs render with an empty Code
 *       panel. Require non-blank `code` when present.
 *   (2) `<h3 id={example-${spec.id}}>` keys off the content id, so duplicate
 *       spec.ids duplicate h3 ids (and React keys). Require global uniqueness.
 *
 * Runs under bun (like check-search.mjs) because the registry is TSX:
 * importing it builds the specs without rendering them — `render` is a
 * callback, never invoked here. A node script could only text-scrape; this
 * reads the real objects the pages read.
 */
import { EXAMPLES } from "../src/showcase/registry.ts";

let errors = 0;
const seen = new Map();

for (const [exportName, specs] of Object.entries(EXAMPLES)) {
  for (const spec of specs) {
    if (seen.has(spec.id)) {
      console.error(
        `x    duplicate example id "${spec.id}" (${seen.get(spec.id)} + ${exportName}) — h3 ids and React keys collide`,
      );
      errors++;
    } else {
      seen.set(spec.id, exportName);
    }
    if (spec.code !== undefined && spec.code.trim() === "") {
      console.error(
        `x    example "${spec.id}" (${exportName}) carries blank code — truthy whitespace renders tabs with an empty Code panel`,
      );
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`check-examples: ${errors} error(s)`);
  process.exit(1);
}
const total = [...Object.values(EXAMPLES)].reduce((n, s) => n + s.length, 0);
console.log(
  `check-examples: ok — ${total} example(s), ids unique, code non-blank`,
);
