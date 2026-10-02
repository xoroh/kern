#!/usr/bin/env node
/**
 * check:headings — every rendered heading carries a stable id.
 *
 * m1 exists because Part 3's TOC links INTO these anchors. A heading without
 * an id is a link target that does not exist, and the failure is silent: the
 * page renders fine, the deep link just goes nowhere.
 *
 * The rule is checked against RENDERED JSX, not against a convention in a
 * docblock. Two shapes are accepted:
 *
 *   <h2 id="...">            explicit on a raw element
 *   <Heading id="...">       via the Heading component (preferred)
 *
 * A raw <h2>/<h3> with no id is an error. This is the same "fix + gate, not
 * fix + hope" rule the M-fix queue is judged by.
 *
 * Exit 0 = every heading is addressable.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

const errors = [];
const fail = (m) => errors.push(m);

function loadFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...loadFiles(full));
    else if (e.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const files = loadFiles(join(APP, "src"));
if (files.length === 0) {
  console.error(
    "check-headings: no .tsx files found — nothing would be asserted.",
  );
  process.exit(1);
}

// Match an opening heading tag and capture what follows until the close of
// the tag, so `id=` can be looked for inside it. Comments are stripped first —
// this file's own docs mention the tags it checks.
let scanned = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
  const rel = relative(APP, file);

  for (const m of text.matchAll(/<(h2|h3)(\s[^>]*?)?>/g)) {
    const tag = m[1];
    const attrs = m[2] ?? "";
    scanned += 1;
    if (!/\bid\s*=/.test(attrs)) {
      fail(
        `${rel}: <${tag}> has no id — Part 3's TOC links into heading ` +
          `anchors, and a heading without one is a deep link that goes ` +
          `nowhere. Use <Heading id="..."> or add id="..." to the raw tag.`,
      );
    }
  }
}

console.log(`check-headings: ${files.length} .tsx file(s)`);
console.log(`check-headings: ${scanned} heading(s) scanned`);

if (errors.length > 0) {
  console.error("");
  for (const e of errors) console.error(`  x ${e}`);
  console.error("");
  console.error(
    `check-headings: ${errors.length} heading(s) without a stable id`,
  );
  process.exit(1);
}
console.log("check-headings: ok — every heading is addressable");
