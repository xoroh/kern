import type { ComponentDoc } from "../types";

export const kernComposer: ComponentDoc = {
  slug: "kern-composer",
  name: "Kern composer",
  oneLiner:
    "Kern composer is the message composer with modes, panels, reply and draft affordances.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "KernComposer",
    variants: ["mode: public · internal · note"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernComposer"],
  keyboard: [
    {
      key: "Enter",
      action:
        "Sends the draft. The input is a textarea, so plain Enter sends and Shift+Enter keeps the newline.",
    },
    {
      key: "Shift+Enter",
      action:
        "Inserts a newline without sending — the multiline escape hatch inside a send-on-Enter field.",
    },
  ],
  customization: {
    supported: [
      "Affordances are opt-in: passing state, a default, or the change callback renders the row — absent props mean absent UI for scheduling, drafts and out-of-office alike.",
      "`value` plus `onSend` is the minimal composer; `panels`, `replyTo`, `mode`, `cannedInserts` and the knowledge flyout layer on.",
      "The mode bar, reply bar, attachment tray and canned picker are exported slots sharing this contract.",
    ],
    notSupported: [
      "There is no transport inside. `onSend` carries the draft out; delivery, retries and history stay host-owned.",
      "There is no second option list. The canned picker composes `KernPicker` — inline popover on web, owned-trigger sheet on native.",
      "There is no rich text. The draft is a string; formatting is the host's renderer, not the composer's model.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string | undefined",
      note: "Draft text.",
    },
    {
      name: "defaultValue",
      type: "string | undefined",
    },
    {
      name: "onValueChange",
      type: "((value: string) => void) | undefined",
    },
    {
      name: "onSend",
      type: "((text: string) => void) | undefined",
      note: "Send (DOMAIN action; receives the current text).",
    },
    {
      name: "mode",
      type: '"public" | "internal" | "note"',
    },
    {
      name: "defaultMode",
      type: "ComposerMode | undefined",
    },
    {
      name: "onModeChange",
      type: "((mode: ComposerMode) => void) | undefined",
    },
    {
      name: "replyTo",
      type: "{ author: string; excerpt: string; } | undefined",
    },
    {
      name: "onDismissReply",
      type: "(() => void) | undefined",
    },
    {
      name: "panels",
      type: "ReactNode",
      note: "Panel slot: attachment tray content, article cards, custom panels.",
    },
    {
      name: "attachments",
      type: "readonly ComposerAttachment[] | undefined",
    },
    {
      name: "onRemoveAttachment",
      type: "((id: string) => void) | undefined",
    },
    {
      name: "cannedInserts",
      type: "readonly CannedInsert[] | undefined",
    },
    {
      name: "onCannedSelect",
      type: "((insert: CannedInsert) => void) | undefined",
    },
    {
      name: "knowledge",
      type: "ReactNode",
      note: "Knowledge-flyout slot (disclosure; uncontrolled).",
    },
    {
      name: "knowledgeLabel",
      type: "string | undefined",
    },
    {
      name: "scheduledFor",
      type: "Date | null | undefined",
      note: "Scheduling affordance. Passing state, a default, or the change callback renders the schedule row; `null` = send now. The host owns the clock.",
    },
    {
      name: "defaultScheduledFor",
      type: "Date | null | undefined",
    },
    {
      name: "onScheduledChange",
      type: "((date: Date | null) => void) | undefined",
    },
    {
      name: "draftStatus",
      type: "ComposerDraftStatus | undefined",
      note: "Draft-state affordance. Present → saved/saving line + actions.",
    },
    {
      name: "onSaveDraft",
      type: "(() => void) | undefined",
    },
    {
      name: "onDiscardDraft",
      type: "(() => void) | undefined",
    },
    {
      name: "outOfOffice",
      type: "boolean | undefined",
      note: "Out-of-office affordance. Passing state, a default, or the change callback renders the OOO banner + toggle.",
    },
    {
      name: "defaultOutOfOffice",
      type: "boolean | undefined",
    },
    {
      name: "onOutOfOfficeChange",
      type: "((next: boolean) => void) | undefined",
    },
    {
      name: "sending",
      type: "boolean | undefined",
    },
    {
      name: "disabled",
      type: "boolean | undefined",
    },
    {
      name: "label",
      type: "string | undefined",
    },
    {
      name: "placeholder",
      type: "string | undefined",
    },
    {
      name: "sendLabel",
      type: "string | undefined",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "The mode bar is a real radiogroup, so visibility announces as a counted choice rather than three buttons.",
    "The draft field is a labelled textarea; the send control is a pressable with its own label.",
    "Draft state reads as text — saved, saving, unsaved — and the knowledge panel reports expanded state on its trigger.",
  ],
};
