import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import { T_BODY_SM } from "../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  STATE_LAYERS,
  TRANSITION,
} from "../domains/shared/systems/ui";

/**
 * Copy button shared by the Example and Configurator code panels (and the
 * block install toolbar), plus the M3 outlined button every copy/export
 * action on the site wears: full radius, transparent at rest, an on-surface
 * state layer on hover/press and the shared secondary focus ring — no
 * resting fill, no `small` corner. "Copied" displays only when text actually
 * reached the clipboard (review-m3 4a note: copy-failure honesty) — the
 * legacy fallback checks `execCommand`'s return, and a throw leaves the
 * button reading "Copy".
 */
export const COPY_BUTTON_CLASS = `inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-(--sys-shape-corner-full) border border-(--sys-color-outline) bg-transparent px-4 ${T_BODY_SM} text-(--sys-color-primary) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`;

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  /** Button face. "Export" and "Repro" reuse this button for the demo DX actions. */
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Non-secure contexts (plain http previews) have no clipboard API:
      // the legacy execCommand path still copies from a real selection.
      try {
        const area = document.createElement("textarea");
        area.value = text;
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
    <button type="button" onClick={copy} className={COPY_BUTTON_CLASS}>
      <Icon name={copied ? "check" : "content-copy"} size={16} />
      {copied ? "Copied" : label}
    </button>
  );
}
