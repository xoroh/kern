/**
 * A code block that carries its own copy affordance.
 *
 * The snippets on this site are compiled against the real packages by
 * `scripts/check-snippets.mjs`; a snippet that stops typechecking fails that
 * check rather than quietly misleading a reader.
 *
 * Highlighting is token-derived (`highlight.tsx` classifies, `styles.css`
 * paints from `--sys-color-*` roles, light + `.dark`), so code blocks
 * repaint with the theme instead of wearing a vendored TextMate theme.
 */
import { useState } from "react";
import {
  T_CODE,
  T_LABEL_LG,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  STATE_LAYERS,
  TRANSITION,
} from "../../domains/shared/systems/ui";
import { ChromeIcon } from "../chrome/chrome-icons";
import { HighlightedCode, type HighlightLanguage } from "./highlight";

const PRE =
  "m-0 overflow-x-auto bg-(--sys-color-surface-container-high) p-5 text-(--sys-color-on-surface)";
const CODE_TEXT = `${T_CODE} codeblock`;

function useCopy(text: string): { copied: boolean; copy: () => void } {
  const [copied, setCopied] = useState(false);
  return {
    copied,
    copy: () => {
      const done = () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      };
      // The async clipboard API first; the execCommand fallback covers
      // non-secure origins (plain http previews) where it is absent. The
      // "Copied" face shows only when text actually reached the clipboard —
      // a throw leaves the button reading "Copy".
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, () => {
          // Denied permission: fall through to the legacy path below.
          legacyCopy(text, done);
        });
      } else {
        legacyCopy(text, done);
      }
    },
  };
}

function legacyCopy(text: string, done: () => void) {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (ok) done();
  } catch {
    // Nothing copied; the button keeps reading "Copy".
  }
}

export function Code({
  children,
  language = "tsx",
  filename,
}: {
  children: string;
  /** tsx for component fences, bash for install commands, css for imports. */
  language?: HighlightLanguage;
  /** Rendered as a header tab (shadcn pattern); when absent the copy control overlays. */
  filename?: string;
}) {
  const { copied, copy } = useCopy(children);
  if (filename) {
    return (
      <div className="overflow-hidden rounded-(--sys-shape-corner-large) border border-(--sys-color-outline-variant)">
        <div className="flex min-h-12 items-center gap-2 border-b border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-low) px-4 py-2">
          <span
            className={`min-w-0 flex-1 truncate font-mono text-(--sys-color-on-surface-variant) [font-size:var(--sys-typescale-label-medium-font-size)] [line-height:var(--sys-typescale-label-medium-line-height)]`}
          >
            {filename}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : `Copy ${filename}`}
            className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-3 font-mono text-(--sys-color-primary) hover:bg-(--sys-color-on-surface)/8 active:bg-(--sys-color-on-surface)/12 [font-size:var(--sys-typescale-label-medium-font-size)] [line-height:var(--sys-typescale-label-medium-line-height)]"
          >
            <ChromeIcon name={copied ? "check" : "content-copy"} size={16} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className={`${PRE} rounded-none border-0 ${CODE_TEXT}`}>
          <HighlightedCode code={children} language={language} />
        </pre>
      </div>
    );
  }
  return (
    <div className="relative">
      <button
        type="button"
        className={`absolute top-2 right-2 z-10 flex h-8 min-w-8 cursor-pointer items-center justify-center gap-1 rounded-full border border-(--sys-color-outline-variant) bg-(--sys-color-surface) px-2 text-(--sys-color-on-surface-variant) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
        // 32px overlay affordance, not the 48dp floor: a full target would
        // cover the code it copies. Keyboard-reachable via tab (global
        // :focus-visible ring) with press feedback below.
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={copy}
      >
        <ChromeIcon name={copied ? "check" : "content-copy"} size={16} />
        {copied ? (
          <span className="pr-1 font-mono [font-size:var(--sys-typescale-label-small-font-size)] [line-height:var(--sys-typescale-label-small-line-height)]">
            Copied
          </span>
        ) : null}
      </button>
      <pre
        className={`${PRE} rounded-(--sys-shape-corner-large) pr-12 ${CODE_TEXT}`}
      >
        <HighlightedCode code={children} language={language} />
      </pre>
    </div>
  );
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-(--sys-shape-corner-extra-large) border border-(--sys-color-outline-variant)/70 bg-(--sys-color-surface-container-low) p-6">
      <h2
        id={`step-${n}`}
        className={`m-0 flex items-center gap-3 ${T_SECTION} text-(--sys-color-on-surface)`}
      >
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-(--sys-color-secondary-container) ${T_LABEL_LG} text-(--sys-color-on-secondary-container)`}
        >
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
