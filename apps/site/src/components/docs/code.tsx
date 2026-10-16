/**
 * A code block that carries its own copy affordance.
 *
 * The snippets on this site are compiled against the real packages by
 * `scripts/check-snippets.mjs`; a snippet that stops typechecking fails that
 * check rather than quietly misleading a reader.
 */
import { Icon } from "@xoroh/kern-icons";
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

export function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      {/* 32px overlay affordance (documented exception to the 48dp MIN_TARGET:
          a full 48dp circle would cover the code it annotates; the affordance
          is duplicated by the keyboard-accessible block actions beside it). */}
      <button
        type="button"
        className={`absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-(--sys-color-outline-variant) bg-(--sys-color-surface) text-(--sys-color-on-surface-variant) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            // Clipboard is unavailable (insecure origin, denied permission);
            // the text is still selectable on screen.
          }
        }}
      >
        <Icon name={copied ? "check" : "attach"} size={16} />
      </button>
      <pre
        className={`m-0 overflow-x-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high) p-4 pr-12 ${T_CODE} text-(--sys-color-on-surface)`}
      >
        <code>{children}</code>
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
    <section className="flex flex-col gap-3">
      <h2
        id={`step-${n}`}
        className={`m-0 flex items-center gap-3 ${T_SECTION} text-(--sys-color-on-surface)`}
      >
        <span
          aria-hidden="true"
          className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-(--sys-color-secondary-container) ${T_LABEL_LG} text-(--sys-color-on-secondary-container)`}
        >
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
