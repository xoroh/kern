import type { ComponentDoc } from "../types";

export const pagination: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  oneLiner:
    "Pagination moves through pages of content, with a windowed row and no wrapping at the ends.",
  features:
    "Reach for pagination when the content is a list too long to show and too structured to scroll: search results, a table, an archive. The page is 1-based and the row is a WINDOW — a short list shows every page, a long one keeps the first two, a window around the current page and the last two, with inert gaps where pages are elided. Prev and next clamp at the ends rather than wrapping, because a pager that jumps from the last page to the first is a different component from the one Material 3 describes. `accessibilityLabel` names the navigation landmark, which is what makes the row a place rather than a pile of numbers.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Pagination",
    variants: [],
    elevation: "surface",
  },
  parts: ["Pagination"],
  customization: {
    supported: [
      "`count` sets the total and `page`/`defaultPage`/`onPageChange` make it controlled or uncontrolled, 1-based.",
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
      name: "page / defaultPage",
      type: "number",
      note: "The current page, 1-BASED. `onPageChange` reports the next one. Values outside 1..count are clamped defensively, since a controlled host can hand back 0 or count+1.",
    },
    {
      name: "onPageChange",
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
