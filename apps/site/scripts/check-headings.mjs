#!/usr/bin/env node
/**
 * check:headings — every rendered heading carries a stable id, and every
 * internal anchor link resolves to one.
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
 * m4 — ANCHOR LINKS RESOLVE. review-lead (§2 of post-0050-reviews): "hash links
 * want a gate the day they are written". `83ea061` shipped
 * `#step-1/3/5` deep links; if `/getting-started` renumbers its steps those go
 * nowhere SILENTLY, and the card's printed title is mitigation, not a check.
 *
 * WHY A PARSER, NOT A REGEX
 * -------------------------
 * An anchor here is not a string. Three shapes exist in this codebase:
 *
 *   href="#main"                    literal
 *   href={`#family-${g.id}`}        template
 *   href={`#${id}`}                 template over an enclosing id
 *
 * A regex over source cannot tell the second from the third, and both are
 * unresolvable by text alone — so a regex gate either reports false positives on
 * every dynamic anchor or skips them and asserts nothing. This reads the TSX
 * with the TypeScript compiler API and resolves them STRUCTURALLY:
 *
 *   literal anchor      -> must equal a literal `id=` somewhere in the tree
 *   template anchor     -> matched by template SIGNATURE (literal prefix,
 *                          literal suffix, and the same interpolated
 *                          expressions), which pairs `#family-${g.id}` with
 *                          `<h2 id={`family-${g.id}`}>`
 *   self-anchor         -> an anchor inside a JSX element that itself carries
 *                          `id={X}`, where X appears in the anchor. That is a
 *                          link to its own heading, valid by construction.
 *
 * Markdown headings use a real GitHub slugger (lowercase, strip punctuation
 * outside `-`/`_`, spaces to hyphens, `-1`/`-2` disambiguation on repeats) so a
 * `](#…)` link is checked against the slug the host would actually produce.
 *
 * Exit 0 = every heading is addressable AND every internal anchor resolves.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

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

/**
 * m3 — a <dl> is a description list, so it must carry dt/dd pairs. A <dl>
 * full of <div>/<span> is a fake description list: assistive tech announces
 * groups and the term/value relationship is lost. The check is per-file and
 * coarse on purpose — a file that renders a <dl> must render <dt> and <dd>
 * into it.
 */
let dlCount = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
  const rel = relative(APP, file);
  const hasDl = /<dl[\s>]/.test(text);
  if (!hasDl) continue;
  dlCount += 1;
  const hasDt = /<dt[\s>]/.test(text);
  const hasDd = /<dd[\s>]/.test(text);
  if (!hasDt || !hasDd) {
    fail(
      `${rel}: renders a <dl> but no ${!hasDt ? "<dt>" : "<dd>"} — a ` +
        `description list without term/value pairs is a fake one. Use dt/dd, ` +
        `or use ul/li if it is not a description list.`,
    );
  }
}
console.log(`check-headings: ${dlCount} description list(s) checked`);

// ============================================================================
// m4 — every internal anchor link resolves to an anchor that exists
// ============================================================================

/**
 * Classify a JSX attribute VALUE node into an anchor descriptor.
 *
 * Three shapes, per the header:
 *   { kind: "literal",  value: "main" }
 *   { kind: "template", prefix, suffix, exprs, raw }
 *   null — anything else (a call, a variable we cannot see through)
 */
function describeValue(node) {
  if (ts.isStringLiteralLike(node)) {
    return { kind: "literal", value: node.text, raw: node.text };
  }
  if (ts.isJsxExpression(node) && node.expression) {
    const inner = node.expression;
    if (ts.isStringLiteralLike(inner)) {
      return { kind: "literal", value: inner.text, raw: inner.text };
    }
    if (ts.isTemplateExpression(inner)) {
      const prefix = inner.head.text;
      const suffix = inner.templateSpans.at(-1)?.literal.text ?? "";
      const exprs = inner.templateSpans.map((s) => s.expression.getText());
      return { kind: "template", prefix, suffix, exprs, raw: inner.getText() };
    }
    // A bare expression (`id={id}`) — record the identifier so a self-anchor
    // inside the same element can be recognised.
    return { kind: "expr", raw: inner.getText() };
  }
  return null;
}

/**
 * The `#fragment` of a link value, or null if it is not an in-page anchor.
 *
 * For a LITERAL the fragment is the part AFTER the `#`, because that is what an
 * `id=` holds: `href="#main"` resolves against `id="main"`, not against a value
 * of `"#main"`. The first version compared the whole attribute value to the id
 * and reported `<main id="main">` as an unresolvable target — a false positive on
 * a link that is plainly correct.
 *
 * For a TEMPLATE there is no single fragment to compare; the raw text is kept so
 * `resolves()` can match on template signature instead.
 */
function fragmentOf(desc) {
  if (!desc) return null;
  const text = desc.kind === "literal" ? desc.value : desc.raw;
  if (typeof text !== "string") return null;
  const hash = text.indexOf("#");
  // External URLs carry their own fragment (`https://…#x`) and are not ours to
  // resolve — that is the live check's job, not this gate's.
  if (hash === -1) return null;
  if (/^[a-z]+:\/\//i.test(text)) return null;
  return { text: text.slice(hash + 1), whole: text };
}

/** Parse every .tsx and collect emitted ids + internal anchor links. */
const emittedIds = []; // { file, kind, value|prefix/suffix/exprs }
const anchors = []; // { file, line, fragment, desc }

for (const file of files) {
  const rel = relative(APP, file);
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const lineOf = (node) =>
    sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;

  /** Walk, tracking the nearest enclosing JSX element's own `id={…}` text. */
  const visit = (node, enclosingIdExpr) => {
    if (ts.isJsxElement(node)) {
      const ownId = node.openingElement.attributes.properties.find(
        (p) =>
          ts.isJsxAttribute(p) &&
          ts.isIdentifier(p.name) &&
          p.name.text === "id",
      );
      const ownIdDesc =
        ownId && ts.isJsxAttribute(ownId)
          ? describeValue(ownId.initializer)
          : null;
      const ownExpr =
        ownIdDesc?.kind === "expr" ? ownIdDesc.raw : (ownIdDesc?.raw ?? null);
      // Literal/template ids are anchors this file emits.
      if (
        ownIdDesc &&
        (ownIdDesc.kind === "literal" || ownIdDesc.kind === "template")
      ) {
        emittedIds.push({ file: rel, ...ownIdDesc });
      }
      node.forEachChild((c) => visit(c, ownExpr ?? enclosingIdExpr));
      return;
    }

    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
      const name = node.name.text;
      if (name === "id" && node.initializer) {
        const desc = describeValue(node.initializer);
        if (desc && (desc.kind === "literal" || desc.kind === "template")) {
          emittedIds.push({ file: rel, ...desc });
        }
      }
      if (name === "href" || name === "to" || name === "hash") {
        if (node.initializer) {
          const desc = describeValue(node.initializer);
          const frag = fragmentOf(desc);
          if (frag) {
            anchors.push({
              file: rel,
              line: lineOf(node),
              attr: name,
              fragment: frag.text,
              whole: frag.whole,
              desc,
              enclosingIdExpr,
            });
          }
        }
      }
    }
    node.forEachChild((c) => visit(c, enclosingIdExpr));
  };
  visit(sf, null);
}

/** Does this anchor match an emitted id? */
function resolves(anchor) {
  const { desc } = anchor;
  if (desc.kind === "literal") {
    // Compare the FRAGMENT, not the whole href — see fragmentOf().
    return emittedIds.some(
      (id) => id.kind === "literal" && id.value === anchor.fragment,
    );
  }
  if (desc.kind === "template") {
    // The anchor's literal prefix still carries the `#`; the id's does not.
    // `#family-${g.id}` against `family-${g.id}` are the SAME anchor, so the
    // sigil is stripped before signatures are compared. Without this the
    // gallery's family nav — a link that demonstrably works — was reported
    // dead, which is the "gate cries wolf" failure in its purest form.
    const anchorPrefix = desc.prefix.startsWith("#")
      ? desc.prefix.slice(1)
      : desc.prefix;
    // Self-anchor: the anchor interpolates the very id on its enclosing element.
    //
    // The sigil is PART OF THE CLAIM. `#${id}` inside `<Tag id={id}>` is a link to
    // that element's own id and is valid. `#mutated-${id}` in the same position
    // is NOT — it points at a DIFFERENT anchor that nothing emits, and the only
    // reason the first version of this rule called it resolved is that it looked
    // for the expression `id` appearing anywhere in the anchor. Planting that
    // mutation is how it was caught: the gate stayed green on a genuinely dead
    // link, which is the one failure a link gate cannot have.
    //
    // So a self-anchor requires the anchor to be nothing BUT the sigil and the
    // enclosing id: prefix exactly "#", empty suffix, one expression equal to it.
    const isSelfAnchor =
      anchor.enclosingIdExpr !== null &&
      desc.prefix === "#" &&
      desc.suffix === "" &&
      desc.exprs.length === 1 &&
      desc.exprs[0] === anchor.enclosingIdExpr;
    if (isSelfAnchor) return true;
    // Signature match: same literal prefix + suffix + the same expressions.
    return emittedIds.some(
      (id) =>
        id.kind === "template" &&
        id.prefix === anchorPrefix &&
        id.suffix === desc.suffix &&
        id.exprs.length === desc.exprs.length &&
        id.exprs.every((e, i) => e === desc.exprs[i]),
    );
  }
  return false;
}

let anchorChecked = 0;
for (const a of anchors) {
  anchorChecked += 1;
  if (resolves(a)) continue;
  // SectionToc exemption (site-layout.tsx `href={`#${item.id}`}` ONLY):
  // the items are scraped at RUNTIME from `h2[id]` under `#main`
  // (`main.querySelectorAll("h2[id]")`), so no statically-emitted id template
  // shares its signature and the rule above cannot see the targets. Valid by
  // construction — the link can never name an id that is not on the page —
  // and covered instead by check-component-nav/siblingNav tests plus the
  // focus/palette e2e specs. Narrowly pinned to prefix "#", empty suffix, and
  // the single `item.id` expression so no other dynamic anchor is weakened.
  const isSectionTocAnchor =
    a.file.endsWith("domains/shared/chrome/site-layout.tsx") &&
    a.desc.kind === "template" &&
    a.desc.prefix === "#" &&
    a.desc.suffix === "" &&
    a.desc.exprs.length === 1 &&
    a.desc.exprs[0] === "item.id";
  if (isSectionTocAnchor) continue;
  fail(
    `${a.file}:${a.line}: ${a.attr}="${a.whole}" points at #${a.fragment}, and no ` +
      `id in this app emits that anchor. A dead hash link is SILENT — the page ` +
      `renders fine and the deep link goes nowhere. If the target is dynamic, ` +
      `make the anchor and the id share a template signature (as ` +
      `\`#family-\${g.id}\` and \`id={\`family-\${g.id}\`}\` do).`,
  );
}

console.log(
  `check-headings: ${anchorChecked} internal anchor link(s) resolved against ` +
    `${emittedIds.length} emitted id(s)`,
);

// ------------------------------------------------------------------ markdown
/**
 * A real GitHub slugger: lowercase, drop punctuation outside `-`/`_`, spaces to
 * hyphens, and disambiguate repeats with `-1`, `-2`. Using a hand-rolled
 * approximation here would make the gate disagree with the host that serves the
 * page, which is the failure this gate exists to catch.
 */
function githubSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\-_]/gu, "")
    .replace(/\s+/g, "-");
}

const markdownFiles = [];
(function collectMarkdown(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      if (["node_modules", "dist", ".git", ".tanstack"].includes(e)) continue;
      collectMarkdown(full);
    } else if (e.endsWith(".md")) markdownFiles.push(full);
  }
})(join(APP, "..", "..", "docs"));
for (const name of ["README.md", "CONTRIBUTING.md"]) {
  const p = join(APP, "..", "..", name);
  if (existsSync(p)) markdownFiles.push(p);
}

let mdAnchors = 0;
for (const file of markdownFiles) {
  const rel = relative(join(APP, "..", ".."), file);
  const text = readFileSync(file, "utf8");
  const slugs = new Set();
  const seen = new Map();
  text.split("\n").forEach((line) => {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (!m) return;
    // Fenced code blocks are not headings.
    const base = githubSlug(m[2]);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    slugs.add(n === 0 ? base : `${base}-${n}`);
  });
  text.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/\]\(#([^)]+)\)/g)) {
      mdAnchors += 1;
      if (!slugs.has(m[1])) {
        fail(
          `${rel}:${i + 1}: link to #${m[1]} has no matching heading in this file. ` +
            `GitHub derives the anchor from the heading text; available here: ` +
            `${[...slugs].slice(0, 6).join(", ") || "(none)"}${slugs.size > 6 ? ", …" : ""}.`,
        );
      }
    }
  });
}
console.log(
  `check-headings: ${mdAnchors} markdown anchor link(s) checked across ` +
    `${markdownFiles.length} file(s)`,
);

if (errors.length > 0) {
  console.error("");
  for (const e of errors) console.error(`  x ${e}`);
  console.error("");
  console.error(`check-headings: ${errors.length} markup error(s)`);
  process.exit(1);
}
console.log("check-headings: ok — every heading is addressable");
