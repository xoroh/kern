import type { ComponentDoc } from "../types";

export const toolbar: ComponentDoc = {
  slug: "toolbar",
  name: "Toolbar",
  oneLiner: "Toolbars hold the controls that act on the content below them.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/toolbars",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Toolbar",
    // No variant axis. One treatment.
    variants: [],
    // Expressive floating toolbar defaults to level3; docked is flat.
    // MDC Android floatingtoolbar/res/values/tokens.xml confirms the L3 token.
    elevation: 3,
  },
  parts: [
    "Toolbar",
    "ToolbarRoot",
    "ToolbarGroup",
    "ToolbarButton",
    "ToolbarSeparator",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Arrow keys",
      action: "Moves between buttons with roving focus.",
    },
    {
      key: "Tab / Shift+Tab",
      action: "The toolbar is one stop; arrows move inside it.",
    },
    {
      key: "Enter / Space",
      action:
        "Runs the focused toolbar button. The buttons are real buttons, so the press is the browser's own.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after that part's own classes.",
      "The floating bar is a rounded tonal track at level3; the docked bar is flat — see Deviations for the track colour.",
      "Groups and separators let the bar be divided without new component types.",
    ],
    notSupported: [
      "There is no `orientation` prop. The bar is horizontal; a vertical toolbar is the root's `className` and its own layout.",
      "There is no `variant`, `size` or `density` prop. One height, one treatment.",
      "There is no `label` prop on the bar. The toolbar's accessible name is the root's `aria-label`, because the bar is a landmark and landmarks need names.",
    ],
  },
  api: [
    {
      name: "aria-label",
      type: "string",
      note: "The accessible name of the toolbar landmark. With two toolbars on a page, this is what distinguishes them — without it, the landmark list has two identical entries.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["ToolbarRoot", "ToolbarGroup", "ToolbarButton"],
      type: "boolean",
      note: "On a control it is skipped in the focus order rather than left as a dead stop. Set on the bar or a group to disable everything inside.",
    },
    {
      name: "orientation",
      for: ["ToolbarRoot", "ToolbarSeparator"],
      type: '"horizontal" | "vertical"',
      note: "On the root: which way the controls are laid out and which arrow keys move between them. The visual layout is still `className`. On a separator: the divider’s direction.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ToolbarRootState` on the bar, `ToolbarGroupState` on a group, `ToolbarButtonState` (disabled, focused) on a control, `SeparatorState` on a divider.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on a control when the replacement is a native `<button>`.",
    },
    {
      name: "loopFocus",
      for: ["ToolbarRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last control back to the first. Disabled stops at the ends.",
    },
    {
      name: "nativeButton",
      for: ["ToolbarButton"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "focusableWhenDisabled",
      for: ["ToolbarButton"],
      type: "boolean | undefined",
      note: "Whether a disabled control stays focusable. For controls that must remain discoverable while unavailable.",
    },
  ],
  aria: [
    "The root is a toolbar landmark, so it appears in a screen reader's landmark list and can be jumped to directly.",
    "It needs an `aria-label` — a landmark with no name is indistinguishable from every other unnamed landmark on the page.",
    "Arrow keys move between the controls and focus is managed as a group, which is the WAI-ARIA toolbar pattern and the reason to use this rather than a plain row of buttons.",
    "Separators are decorative; the grouping is what a screen reader hears.",
  ],
};
