/**
 * Copy-page-as-Markdown button (Part 6 AI-readiness).
 *
 * Finds the nearest `[data-copy-md-root]` article at click time, converts it
 * with `domToMarkdown`, and copies the result — same CopyButton treatment
 * and copy-failure honesty (only "Copied" when text reached the clipboard).
 * Looks the query up AT CLICK, not at mount: the button mounts in the shell
 * header while the article streams in below it.
 */

import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import { domToMarkdown } from "../../systems/dom-to-markdown";
import { T_BODY_SM } from "../../systems/type-scale";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyMarkdownButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const root = document.querySelector("[data-copy-md-root]");
    const md = domToMarkdown(root);
    if (!md.trim()) return;
    if (await copyText(md)) setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy this page as Markdown for pasting into an LLM (prose + code + links; live-demo controls excluded)"
      className={`inline-flex items-center gap-1.5 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) px-2 py-1 ${T_BODY_SM} text-(--md-sys-color-primary) hover:bg-(--md-sys-color-primary-container)`}
    >
      <Icon name={copied ? "check" : "content-copy"} size={16} />
      {copied ? "Copied" : "Copy as Markdown"}
    </button>
  );
}
