#!/usr/bin/env node
/**
 * check:typescale — every typescale role used on a page must be a REAL token.
 *
 * ## Why this exists
 *
 * M1 moved the component page off ad-hoc Tailwind sizes and onto the kern
 * type scale, resolving each role from --md-sys-typescale-<role>-<prop>. That
 * is strictly better than hard-coded sizes — but it introduces a new failure
 * class: a role name that does not exist resolves to nothing, the property is
 * dropped, and the text silently falls back to the browser default. The page
 * still builds. It just stops being typeset.
 *
 * So the roles are checked against the GENERATED token set, not against a
 * hand-kept list. If kern adds, renames or removes a style, this gate sees it
 * from tokens.css — the same source the page resolves against.
 *
 * Also asserts the pair property: every role must expose all five properties
 * (family, size, weight, line-height, letter-spacing). A role that exists with
 * only four would leave one declaration silently unresolved.
 *
 * Exit 0 = every role resolves.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

const errors = [];
const fail = (m) => errors.push(m);

// ---------------------------------------------- the generated token source
const TOKEN_CANDIDATES = [
  join(APP, "..", "..", "packages", "kern-tokens", "src", "tokens.css"),
  join(APP, "..", "..", "packages", "kern-tokens", "dist", "tokens.css"),
];
const TOKENS_CSS = TOKEN_CANDIDATES.find((p) => existsSync(p));

if (!TOKENS_CSS) {
  console.error(
    "check-typescale: tokens.css not found. Looked in:\n" +
      TOKEN_CANDIDATES.map((p) => `  - ${p}`).join("\n") +
      "\nWithout the generated token set there is nothing to check roles against.",
  );
  process.exit(1);
}

const css = readFileSync(TOKENS_CSS, "utf8");

// Real parse of the custom-property declarations: --md-sys-typescale-<role>-<prop>.
const PROPS = [
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
];

const roleProps = new Map();
const decl =
  /--md-sys-typescale-([a-z0-9-]+?)-(font-family|font-size|font-weight|line-height|letter-spacing)\s*:/g;
for (const m of css.matchAll(decl)) {
  const role = m[1];
  const prop = m[2];
  if (!roleProps.has(role)) roleProps.set(role, new Set());
  roleProps.get(role).add(prop);
}

if (roleProps.size === 0) {
  console.error(
    `check-typescale: no --md-sys-typescale-* declarations found in ${relative(process.cwd(), TOKENS_CSS)} — refusing to run against an empty token set.`,
  );
  process.exit(1);
}

// Every role must carry all five properties.
for (const [role, props] of roleProps) {
  const missing = PROPS.filter((p) => !props.has(p));
  if (missing.length > 0) {
    fail(
      `tokens.css: type role "${role}" is missing ${missing.join(", ")} — ` +
        `a page using it would leave that declaration silently unresolved`,
    );
  }
}

// ------------------------------------------------ the roles the site uses
function loadFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...loadFiles(full));
    else if (/\.(tsx?|css)$/.test(e) && !e.endsWith(".gen.ts")) out.push(full);
  }
  return out;
}

const SRC = join(APP, "src");
const files = loadFiles(SRC);
if (files.length === 0) {
  console.error(
    "check-typescale: no source files found — nothing would be asserted.",
  );
  process.exit(1);
}

const used = new Map(); // role -> [file, ...]
for (const file of files) {
  const text = readFileSync(file, "utf8");

  // ts("role") and direct var(--md-sys-typescale-<role>-...) references.
  for (const m of text.matchAll(/\bts\(\s*["'`]([a-z0-9-]+)["'`]\s*\)/g)) {
    const role = m[1];
    if (!used.has(role)) used.set(role, []);
    used.get(role).push(relative(APP, file));
  }
  for (const m of text.matchAll(
    /--md-sys-typescale-([a-z0-9-]+?)-(?:font-family|font-size|font-weight|line-height|letter-spacing)/g,
  )) {
    const role = m[1];
    if (!used.has(role)) used.set(role, []);
    used.get(role).push(relative(APP, file));
  }
}

for (const [role, where] of used) {
  if (!roleProps.has(role)) {
    fail(
      `type role "${role}" is used in ${[...new Set(where)].join(", ")} but ` +
        `does not exist in tokens.css — it resolves to nothing and the text ` +
        `silently falls back to the browser default`,
    );
  }
}

const roles = [...used.keys()].sort();
console.log(`check-typescale: ${roleProps.size} type role(s) in the token set`);
console.log(`check-typescale: ${roles.length} role(s) used by the site`);
for (const r of roles) {
  const ok = roleProps.has(r);
  console.log(`  ${ok ? "ok " : "x  "} ${r}${ok ? "" : "  <-- NOT A TOKEN"}`);
}

if (errors.length > 0) {
  console.error("");
  for (const e of errors) console.error(`  x ${e}`);
  console.error("");
  console.error(`check-typescale: ${errors.length} error(s)`);
  process.exit(1);
}
console.log("check-typescale: ok");
