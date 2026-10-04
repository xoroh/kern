import { useState } from "react";
import { Icon } from "@xoroh/kern-icons";
import { T_BODY_SM } from "../systems/type-scale";

/**
 * Copy button shared by the Example and Configurator code panels.
 *
 * One treatment everywhere so copy reads as a button, not status text
 * (review-showcase 4b minor): an explicit bordered button with an icon that
 * flips to a check on success. "Copied" displays only when text actually
 * reached the clipboard (review-m3 4a note: copy-failure honesty) — the
 * legacy fallback checks `execCommand`'s return, and a throw leaves the
 * button reading "Copy".
 */
export function CopyButton({ text }: { text: string }) {
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
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) px-2 py-1 ${T_BODY_SM} text-(--md-sys-color-primary) hover:bg-(--md-sys-color-primary-container)`}
    >
      <Icon name={copied ? "check" : "content-copy"} size={16} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
