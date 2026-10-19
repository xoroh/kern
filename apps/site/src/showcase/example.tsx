import type { ReactNode } from "react";
import { useId, useState } from "react";
import {
  T_BODY_SM,
  T_CODE,
  T_LEAD,
} from "../domains/shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  STAGE as STAGE_TOKEN,
  TRANSITION,
} from "../domains/shared/systems/ui";
import { CopyButton } from "./copy-button";
import { demoExportSource, demoReproSource } from "./demo-export";

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

/**
 * The demo stage — the kit's one STAGE tone, plus the layout every demo
 * shares (centred, wrapping). Flat by law: no dot texture, no gradient, so
 * the demo reads as the component and not as page decoration.
 */
const STAGE = `flex flex-wrap items-center justify-center gap-4 p-8 ${STAGE_TOKEN}`;

const BODY = `text-(--sys-color-on-surface-variant) ${T_BODY_SM}`;

/**
 * One example: title, description, and the Preview/Code tabs.
 *
 * Part 4 — Chakra `ExampleTabs` pattern, no iframes: the stage and the source
 * are two tabs over the same example, not a stacked code block. Examples
 * without `code` (behaviour demos where a fence would be noise) render the
 * stage with no tab bar — a disabled Code tab would promise source that does
 * not exist. Tabs are real `tablist`/`tab`/`tabpanel` roles with arrow-key
 * movement; the Code panel carries the shared CopyButton (review NOTE on
 * Part 4: copy on every demo).
 */
export function Example({ spec }: { spec: ExampleSpec }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
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
      next =
        order[
          (i + (event.key === "ArrowRight" ? 1 : order.length - 1)) %
            order.length
        ];
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

  return (
    <figure className={`${CARD} m-0 flex flex-col overflow-hidden`}>
      <figcaption className="flex flex-col gap-1 border-b border-(--sys-color-outline-variant) px-6 py-4">
        <h3
          id={`example-${spec.id}`}
          className={`m-0 ${T_LEAD} text-(--sys-color-on-surface)`}
        >
          {spec.title}
          {/*
            Per-demo permalink: every docs demo is independently openable —
            this anchor is the demo's address, and the Export/Repro buttons in
            the Code panel are its copyable form.
          */}
          <a
            href={`#example-${spec.id}`}
            aria-label={`Permalink to ${spec.title}`}
            title="Permalink to this example"
            className={`ml-2 inline-flex items-center text-(--sys-color-on-surface-variant) no-underline hover:text-(--sys-color-on-surface) ${TRANSITION} ${FOCUS_RING}`}
          >
            #
          </a>
        </h3>
        <p className={`m-0 ${BODY}`}>{spec.description}</p>
      </figcaption>

      {spec.code ? (
        <div
          role="tablist"
          aria-label={`${spec.title} view`}
          className="flex gap-1 border-b border-(--sys-color-outline-variant) px-4 pt-2"
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
              className={`-mb-px inline-flex min-h-12 items-center border-b-[3px] px-3 ${T_BODY_SM} ${TRANSITION} ${
                tab === t.key
                  ? "border-(--sys-color-primary) text-(--sys-color-primary)"
                  : "border-transparent text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}

      {!spec.code && <div className={STAGE}>{spec.render()}</div>}

      {spec.code && (
        <>
          <div
            role="tabpanel"
            id={previewId}
            aria-labelledby={`${base}-tab-preview`}
            data-view="preview"
            hidden={tab !== "preview"}
            className={STAGE}
          >
            {spec.render()}
          </div>

          <div
            role="tabpanel"
            id={codeId}
            aria-labelledby={`${base}-tab-code`}
            data-view="code"
            hidden={tab !== "code"}
            className="flex flex-col"
          >
            {/*
            Per-demo export: Copy is the fence as shown; Export is the same
            fence as a standalone module (imports derived from the tags used);
            Repro is that module as a bug-report template. Buttons, so the
            copy-markdown export skips them like the rest of the demo chrome.
          */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-b border-(--sys-color-outline-variant) px-4 py-1">
              <CopyButton text={demoExportSource(spec)} label="Export" />
              <CopyButton text={demoReproSource(spec)} label="Repro" />
              <CopyButton text={spec.code} />
            </div>
            <pre
              className={`m-0 overflow-x-auto rounded-b-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-high) p-6 ${T_CODE} text-(--sys-color-on-surface)`}
            >
              <code>{spec.code}</code>
            </pre>
          </div>
        </>
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
