/**
 * DOM → Markdown for copy-page-as-Markdown (Part 6 AI-readiness).
 *
 * WHAT IT IS: the page's prose + code + links as markdown, for pasting into
 * an LLM. It is NOT a perfect serialization — it is a stated subset:
 *
 * - Rendered: h1–h4 (`#`), p, ul/ol/li, pre/code (fences), a (text + url),
 *   table rows (`|`), blockquote (`>`), strong/em, hr.
 * - SKIPPED: `button input select textarea` text (live-demo chrome, not
 *   prose), `[aria-hidden]`, `script/style/nav`, `data-md-skip` subtrees.
 *   A component page's demo buttons would otherwise export as stray text
 *   lines ("Primary Tonal Outlined") that read as content.
 * - Everything else (div/span/section) is transparent: children recurse.
 *
 * Split for testability: `nodeToMarkdown` is pure over a minimal interface
 * (unit-tested under bun, no DOM); `domToMarkdown` adapts a live Element.
 * The adapter is 15 lines; the rules carry the tests.
 */
export type MdNode = {
  tag: string;
  text: string;
  href?: string;
  children: MdNode[];
};

const SKIP_TAGS = new Set([
  "button",
  "input",
  "select",
  "textarea",
  "script",
  "style",
  "nav",
]);

/**
 * The skip decision as a pure function of tag + attributes — exported FOR the
 * gate. `adapt()` below is a thin wrapper over this table; the rule lives
 * here so `check-markdown` pins it with one fixture per skip class instead
 * of trusting the wrapper. (review-m3 Part 6 finding: the old fixtures ran
 * `nodeToMarkdown` on hand-built trees, which never executes any skip —
 * `inline()` emits button text, so the "controls are skipped" fixture passed
 * for the wrong reason. The rule, not the wrapper, carries the tests.)
 */
export function shouldSkip(
  tag: string,
  attrs: { ariaHidden?: string | null; mdSkip?: boolean },
): boolean {
  if (SKIP_TAGS.has(tag)) return true;
  if (attrs.ariaHidden === "true") return true;
  if (attrs.mdSkip === true) return true;
  return false;
}

function kids(n: MdNode): string {
  const s = n.children.map(inline).join("");
  return s || n.text;
}

/** Raw text with no markdown (code fences, table cells). */
function raw(n: MdNode): string {
  if (!n.children.length) return n.text;
  return n.children.map(raw).join("");
}

function inline(n: MdNode): string {
  if (n.tag === "code") return `\`${kids(n)}\``;
  if (n.tag === "strong" || n.tag === "b") return `**${kids(n)}**`;
  if (n.tag === "em" || n.tag === "i") return `_${kids(n)}_`;
  if (n.tag === "a") {
    const k = kids(n);
    return n.href ? `[${k}](${n.href})` : k;
  }
  if (n.tag === "br") return "\n";
  return kids(n);
}

function blocks(n: MdNode, out: string[]): void {
  const tag = n.tag;
  if (tag === "pre") {
    out.push("```\n" + raw(n).replace(/\n+$/, "") + "\n```");
    return;
  }
  if (/^h[1-4]$/.test(tag)) {
    out.push(`${"#".repeat(Number(tag[1]))} ${inline(n).trim()}`);
    return;
  }
  if (tag === "p") {
    const t = inline(n).trim();
    if (t) out.push(t);
    return;
  }
  if (tag === "li") {
    const t = inline(n).trim();
    if (t) out.push(`- ${t}`);
    return;
  }
  if (tag === "hr") {
    out.push("---");
    return;
  }
  if (tag === "blockquote") {
    const t = inline(n).trim();
    if (t)
      out.push(
        t
          .split("\n")
          .map((l) => `> ${l}`.trimEnd())
          .join("\n"),
      );
    return;
  }
  if (tag === "tr") {
    const cells = n.children
      .filter((c) => c.tag === "td" || c.tag === "th")
      .map((c) => inline(c).trim().replace(/\|/g, "\\|"));
    if (cells.length) out.push(`| ${cells.join(" | ")} |`);
    return;
  }
  if (["table", "thead", "tbody", "ul", "ol"].includes(tag)) {
    for (const c of n.children) blocks(c, out);
    return;
  }
  // div/span/section/article/header/footer/main/li handled above: transparent
  for (const c of n.children) blocks(c, out);
}

export function nodeToMarkdown(root: MdNode): string {
  const out: string[] = [];
  blocks(root, out);
  return (
    out
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

function adapt(el: Element): MdNode | null {
  const tag = el.tagName.toLowerCase();
  if (
    shouldSkip(tag, {
      ariaHidden: el.getAttribute("aria-hidden"),
      mdSkip: el.hasAttribute("data-md-skip"),
    })
  )
    return null;
  const children: MdNode[] = [];
  for (const child of el.childNodes) {
    if (child.nodeType === 3) {
      const text = child.textContent ?? "";
      if (text.trim()) children.push({ tag: "#text", text, children: [] });
    } else if (child.nodeType === 1) {
      const c = adapt(child as Element);
      if (c) children.push(c);
    }
  }
  const href =
    tag === "a"
      ? ((el as HTMLAnchorElement).getAttribute("href") ?? undefined)
      : undefined;
  const text =
    children.length === 0
      ? (el.textContent ?? "").trim().replace(/\s+/g, " ")
      : "";
  return { tag, text, href, children };
}

/** Convert a live article element to markdown. Returns "" when root is null. */
export function domToMarkdown(root: Element | null): string {
  if (!root) return "";
  const node = adapt(root);
  if (!node) return "";
  return nodeToMarkdown(node);
}
