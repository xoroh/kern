import type { ReactNode } from "react";
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

/** One example: title, description, live stage, and the source when useful. */
export function Example({ spec }: { spec: ExampleSpec }) {
  return (
    <figure className={`${FRAME} m-0 flex flex-col overflow-hidden`}>
      <figcaption className="flex flex-col gap-1 border-b border-(--md-sys-color-outline-variant) px-6 py-4">
        <h3 className={`m-0 ${T_LEAD} text-(--md-sys-color-on-surface)`}>
          {spec.title}
        </h3>
        <p className={`m-0 ${BODY}`}>{spec.description}</p>
      </figcaption>

      <div className={STAGE}>{spec.render()}</div>

      {spec.code ? (
        <pre
          className={`m-0 overflow-x-auto border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) p-6 ${T_CODE} text-(--md-sys-color-on-surface)`}
        >
          <code>{spec.code}</code>
        </pre>
      ) : null}
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
