import type { ComponentDoc } from "../types";

export const dialog: ComponentDoc = {
  slug: "dialog",
  name: "Dialog",
  oneLiner:
    "A dialog asks people to complete a focused task before they carry on with the rest of the app.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/dialogs",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Dialog",
    // No variant axis. Dialog is one treatment; its shape comes from width,
    // which is a layout concern rather than a variant.
    variants: [],
    // M3's row "dialogs (modal)" rests at level 3. The full-screen dialog is a
    // different row at level 0, and `Dialog` here is the modal form.
    elevation: 3,
  },
  parts: [
    "Dialog",
    "DialogRoot",
    "DialogTrigger",
    "DialogContent",
    "DialogTitle",
    "DialogDescription",
    "DialogClose",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Escape",
      action: "Closes the dialog (cancel event); focus returns to the trigger.",
    },
    {
      key: "Tab / Shift+Tab",
      action: "Trapped inside the modal dialog; the page behind is inert.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Width is `--sys-shape-corner-medium`-shaped and capped so it never spans the viewport; override the width with `className` on `DialogContent`.",
      "The surface, outline and elevation all come from system roles, so a theme moves the dialog with everything else.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. A full-screen dialog is a different surface with a different resting elevation, not a size of this one.",
      "There is no `dismissible` prop. Backdrop and Escape behaviour come from the primitive and are not tunable per dialog.",
      "Focus order inside the dialog is document order. There is no prop to move initial focus off the first control.",
    ],
  },
  api: [
    {
      name: "open",
      for: ["DialogRoot"],
      type: "boolean",
      note: "Controlled open state on `DialogRoot`. Omit it for uncontrolled.",
    },
    {
      name: "onOpenChange",
      for: ["DialogRoot"],
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and backdrop clicks.",
    },
    {
      name: "className",
      for: [
        "DialogTrigger",
        "DialogContent",
        "DialogTitle",
        "DialogDescription",
        "DialogClose",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "defaultOpen",
      for: ["DialogRoot"],
      type: "boolean | undefined",
      note: "Whether the dialog starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "modal",
      for: ["DialogRoot", "DialogContent"],
      type: 'boolean | "trap-focus" | undefined',
      note: "Two roles, one name. On the root it decides real modality: `true` traps focus, locks scroll and blocks outside pointer input; `false` leaves the document usable; `trap-focus` traps focus only. On the content it decides what assistive tech hears — keep the two in step, or a non-modal dialog announces itself as modal.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["DialogRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "disablePointerDismissal",
      for: ["DialogRoot"],
      type: "boolean | undefined",
      note: "Whether outside presses stop dismissing the dialog. On a non-modal dialog it also keeps focus moving outside from closing it.",
    },
    {
      name: "actionsRef",
      for: ["DialogRoot"],
      type: "RefObject<DialogRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the dialog; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "handle",
      for: ["DialogRoot", "DialogTrigger"],
      type: "DialogHandle<unknown> | undefined",
      note: "Associates the dialog with a trigger: create one with `Dialog.createHandle()`, set on an external trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "children",
      for: ["DialogRoot"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "The dialog's content — or a render function receiving the active trigger's payload.",
    },
    {
      name: "triggerId",
      for: ["DialogRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the dialog answers to. For controlled dialogs (`open` set); uncontrolled dialogs need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["DialogRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the dialog answers to, for an initially open dialog (`defaultOpen` set).",
    },
    {
      name: "payload",
      for: ["DialogTrigger"],
      type: "unknown",
      note: "Data handed to the dialog when this trigger opens it, read by a payload render function in the root's children.",
    },
    {
      name: "id",
      for: ["DialogTrigger"],
      type: "string | undefined",
      note: "Id of the trigger, forwarded to the rendered element and naming the active trigger for controlled dialogs (with the root's `triggerId` prop).",
    },
    {
      name: "nativeButton",
      for: ["DialogTrigger", "DialogClose"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "initialFocus",
      for: ["DialogContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the dialog opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["DialogContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the dialog closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "testID",
      for: ["DialogContent"],
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the popup. Opt-in only — no default. See `parity/testid-contract.md`.",
    },
    {
      name: "style",
      for: [
        "DialogTrigger",
        "DialogContent",
        "DialogTitle",
        "DialogDescription",
        "DialogClose",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `DialogTriggerState` on the trigger, `DialogPopupState` on the surface, `DialogTitleState` on the title, `DialogDescriptionState` on the description, `DialogCloseState` on the close control.",
    },
    {
      name: "render",
      for: [
        "DialogTrigger",
        "DialogContent",
        "DialogTitle",
        "DialogDescription",
        "DialogClose",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or close control when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    'The dialog surface sets `role="dialog"` and `aria-modal="true"`. The modal marker is set by kern rather than left to the primitive, because a modal surface that does not announce itself as modal is a trap to a screen reader.',
    "`DialogTitle` becomes the accessible name; `DialogDescription` becomes the description.",
    "Focus is trapped inside the dialog while it is open and the rest of the page is marked inert.",
    "Escape closes the dialog and focus returns to the element that opened it.",
  ],
};
