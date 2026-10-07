#!/usr/bin/env bun
/**
 * dom-to-markdown unit check — pure rules over mock trees, no DOM.
 * Run: bun scripts/check-markdown.mjs (wired into check:docs chain).
 * A converter whose rules aren't asserted rots the day someone "improves" it.
 */
import { nodeToMarkdown, shouldSkip } from "../src/systems/dom-to-markdown.ts";

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
  // Honest version of this fixture (review-m3 Part 6 finding): the emitter
  // renders what it is given — nodeToMarkdown(p > button) DOES emit the
  // button text, and that is correct, because skipping happens in adapt().
  // What the gate pins is the skip table itself, one fixture per class below.
  // This fixture pins the emitter side: surrounding prose renders, proving
  // where the boundary lies.
  "live-demo controls are skipped at the adapt boundary (not by the emitter)",
  nodeToMarkdown(
    el("article", [el("p", [t("Press it.")]), el("p", [t("Done.")])]),
  ),
  "Press it.\n\nDone.\n",
);
// One fixture per skip class, against the rule itself (shouldSkip), not the
// wrapper. A refactor that narrows adapt()'s skip fails here.
const skipCases = [
  ["button", {}, true],
  ["input", {}, true],
  ["select", {}, true],
  ["textarea", {}, true],
  ["script", {}, true],
  ["style", {}, true],
  ["nav", {}, true],
  ["div", { ariaHidden: "true" }, true],
  ["span", { ariaHidden: "true" }, true],
  ["div", { mdSkip: true }, true],
  ["div", { ariaHidden: "false" }, false],
  ["div", {}, false],
  ["p", {}, false],
  ["a", {}, false],
  ["h2", {}, false],
  ["pre", {}, false],
];
for (const [tag, attrs, want] of skipCases) {
  eq(
    `skip table: <${tag}> ${JSON.stringify(attrs)}`,
    String(shouldSkip(tag, attrs)),
    String(want),
  );
}
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
