import type { ComponentDoc } from "../types";

export const alertDialog: ComponentDoc = {
  slug: "alert-dialog",
  name: "Alert dialog",
  oneLiner:
    "Alert dialogs interrupt for a decision that must be made before anything else continues.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "AlertDialog",
    variants: [],
    // Material 3 assigns "dialogs (modal)" resting level 3, and the surface
    // ships `--sys-elevation-level3` to match. Asserted against the row.
    elevation: 3,
  },
  parts: [
    "AlertDialog",
    "AlertDialogRoot",
    "AlertDialogTrigger",
    "AlertDialogContent",
    "AlertDialogTitle",
    "AlertDialogDescription",
    "AlertDialogClose",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Escape",
      action: "Cancels the alert; focus returns to the trigger.",
    },
    {
      key: "Tab / Shift+Tab",
      action: "Trapped inside while open.",
    },
    {
      key: "Enter / Space",
      action:
        "Runs the focused action. The close control and any button the caller puts in the panel are real buttons, so the press is the browser's.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The surface is capped in width so the description is readable rather than stretched.",
      "Colour of the consequences comes from the roles the actions use, not from a dialog prop.",
    ],
    notSupported: [
      "There is no `severity` or `tone` prop. Whether this is dangerous is the caller's to say in the actions and their roles.",
      "There is no `dismissible` prop. Backdrop and Escape behaviour come from the primitive and are not tunable — an alert that can be waved away is not an alert.",
      "There is no `size` prop. One width, capped so the text stays readable.",
    ],
  },
  api: [
    {
      name: "open",
      for: ["AlertDialogRoot"],
      type: "boolean",
      note: "Controlled open state on `AlertDialogRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      for: ["AlertDialogRoot"],
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and backdrop clicks.",
    },
    {
      name: "className",
      for: [
        "AlertDialogTrigger",
        "AlertDialogContent",
        "AlertDialogTitle",
        "AlertDialogDescription",
        "AlertDialogClose",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["AlertDialogTrigger", "AlertDialogClose"],
      type: "boolean",
      note: "On the trigger or on an action button.",
    },
    {
      name: "actionsRef",
      for: ["AlertDialogRoot"],
      type: "RefObject<DialogRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the dialog; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "handle",
      for: ["AlertDialogRoot", "AlertDialogTrigger"],
      type: "AlertDialogHandle<unknown> | undefined",
      note: "Associates the dialog with a trigger: create one with `AlertDialog.createHandle()`, set on an external trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "children",
      for: ["AlertDialogRoot"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "The dialog's content — or a render function receiving the active trigger's payload.",
    },
    {
      name: "defaultOpen",
      for: ["AlertDialogRoot"],
      type: "boolean | undefined",
      note: "Whether the dialog starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["AlertDialogRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "triggerId",
      for: ["AlertDialogRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the dialog answers to. For controlled dialogs (`open` set); uncontrolled dialogs need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["AlertDialogRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the dialog answers to, for an initially open dialog (`defaultOpen` set).",
    },
    {
      name: "id",
      for: ["AlertDialogTrigger"],
      type: "string | undefined",
      note: "Id of the trigger, forwarded to the rendered element and naming the active trigger for controlled dialogs (with the root's `triggerId` prop).",
    },
    {
      name: "nativeButton",
      for: ["AlertDialogTrigger", "AlertDialogClose"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "payload",
      for: ["AlertDialogTrigger"],
      type: "unknown",
      note: "Data handed to the dialog when this trigger opens it, read by a payload render function in the root's children.",
    },
    {
      name: "initialFocus",
      for: ["AlertDialogContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the dialog opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["AlertDialogContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the dialog closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "style",
      for: [
        "AlertDialogTrigger",
        "AlertDialogContent",
        "AlertDialogTitle",
        "AlertDialogDescription",
        "AlertDialogClose",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `DialogTriggerState` on the trigger, `DialogPopupState` on the surface, `DialogTitleState` on the title, `DialogDescriptionState` on the description, `DialogCloseState` on the close control.",
    },
    {
      name: "render",
      for: [
        "AlertDialogTrigger",
        "AlertDialogContent",
        "AlertDialogTitle",
        "AlertDialogDescription",
        "AlertDialogClose",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or close control when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The surface is a modal dialog with `aria-modal`, so the page behind it is announced as inert rather than merely covered.",
    "`AlertDialogTitle` is the accessible name and `AlertDialogDescription` the description, so the decision is announced with its consequence.",
    "Focus is trapped inside while open and returns to the trigger on close — nobody is dropped back at the top of the page.",
    "It interrupts on purpose. That is the tool's whole job, and the reason not to use it for anything that can wait.",
  ],
};
