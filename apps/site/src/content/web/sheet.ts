import type { ComponentDoc } from "../types";

export const sheet: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  oneLiner:
    "Sheets slide in from the side to hold a focused task beside the content behind them.",
  features:
    "Reach for a sheet when someone needs to work on one thing without losing the place they came from: editing a record's details beside its list, filtering results while keeping them in view. It is modal — the scrim and the focus trap mean the rest of the page waits — so keep the task short and give it a title that says what is being changed. It enters from the right by default; the left is for a document outline or a tree, where the edge matters. If the task belongs to a compact screen or should replace the view rather than accompany it, that is a dialog or a route.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Sheet",
    // No variant axis. The `side` a sheet enters from is placement, not
    // treatment.
    variants: [],
    // M3 tabulates sheets three ways — "bottom sheet (modal)" and "side sheet
    // (modal)" at level 1, "side sheet (docked)" at level 0 — so `variants`
    // permits [0, 1]. kern's sheet ships `--sys-elevation-level1`, the
    // modal level, which is what this page claims.
    elevation: 1,
  },
  parts: [
    "Sheet",
    "SheetRoot",
    "SheetTrigger",
    "SheetContent",
    "SheetTitle",
    "SheetDescription",
    "SheetClose",
  ],
  anatomy: [
    {
      name: "SheetRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    { name: "SheetTrigger", role: "The element that opens the sheet." },
    {
      name: "SheetContent",
      role: "The panel. Portals to the end of the document, renders the scrim and traps focus. Slides in from `side`.",
    },
    { name: "SheetTitle", role: "Names the sheet — what is being worked on." },
    {
      name: "SheetDescription",
      role: "Supporting line under the title, wired to `aria-describedby`.",
    },
    { name: "SheetClose", role: "Closes the sheet from inside it." },
    { name: "Sheet", role: "The namespace object: all of the parts above." },
  ],
  keyboard: [
    {
      key: "Escape",
      action: "Closes the surface; focus returns to the trigger.",
    },
    {
      key: "Tab / Shift+Tab",
      action: "Trapped inside while modal; the page behind is inert.",
    },
  ],
  usage: {
    do: [
      "Use modal sheets for tasks that need focus — the scrim marks the interruption.",
      "Let content scroll inside with titles pinned where applicable.",
    ],
    dont: ["Don't trap focus without announcing modality."],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.sheet.container",
      value: "surface-container-low, 28px leading edge, level3",
    },
    {
      element: "Scrim",
      state: "resting",
      token: "sys.color.scrim",
      value: "32%",
    },
  ],
  faq: [
    {
      q: "Bottom drawer or side sheet?",
      a: "Bottom drawers rise for compact flows; side sheets dock for persistent panels.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "`side` on `SheetContent` chooses which edge the panel enters from — `left` or `right`.",
      "The panel is full height and scrolls its own content, so a long form inside a sheet keeps working rather than growing past the viewport.",
    ],
    notSupported: [
      "There is no `size` or `width` prop. The panel width is capped so a sheet never covers the whole screen — override it with `className` if a wider one is genuinely needed.",
      "There is no `dismissible` prop. Scrim and Escape behaviour come from the primitive and are not tunable per sheet.",
      'There is no `side="top"` or `"bottom"`. A bottom-anchored panel is a different surface with a different M3 row.',
    ],
  },
  api: [
    {
      name: "side",
      for: ["SheetContent"],
      type: '"left" | "right"',
      default: '"right"',
      note: "On `SheetContent`: which edge the panel enters from. Placement, not a variant.",
    },
    {
      name: "open",
      for: ["SheetRoot"],
      type: "boolean",
      note: "Controlled open state on `SheetRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      for: ["SheetRoot"],
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and scrim clicks.",
    },
    {
      name: "className",
      for: [
        "SheetTrigger",
        "SheetContent",
        "SheetTitle",
        "SheetDescription",
        "SheetClose",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "defaultOpen",
      for: ["SheetRoot"],
      type: "boolean | undefined",
      note: "Whether the sheet starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "modal",
      for: ["SheetRoot", "SheetContent"],
      type: 'boolean | "trap-focus" | undefined',
      note: "Two roles, one name. On the root it decides real modality: `true` traps focus, locks scroll and blocks outside pointer input; `false` leaves the document usable; `trap-focus` traps focus only. On the content it decides what assistive tech hears — keep the two in step, or a non-modal sheet announces itself as modal.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["SheetRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "disablePointerDismissal",
      for: ["SheetRoot"],
      type: "boolean | undefined",
      note: "Whether outside presses stop dismissing the sheet. On a non-modal sheet it also keeps focus moving outside from closing it.",
    },
    {
      name: "actionsRef",
      for: ["SheetRoot"],
      type: "RefObject<DialogRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the sheet; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "handle",
      for: ["SheetRoot", "SheetTrigger"],
      type: "DialogHandle<unknown> | undefined",
      note: "Associates the sheet with a trigger: set on an external trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "children",
      for: ["SheetRoot"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "The sheet's content — or a render function receiving the active trigger's payload.",
    },
    {
      name: "triggerId",
      for: ["SheetRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the sheet answers to. For controlled sheets (`open` set); uncontrolled sheets need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["SheetRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the sheet answers to, for an initially open sheet (`defaultOpen` set).",
    },
    {
      name: "payload",
      for: ["SheetTrigger"],
      type: "unknown",
      note: "Data handed to the sheet when this trigger opens it, read by a payload render function in the root's children.",
    },
    {
      name: "id",
      for: ["SheetTrigger"],
      type: "string | undefined",
      note: "Id of the trigger, forwarded to the rendered element and naming the active trigger for controlled sheets (with the root's `triggerId` prop).",
    },
    {
      name: "nativeButton",
      for: ["SheetTrigger", "SheetClose"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "initialFocus",
      for: ["SheetContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the sheet opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["SheetContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the sheet closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "style",
      for: [
        "SheetTrigger",
        "SheetContent",
        "SheetTitle",
        "SheetDescription",
        "SheetClose",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `DialogTriggerState` on the trigger, `DialogPopupState` on the surface, `DialogTitleState` on the title, `DialogDescriptionState` on the description, `DialogCloseState` on the close control.",
    },
    {
      name: "render",
      for: [
        "SheetTrigger",
        "SheetContent",
        "SheetTitle",
        "SheetDescription",
        "SheetClose",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or close control when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    'The panel sets `role="dialog"` and `aria-modal`, because a sheet inerts the page behind it and must say so.',
    "`SheetTitle` becomes the accessible name and `SheetDescription` the description.",
    "Focus is trapped inside the sheet while it is open and returns to the trigger when it closes.",
    "Escape dismisses it, and the scrim is clickable to dismiss — both reach `onOpenChange`, so a host keeps one state variable.",
  ],
};
