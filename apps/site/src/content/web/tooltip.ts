import type { ComponentDoc } from "../types";

export const tooltip: ComponentDoc = {
  slug: "tooltip",
  name: "Tooltip",
  oneLiner:
    "Tooltips name or explain a control the moment someone hovers or focuses it.",
  features:
    "Reach for a tooltip to label an icon-only control, or to add one short line of context that is useful but not worth permanent space. It appears on hover and on keyboard focus, and it must be dismissible without precision pointing — if the content is only reachable by hovering, it is unreachable on touch. Never put an action inside a tooltip, and never put information there that is not available some other way. If the explanation is long enough to need paragraphs, it is a help panel, not a tooltip.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/tooltips",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Tooltip",
    // No variant axis. A tooltip is one treatment; its only states are shown
    // and hidden.
    variants: [],
    // Plain tooltip; level 2 is the K11 kern choice sharing the rich
    // row's height. See Deviations.
    elevation: 2,
  },
  parts: [
    "Tooltip",
    "TooltipRoot",
    "TooltipTrigger",
    "TooltipContent",
    "TooltipProvider",
  ],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Focus opens the tooltip on the trigger — an icon-only control is labelled for keyboard users too.",
    },
    {
      key: "Escape",
      action: "Dismisses the open tooltip without moving focus.",
    },
  ],
  anatomy: [
    {
      name: "TooltipProvider",
      role: "Shares open/close timing across a group of tooltips, so one does not fire while another is still fading. Wrap a group once.",
    },
    {
      name: "TooltipRoot",
      role: "Owns the open state for one tooltip. Accepts `open`/`onOpenChange` to control it.",
    },
    {
      name: "TooltipTrigger",
      role: "The control the tooltip describes. Hover and focus on it open the tooltip.",
    },
    {
      name: "TooltipContent",
      role: "The label itself. Portals to the end of the document and positions itself against the trigger.",
    },
  ],
  usage: {
    do: [
      "Name icon-only controls on hover and focus.",
      "Keep text to a few words.",
    ],
    dont: ["Don't duplicate visible labels — tooltips name the unnamed."],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.tooltip.container",
      value: "inverse-surface, 4px, level2",
    },
  ],
  faq: [
    {
      q: "Tooltip or label?",
      a: "Visible labels win; tooltips cover icon-only and truncated cases.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The popup is the inverse surface — `--sys-color-inverse-surface` on `--sys-color-inverse-on-surface` — so a tooltip reads as floating above content rather than sitting in it.",
      "Positioning comes from the primitive's positioner; the offset from the trigger is fixed.",
    ],
    notSupported: [
      "There is no `placement` or `side` prop on `TooltipContent` — it is positioned for you. Changing where it sits means styling the positioner, which is not exposed as a slot.",
      "There is no `variant`, `tone` or `size` prop. A tooltip is one treatment.",
      "There is no `arrow` prop. The pointer toward the trigger is not part of this component.",
    ],
  },
  deviations: [
    {
      id: "K11",
      spec: "M3's component elevation table tabulates only the RICH tooltip at level 2; it names no plain tooltip.",
      kern: "The (plain) tooltip popup rests at elevation level 2.",
      why: "review-m3 ruled the plain-tooltip level a kern choice sharing the rich row's height, not a transcription of M3 (K11); the citation is the registry, not the spec row.",
    },
  ],
  api: [
    {
      name: "open",
      for: ["TooltipRoot"],
      type: "boolean",
      note: "Controlled open state on `TooltipRoot`. Normally left uncontrolled — a tooltip is driven by hover and focus.",
    },
    {
      name: "onOpenChange",
      for: ["TooltipRoot"],
      type: "(open: boolean) => void",
      note: "Fires on every open and close, including Escape.",
    },
    {
      name: "className",
      for: ["TooltipTrigger", "TooltipContent"],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "defaultOpen",
      for: ["TooltipRoot"],
      type: "boolean | undefined",
      note: "Whether the tooltip starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["TooltipRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "disableHoverablePopup",
      for: ["TooltipRoot"],
      type: "boolean | undefined",
      note: "Whether hovering the tooltip itself closes it. Disable for plain hints; keep it hoverable when the content carries links or copyable text.",
    },
    {
      name: "trackCursorAxis",
      for: ["TooltipRoot"],
      type: '"none" | "both" | "x" | "y" | undefined',
      note: "Which pointer axis the tooltip follows while open. `both` trails the cursor; `x` or `y` locks one axis; `none` anchors it.",
    },
    {
      name: "actionsRef",
      for: ["TooltipRoot"],
      type: "RefObject<TooltipRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the tooltip; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "disabled",
      for: ["TooltipRoot", "TooltipTrigger"],
      type: "boolean | undefined",
      note: "Two roles, one name. On the root it disables the whole tooltip; on a trigger it suppresses just that trigger — the tooltip will not open from it, though the trigger element itself is not disabled (pass `disabled` through `render` for that).",
    },
    {
      name: "handle",
      for: ["TooltipRoot", "TooltipTrigger"],
      type: "TooltipHandle<unknown> | undefined",
      note: "Associates the tooltip with a trigger: create one with `Tooltip.createHandle()`, set on an external trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "children",
      for: ["TooltipRoot", "TooltipProvider"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "What renders inside. On the root it is the tooltip's parts — or a render function receiving the active trigger's payload; on the provider it is the tooltips sharing one delay clock.",
    },
    {
      name: "triggerId",
      for: ["TooltipRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the tooltip answers to. For controlled tooltips (`open` set); uncontrolled tooltips need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["TooltipRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the tooltip answers to, for an initially open tooltip (`defaultOpen` set).",
    },
    {
      name: "payload",
      for: ["TooltipTrigger"],
      type: "unknown",
      note: "Data handed to the tooltip when this trigger opens it, read by a payload render function in the root's children.",
    },
    {
      name: "delay",
      for: ["TooltipTrigger", "TooltipProvider"],
      type: "number | undefined",
      note: "Milliseconds to wait before opening on hover. Set on the trigger for one tooltip; on the provider it clocks every tooltip inside.",
    },
    {
      name: "closeOnClick",
      for: ["TooltipTrigger"],
      type: "boolean | undefined",
      note: "Whether clicking the trigger closes the tooltip.",
    },
    {
      name: "closeDelay",
      for: ["TooltipTrigger", "TooltipProvider"],
      type: "number | undefined",
      note: "Milliseconds to wait before closing. Set on the trigger for one tooltip; on the provider it clocks every tooltip inside.",
    },
    {
      name: "timeout",
      for: ["TooltipProvider"],
      type: "number | undefined",
      note: "How long a closed tooltip keeps the next one instant: within this window after closing, another tooltip opens without its delay.",
    },
    {
      name: "style",
      for: ["TooltipTrigger", "TooltipContent"],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `TooltipTriggerState` on the trigger, `TooltipPopupState` on the bubble.",
    },
    {
      name: "render",
      for: ["TooltipTrigger", "TooltipContent"],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
  ],
  aria: [
    "The trigger is described by the tooltip content, so the label is announced with the control rather than standing alone.",
    "The tooltip opens on keyboard focus as well as hover, so an icon-only control is labelled for keyboard users too.",
    "Escape dismisses it without moving focus, which is what lets someone clear a tooltip and stay where they are.",
    "The content is a description, not a live region: it is not announced when it appears on hover, only when the trigger receives focus.",
  ],
};
