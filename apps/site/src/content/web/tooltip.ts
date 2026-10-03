import type { ComponentDoc } from "../types";

export const tooltip: ComponentDoc = {
  slug: "tooltip",
  name: "Tooltip",
  oneLiner:
    "Tooltips name or explain a control the moment someone hovers or focuses it.",
  features:
    "Reach for a tooltip to label an icon-only control, or to add one short line of context that is useful but not worth permanent space. It appears on hover and on keyboard focus, and it must be dismissible without precision pointing — if the content is only reachable by hovering, it is unreachable on touch. Never put an action inside a tooltip, and never put information there that is not available some other way. If the explanation is long enough to need paragraphs, it is a help panel, not a tooltip.",
  meta: {
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
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The popup is the inverse surface — `--md-sys-color-inverse-surface` on `--md-sys-color-inverse-on-surface` — so a tooltip reads as floating above content rather than sitting in it.",
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
      type: "boolean",
      note: "Controlled open state on `TooltipRoot`. Normally left uncontrolled — a tooltip is driven by hover and focus.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires on every open and close, including Escape.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
  ],
  aria: [
    "The trigger is described by the tooltip content, so the label is announced with the control rather than standing alone.",
    "The tooltip opens on keyboard focus as well as hover, so an icon-only control is labelled for keyboard users too.",
    "Escape dismisses it without moving focus, which is what lets someone clear a tooltip and stay where they are.",
    "The content is a description, not a live region: it is not announced when it appears on hover, only when the trigger receives focus.",
  ],
};
