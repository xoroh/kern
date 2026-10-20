import type { ComponentDoc } from "../types";

export const pagination: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  oneLiner:
    "Pagination moves through pages of content, with a windowed row and no wrapping at the ends.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Pagination",
    variants: [],
    elevation: "surface",
  },
  parts: ["Pagination"],
  // The contract, read off the component: the pager is a `navigation`
  // landmark of real pressables, and the gap markers are hidden from the
  // accessibility tree so they are never read as pages.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        'Activates a page. Every page is a real pressable labelled "Page N", and the current one reports its selected state.',
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Moves through the page buttons in order. The gaps between them are decoration and are hidden from the accessibility tree, so they are never announced as pages.",
    },
  ],
  customization: {
    supported: [
      "`count` sets the total and `value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled, 1-based.",
      "`accessibilityLabel` names the navigation landmark.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no wrapping at the ends. Prev and next are disabled there.",
      "There is no `siblings`/`boundaryCount` prop. The window shape is fixed — first two, a window around the current page, last two.",
      "There is no `size` or `variant`.",
    ],
  },
  api: [
    {
      name: "count",
      type: "number",
      note: "Total number of pages. Required.",
    },
    {
      name: "value / defaultValue",
      type: "number",
      note: "The current page, 1-BASED. `onValueChange` reports the next one. Values outside 1..count are clamped defensively, since a controlled host can hand back 0 or count+1.",
    },
    {
      name: "onValueChange",
      type: "(page: number) => void",
      note: "Reports the next page number rather than an event.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the NAVIGATION LANDMARK. That is what makes the row a place rather than a pile of numbers.",
    },
    {
      name: "pageWindow(current, count)",
      type: "(current: number, count: number) => PaginationEntry[]",
      note: "Exported pure function — the window algorithm. Short lists show every page; longer ones keep first two, a window around `current`, last two. Gaps are `{ kind: 'gap' }` and carry NO number. Documented in full under /docs/api rather than given a page.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    'It is `role="navigation"` — not `accessibilityRole`, which has no `navigation` member on React Native. Same class of silent failure as `meter` and `fieldset` if you reach for the other prop.',
    'RN has no `aria-current`, so the current page is carried by `accessibilityState.selected` — a deliberate platform substitution, recorded rather than papered over. A screen reader says "selected" where the web says "current page".',
    'Gaps are DECORATION: `accessibilityElementsHidden` with `importantForAccessibility="no-hide-descendants"`. A gap holds no information and must not be announced as an element.',
    "Prev and next clamp at the ends and are disabled there, so no page move is a surprise.",
  ],
};
