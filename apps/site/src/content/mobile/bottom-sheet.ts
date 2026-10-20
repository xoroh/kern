import type { ComponentDoc } from "../types";

export const bottomSheet: ComponentDoc = {
  slug: "bottom-sheet",
  name: "Bottom sheet",
  oneLiner:
    "Bottom sheets slide up from the bottom edge to hold a short, self-contained step.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Single-renderer: the bottom sheet IS the compact-screen surface. The web
    // `Sheet` slides from the side and is a different component; there is no
    // export to name as a counterpart.
    nativePeer: "none",
    variants: ["size: medium · large"],
    // Level 0: the native modal sheets carry no elevation token (flat;
    // web rests at level 1). Whether flat-native is deliberate or missing
    // elevation is an open owner question — this claims the shipped value.
    elevation: 0,
  },
  parts: ["BottomSheet"],
  keyboard: [
    {
      key: "Android hardware back",
      action:
        "Dismisses the sheet. The drag handle is the visual affordance; back is the system's, and both reach the same dismissal.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        'The scrim reads as a button named "Dismiss <title>" and the close control as "Close <title>" — the close control is rendered when the sheet is given a dismissal handler; double-tap on either dismisses the sheet.',
    },
  ],
  customization: {
    supported: [
      "`size` picks between the two sheet heights, so a short decision and a longer one do not share a box.",
      "`handle` can be hidden for sheets that are NOT dismissible by drag — a drag handle on something that will not drag is a promise the interface does not keep.",
      "`actions` is a slot for the action row under the content.",
    ],
    notSupported: [
      "There is no `side` or `anchor` prop. The sheet is bottom-anchored by construction; a side panel is a different surface.",
      "There is no `dismissible` boolean. `handle` controls the visual affordance and `onDismiss` is the callback — one behaviour, two honest knobs, rather than a flag that hides the callback.",
      "The heights are `size`, not a number. A sheet that could be any height would stop being a sheet.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required — the sheet is always controlled, so the host owns whether it is showing.",
    },
    {
      name: "title",
      type: "string",
      note: "Required. It names the sheet and is what makes the surface announceable rather than a shape that appeared.",
    },
    {
      name: "size",
      type: '"medium" | "large"',
      default: '"medium"',
      note: "Two fixed heights, so a short decision and a longer one do not share a box.",
    },
    {
      name: "actions",
      type: "ReactNode",
      note: "The action row under the content. Material 3 caps sheets at TWO actions — a third means the decision is bigger than a sheet.",
    },
    {
      name: "handle",
      type: "boolean",
      note: "Shows the drag handle. Hide it for sheets that are not dismissible by drag, so the handle never promises a gesture the sheet will not honour.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the sheet goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles — this is the native renderer's surface, not a web `className`.",
    },
  ],
  aria: [
    "The sheet is a modal surface: it names itself with `title`, so a screen reader says what has come up rather than that something has.",
    "It is bottom-anchored so the actions sit in thumb reach, which is an accessibility decision as much as a comfort one.",
    "`handle` is a gesture affordance. Where the sheet cannot be dragged away it should be hidden, so the control never lies about what it does.",
  ],
};
