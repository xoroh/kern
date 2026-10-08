/**
 * Copy-page-as-Markdown button + View-.md link (Part 6 AI-readiness, 5D).
 *
 * Finds the nearest `[data-copy-md-root]` article at click time, converts it
 * with `domToMarkdown`, and copies the result — same CopyButton treatment
 * and copy-failure honesty (only "Copied" when text reached the clipboard).
 * Looks the query up AT CLICK, not at mount: the button mounts in the shell
 * header while the article streams in below it.
 *
 * Beside the button sits the View .md link: the same page's canonical
 * per-page markdown (emitted by scripts/generate-page-md.mjs, served from
 * public/md/) for agents that fetch rather than copy. The href derives from
 * the current route — /components/<platform>/<slug> and /foundations/<slug>
 * are the only pages that render this affordance, so anything else yields
 * null and the link stays hidden. Styling is token roles only, so both
 * themes resolve it the same way they resolve the button.
 */

import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import { domToMarkdown } from "../../systems/dom-to-markdown";
import { T_BODY_SM } from "../../domains/shared/systems/type-scale";

const ACTION = `inline-flex items-center gap-1.5 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) px-2 py-1 ${T_BODY_SM} text-(--md-sys-color-primary) hover:bg-(--md-sys-color-primary-container)`;

/**
 * This page's canonical .md URL, or null off the docs pages that emit one.
 * Pure over the pathname so check-page-md can pin the mapping without a DOM.
 */
export function mdHrefForPathname(pathname: string): string | null {
  const family = pathname.match(/^\/components\/(web|mobile)\/([^/]+)\/?$/);
  if (family) return `/md/${family[1]}/${family[2]}.md`;
  const foundations = pathname.match(/^\/foundations\/([^/]+)\/?$/);
  if (foundations) return `/md/foundations/${foundations[1]}.md`;
  return null;
}

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
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        title="Copy this page as Markdown for pasting into an LLM (prose + code + links; live-demo controls excluded)"
        className={ACTION}
      >
        <Icon name={copied ? "check" : "content-copy"} size={16} />
        {copied ? "Copied" : "Copy as Markdown"}
      </button>
      {typeof window !== "undefined" &&
      mdHrefForPathname(window.location.pathname) ? (
        <a
          href={mdHrefForPathname(window.location.pathname) as string}
          title="Open this page's canonical Markdown (same content, for fetching into an LLM)"
          className={`${ACTION} no-underline`}
        >
          <Icon name="description" size={16} />
          View .md
        </a>
      ) : null}
    </span>
  );
}
