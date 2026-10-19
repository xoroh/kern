/**
 * Copy-page-as-Markdown button + View-.md link (Part 6 AI-readiness, 5D).
 *
 * Finds the nearest `[data-copy-md-root]` article at click time, converts it
 * with `domToMarkdown`, and copies the result — same CopyButton treatment
 * and copy-failure honesty (only "Copied" when text reached the clipboard).
 * Looks the query up AT CLICK, not at mount: the button mounts in the shell
 * header while the article streams in below it.
 *
 * Beside the button sits the View .md link: the same renderer's canonical
 * per-page markdown (emitted by scripts/generate-page-md.mjs, served from
 * public/md/) for agents that fetch rather than copy. The href derives from
 * the current route plus the active tab — /components/m3/<slug> with its
 * Web/Native tab, /foundations/m3/<slug>, and the kern-level
 * /foundations/<slug> pages are the only pages that render this affordance,
 * so anything else yields null and the link stays hidden. Styling is token
 * roles only, so both themes resolve it the same way they resolve the button.
 */

import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { COPY_BUTTON_CLASS } from "../../showcase/copy-button";
import { domToMarkdown } from "../../systems/dom-to-markdown";
import { ChromeIcon } from "./chrome-icons";

/**
 * Same M3 outlined button as every copy action (the shared class keeps the
 * treatment single-sourced), plus the View-.md link beside it wearing the
 * same container so the pair reads as one toolbar.
 */

/**
 * This page's canonical .md URL, or null off the docs pages that emit one.
 * Pure over the pathname (plus the active tab on family pages) so
 * check-page-md can pin the mapping without a DOM.
 *
 * One page, two .md files: the family page renders one renderer at a time,
 * and the per-renderer .md is the fetchable form of exactly what is shown.
 * Old `/components/<platform>/<slug>` pathnames map to null — that page no
 * longer exists, and a View-.md link must never point at one.
 */
export function mdHrefForPathname(
  pathname: string,
  platform?: string,
): string | null {
  const family = pathname.match(/^\/components\/m3\/([^/]+)\/?$/);
  if (family && (platform === "web" || platform === "mobile")) {
    return `/md/${platform}/${family[1]}.md`;
  }
  const foundations = pathname.match(/^\/foundations\/(?:m3\/)?([^/]+)\/?$/);
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

export function CopyMarkdownButton({ platform }: { platform?: string } = {}) {
  const [copied, setCopied] = useState(false);
  const { pathname } = useLocation();
  const mdHref = mdHrefForPathname(pathname, platform);

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
        className={COPY_BUTTON_CLASS}
      >
        <ChromeIcon name={copied ? "check" : "content-copy"} size={16} />
        {copied ? "Copied" : "Copy as Markdown"}
      </button>
      {mdHref ? (
        <a
          href={mdHref}
          title="Open this page's canonical Markdown (same content, for fetching into an LLM)"
          className={`${COPY_BUTTON_CLASS} no-underline`}
        >
          <ChromeIcon name="description" size={16} />
          View .md
        </a>
      ) : null}
    </span>
  );
}
