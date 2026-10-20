import type { ComponentDoc } from "../types";

export const snackbar: ComponentDoc = {
  slug: "snackbar",
  name: "Snackbar",
  oneLiner:
    "Snackbars confirm something happened, briefly, without interrupting what someone is doing.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/snackbar",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SnackbarProvider",
    // No variant axis. The inverse-surface treatment is the whole look.
    variants: [],
    // kern's own decision. M3's component elevation table does not name a
    // snackbar. The surface ships `--sys-elevation-level2` and the choice is
    // registered as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "Snackbar",
    "SnackbarProvider",
    "SnackbarViewport",
    "SnackbarList",
    "SnackbarRoot",
    "SnackbarTitle",
    "SnackbarDescription",
    "SnackbarAction",
    "SnackbarClose",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Escape",
      action: "Dismisses the snackbar when focusable.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused action or the close control. Both are real buttons, and the action's press is the caller's own handler.",
    },
    {
      key: "Tab / Shift+Tab",
      action: "Reaches the action button when present.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The inverse surface — `--sys-color-inverse-surface` on `--sys-color-inverse-on-surface` — is what makes it read as floating above the page rather than part of it.",
      "Round corners and height are system tokens, so a theme moves every snackbar at once.",
    ],
    notSupported: [
      "There is no `variant`, `tone` or `intent` prop. A snackbar is a neutral confirmation.",
      "There is no `position` prop on the snackbar itself. Where it appears is the viewport's business.",
      "There is no `duration` prop on the component. How long it stays is the queue's, not the surface's.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "className",
      for: [
        "SnackbarRoot",
        "SnackbarTitle",
        "SnackbarDescription",
        "SnackbarAction",
        "SnackbarClose",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "onClick",
      for: [
        "SnackbarRoot",
        "SnackbarTitle",
        "SnackbarDescription",
        "SnackbarAction",
        "SnackbarClose",
      ],
      type: "() => void",
      note: "On `SnackbarAction`: the single thing to do about it. One action only — a snackbar with a choice in it is a dialog in the wrong shape.",
    },
    {
      name: "disabled",
      for: ["SnackbarAction", "SnackbarClose"],
      type: "boolean",
      note: "On the action or the close control.",
    },
    {
      name: "children",
      for: ["SnackbarProvider"],
      type: "ReactNode",
      note: "The toasts, rendered through the viewport. The provider owns the queue; the viewport owns the placement.",
    },
    {
      name: "timeout",
      for: ["SnackbarProvider"],
      type: "number | undefined",
      note: "Default milliseconds before a toast dismisses itself. `0` keeps it until dismissed.",
    },
    {
      name: "limit",
      for: ["SnackbarProvider"],
      type: "number | undefined",
      note: "Maximum toasts on screen at once. Past the limit the oldest are marked `data-limited` rather than removed, so they can hide or animate out.",
    },
    {
      name: "toastManager",
      for: ["SnackbarProvider"],
      type: "ToastManager<any> | undefined",
      note: "The manager created by `createSnackbarManager()`. Hand it here so `show`/`dismiss` calls outside components reach the same queue.",
    },
    {
      name: "toast",
      for: ["SnackbarRoot"],
      type: "ToastRootToastObject<any>",
      note: "The toast object this row renders.",
    },
    {
      name: "swipeDirection",
      for: ["SnackbarRoot"],
      type: '"up" | "down" | "left" | "right" | ("up" | "down" | "left" | "right")[] | undefined',
      note: "Which swipe directions dismiss the toast.",
    },
    {
      name: "nativeButton",
      for: ["SnackbarAction", "SnackbarClose"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "style",
      for: [
        "SnackbarRoot",
        "SnackbarTitle",
        "SnackbarDescription",
        "SnackbarAction",
        "SnackbarClose",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ToastRootState` on a toast, `ToastTitleState`, `ToastDescriptionState`, `ToastActionState` and `ToastCloseState` on their rows.",
    },
    {
      name: "render",
      for: [
        "SnackbarRoot",
        "SnackbarTitle",
        "SnackbarDescription",
        "SnackbarAction",
        "SnackbarClose",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the action or close control when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The snackbar announces itself when it appears, so a confirmation reaches someone who is not looking at it.",
    "It does not move focus — that is what makes it non-interrupting. Content behind it stays operable.",
    "The action is a real button with its own name, reachable by keyboard while the snackbar is up.",
    "It dismisses on its own, so it must never carry information that is only available there.",
  ],
};
