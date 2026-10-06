#!/usr/bin/env bun
/**
 * dom-to-markdown unit check — pure rules over mock trees, no DOM.
 * Run: bun scripts/check-markdown.mjs (wired into check:docs chain).
 * A converter whose rules aren't asserted rots the day someone "improves" it.
 */
import { nodeToMarkdown } from "../src/systems/dom-to-markdown.ts";

/** Minimal node shape (mirrors MdNode; .mjs takes no type imports). */
const t = (text) => ({ tag: "#text", text, children: [] });
const el = (tag, children, extra) => ({ tag, text: "", children, ...extra });

let failures = 0;
function eq(name, got, want) {
  if (got !== want) {
    failures++;
    console.error(
      `x    ${name}\n     got:  ${JSON.stringify(got)}\n     want: ${JSON.stringify(want)}`,
    );
  }
}

eq(
  "headings + paragraph",
  nodeToMarkdown(
    el("article", [
      el("h1", [t("Button")]),
      el("p", [t("A "), el("strong", [t("push")]), t(" control.")]),
    ]),
  ),
  "# Button\n\nA **push** control.\n",
);
eq(
  "list + link + code",
  nodeToMarkdown(
    el("article", [
      el("ul", [
        el("li", [t("one")]),
        el("li", [el("a", [t("two")], { href: "/2" })]),
      ]),
      el("pre", [t("npm i x\n")]),
    ]),
  ),
  "- one\n\n- [two](/2)\n\n```\nnpm i x\n```\n",
);
eq(
  "live-demo controls are skipped, prose survives",
  nodeToMarkdown(
    el("article", [
      el("p", [t("Press it.")]),
      el("div", [el("button", [t("Primary")]), el("button", [t("Tonal")])]),
      el("p", [t("Done.")]),
    ]),
  ),
  "Press it.\n\nDone.\n",
);
eq(
  "table rows",
  nodeToMarkdown(
    el("article", [
      el("table", [
        el("tr", [el("th", [t("a")]), el("th", [t("b")])]),
        el("tr", [el("td", [t("1")]), el("td", [t("2")])]),
      ]),
    ]),
  ),
  "| a | b |\n\n| 1 | 2 |\n",
);
eq(
  "blockquote + hr + h3",
  nodeToMarkdown(
    el("article", [
      el("h3", [t("Note")]),
      el("blockquote", [t("line one\nline two")]),
      el("hr", []),
    ]),
  ),
  "### Note\n\n> line one\n> line two\n\n---\n",
);

if (failures > 0) {
  console.error(`check-markdown: ${failures} failure(s)`);
  process.exit(1);
}
console.log("check-markdown: ok — 5 rule groups hold");
