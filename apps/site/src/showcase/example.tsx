import type { ReactNode } from "react";
import { useId, useState } from "react";
import { T_BODY_SM, T_CODE, T_LEAD } from "../type-scale";

/**
 * The Example tier — the first of the three showcase layers (Example → Block →
 * Template, K-01-ladder P4-1).
 *
 * An Example is ONE runnable demonstration of one component, framed so the
 * reader can see the thing working and then see what produced it. Blocks
 * compose several components; Templates are whole pages. The three share this
 * frame so a Block and a Template read the same way an Example does.
 *
 * Deliberately NOT a screenshot and NOT a reimplementation: the `render`
 * callback returns the real component from the package. A demo that restates
 * the component's markup teaches the reader the wrong code.
 */

export type ExampleSpec = {
  /** Stable id, used for the React key and for deep-linking. */
  id: string;
  /** One line naming what this example shows. */
  title: string;
  /** Why this example exists — what it is meant to demonstrate. */
  description: string;
  /** The live component, straight from the package. */
  render: () => ReactNode;
  /**
   * The source that produced it. Optional: some examples are about behaviour
   * rather than markup, and a code fence would be noise. When present it is
   * shown under the demo so the reader can copy the real thing.
   */
  code?: string;
};

const FRAME =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant)";

const STAGE =
  "flex flex-wrap items-center justify-center gap-4 rounded-(--md-sys-shape-corner-medium) bg-(--md-sys-color-surface-container-low) p-8";

const BODY = `text-(--md-sys-color-on-surface-variant) ${T_BODY_SM}`;

/**
 * One example: title, description, and the Preview/Code tabs.
 *
 * Part 4 — Chakra `ExampleTabs` pattern, no iframes: the stage and the source
 * are two tabs over the same example, not a stacked code block. Examples
 * without `code` (behaviour demos where a fence would be noise) render the
 * stage with no tab bar — a disabled Code tab would promise source that does
 * not exist. Tabs are real `tablist`/`tab`/`tabpanel` roles with arrow-key
 * movement; the Code panel carries a Copy button (review NOTE on Part 4:
 * copy on every demo) with a clipboard-API fallback for non-secure contexts.
 */
export function Example({ spec }: { spec: ExampleSpec }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  const previewId = `example-${base}-preview`;
  const codeId = `example-${base}-code`;

  function onTabKey(event: React.KeyboardEvent) {
    // APG tabs pattern, automatic activation: arrows move selection AND DOM
    // focus together (a screen reader announces via aria-selected either way,
    // but sighted keyboard users need the focus ring to follow); Home/End
    // jump to first/last. review-showcase 4a minors, fixed when touching the
    // handler as the verdict suggested.
    const order = ["preview", "code"] as const;
    let next: (typeof order)[number] | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const i = order.indexOf(tab);
      next = order[(i + (event.key === "ArrowRight" ? 1 : order.length - 1)) % order.length];
    } else if (event.key === "Home") {
      next = order[0];
    } else if (event.key === "End") {
      next = order[order.length - 1];
    }
    if (!next) return;
    event.preventDefault();
    setTab(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  }

  async function copy() {
    if (!spec.code) return;
    try {
      await navigator.clipboard.writeText(spec.code);
      setCopied(true);
    } catch {
      // Non-secure contexts (plain http previews) have no clipboard API:
      // the legacy execCommand path still copies from a real selection.
      // Its own try/catch: if execCommand itself throws (locked-down
      // contexts), the throw would escape as an unhandled rejection, and
      // "Copied" must only display when something actually copied
      // (review-m3 4a note: copy-failure honesty).
      try {
        const area = document.createElement("textarea");
        area.value = spec.code;
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (ok) setCopied(true);
      } catch {
        // Nothing copied; leave the button reading "Copy".
      }
    }
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className={`${FRAME} m-0 flex flex-col overflow-hidden`}>
      <figcaption className="flex flex-col gap-1 border-b border-(--md-sys-color-outline-variant) px-6 py-4">
        <h3
          id={`example-${spec.id}`}
          className={`m-0 ${T_LEAD} text-(--md-sys-color-on-surface)`}
        >
          {spec.title}
        </h3>
        <p className={`m-0 ${BODY}`}>{spec.description}</p>
      </figcaption>

      {spec.code ? (
        <div
          role="tablist"
          aria-label={`${spec.title} view`}
          className="flex gap-1 border-b border-(--md-sys-color-outline-variant) px-4 pt-2"
          onKeyDown={onTabKey}
        >
          {(
            [
              { key: "preview", label: "Preview" },
              { key: "code", label: "Code" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`${base}-tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={t.key === "preview" ? previewId : codeId}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-3 py-2 ${T_BODY_SM} ${
                tab === t.key
                  ? "border-(--md-sys-color-primary) text-(--md-sys-color-primary)"
                  : "border-transparent text-(--md-sys-color-on-surface-variant)"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}

      {!spec.code && <div className={STAGE}>{spec.render()}</div>}

      {spec.code && tab === "preview" && (
        <div
          role="tabpanel"
          id={previewId}
          aria-labelledby={`${base}-tab-preview`}
          className={STAGE}
        >
          {spec.render()}
        </div>
      )}

      {spec.code && tab === "code" && (
        <div
          role="tabpanel"
          id={codeId}
          aria-labelledby={`${base}-tab-code`}
          className="flex flex-col"
        >
          <div className="flex justify-end border-b border-(--md-sys-color-outline-variant) px-4 py-1">
            <button
              type="button"
              onClick={copy}
              className={`rounded-(--md-sys-shape-corner-small) px-2 py-1 ${T_BODY_SM} text-(--md-sys-color-primary) hover:bg-(--md-sys-color-primary-container)`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre
            className={`m-0 overflow-x-auto bg-(--md-sys-color-surface-container-high) p-6 ${T_CODE} text-(--md-sys-color-on-surface)`}
          >
            <code>{spec.code}</code>
          </pre>
        </div>
      )}
    </figure>
  );
}

/**
 * A run of examples for one component. Empty is a valid state and says so
 * rather than rendering nothing — a blank showcase reads as a broken page,
 * while this reads as tracked work.
 */
export function ExampleList({ examples }: { examples: ExampleSpec[] }) {
  if (examples.length === 0) {
    return (
      <p className={BODY}>
        No examples are registered yet. That is a gap in the site, not in the
        package — it is tracked rather than hidden here.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {examples.map((spec) => (
        <Example key={spec.id} spec={spec} />
      ))}
    </div>
  );
}
