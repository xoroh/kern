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
const offScale = []; // ad-hoc utilities OUTSIDE the reviewed surface

/**
 * Ad-hoc typography utilities — the classes M1 exists to eliminate. A page
 * that teaches the type scale cannot contain type that is off it, and "the
 * painted page, not the file" is the scope: examples and demos render on the
 * same page as the template, so they get the same rule.
 *
 * `font-mono` is NOT listed: a code face is a deliberate semantic choice, not
 * a scale escape. What must be on-scale is its SIZE, which the token roles
 * supply.
 */
const ADHOC_TYPE =
  /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)\b|\btracking-(?:tight|wide|wider|widest|normal)\b|\bleading-(?:none|tight|snug|normal|relaxed|loose)\b|\bfont-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const rel = relative(APP, file);

  for (const m of text.matchAll(/\bts\(\s*["'`]([a-z0-9-]+)["'`]\s*\)/g)) {
    const role = m[1];
    if (!used.has(role)) used.set(role, []);
    used.get(role).push(rel);
  }
  for (const m of text.matchAll(
    /--md-sys-typescale-([a-z0-9-]+?)-(?:font-family|font-size|font-weight|line-height|letter-spacing)/g,
  )) {
    const role = m[1];
    if (!used.has(role)) used.set(role, []);
    used.get(role).push(rel);
  }

  // The regression guard. Only .tsx renders type, so only .tsx is scanned.
  // COMMENTS ARE STRIPPED FIRST — they do not render, and this file's own M1
  // docblock names the very classes it removed. A gate that fails on its own
  // documentation is worse than no gate.
  if (!file.endsWith(".tsx")) continue;
  const rendered = text
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

  // An explicit escape hatch for EXAMPLE CODE — markup shown to the reader in
  // a template string, where the class names are the reader's, not ours. The
  // marker is a visible decision, never a silent skip.
  const exempt = /type-scale-exempt/.test(text);
  const inScope =
    rel.startsWith("src/showcase/") || rel.startsWith("src/components/docs/");
  for (const m of rendered.matchAll(ADHOC_TYPE)) {
    const where = `${rel}: ad-hoc type utility "${m[0]}"`;
    if (exempt) continue; // deliberate, documented example code — not debt
    if (inScope) {
      fail(
        `${where} — the page that teaches the type scale must use it. ` +
          `Replace with a ts(role) token so the type is generated, not typed.`,
      );
    } else {
      // SAME DEFECT, different lane of the fix. The review scoped this pass to
      // the template's own surface; the site-wide count is measured and named
      // rather than hidden, exactly like the elevation gaps. Promoting these
      // to errors before the pass lands would only turn the tree red on work
      // that is queued, not wrong.
      offScale.push(`${where}`);
    }
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

// Kicker is single-sourced: components/chrome/kicker.tsx owns the eyebrow
// voice (T_KICKER + uppercase). The hero previously re-typed it by hand with
// its own tracking-[...] utility, which this gate's ad-hoc scan would only
// catch as a generic off-scale hit. Assert the single source directly: the
// hero imports the shared Kicker and defines no local one.
{
  const hero = readFileSync(join(SRC, "components", "home", "hero.tsx"), "utf8");
  const stripped = hero
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
  if (!/from\s+["']\.\.\/chrome\/kicker["']/.test(stripped)) {
    fail("hero.tsx must import Kicker from ../chrome/kicker — the eyebrow kicker is single-sourced");
  }
  if (/function\s+Kicker\b/.test(stripped)) {
    fail("hero.tsx defines a local Kicker — delete it and use ../chrome/kicker");
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

// The measured-but-not-yet-fixed remainder, reported by name rather than
// hidden. Same honest-labelling rule as the elevation gaps: known debt is a
// fact, and a fact the reader can see is worth more than a green line.
if (offScale.length > 0) {
  const byFile = new Map();
  for (const line of offScale) {
    const f = line.split(":")[0];
    byFile.set(f, (byFile.get(f) ?? 0) + 1);
  }
  console.log(
    `check-typescale: ${offScale.length} ad-hoc type utilit(ies) still off-scale outside the reviewed surface — reported, not failing:`,
  );
  for (const [f, n] of [...byFile].sort()) {
    console.log(`  todo ${f}: ${n}`);
  }
  console.log(
    "check-typescale: these are the same defect class; promote to errors when the site-wide pass lands.",
  );
}
console.log("check-typescale: ok");
