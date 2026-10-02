import type { ComponentDoc } from "../types";

/**
 * `pageWindow` is NOT a component. It is a pure function exported from the
 * Pagination implementation, and this page documents its contract rather than
 * inventing a component anatomy it does not have.
 */
export const pageWindow: ComponentDoc = {
  slug: "page-window",
  name: "pageWindow",
  oneLiner:
    "pageWindow is a pure function that turns a page count and a current page into the list of page numbers and gaps to show.",
  features:
    "This is not a component and it renders nothing. It is the pagination window algorithm, exported as a named function so it can be tested directly — pure logic tested directly is both cheaper and clearer than asserting it through rendered output. Reach for it when you are building your own pager and want the same window behaviour kern's Pagination uses: short lists show every page, long ones keep the first two, a window around the current page and the last two, with a `gap` entry where pages were elided. The gaps carry a key and no number because they are decoration, not data.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only utility. The web pager does not export its window logic as a
    // named function, so there is no export to name as a counterpart.
    nativePeer: "none",
    variants: [],
    elevation: "none",
  },
  // Which exports this page documents. `parts` is ownership, not anatomy — so
  // the function is listed here while `anatomy` stays absent below.
  parts: ["pageWindow"],
  customization: {
    supported: [
      "It is a pure function — call it with the `current` and `count` you have and use the returned entries however your pager renders them.",
    ],
    notSupported: [
      "It does not render anything and takes no styling, so there is nothing here to customise visually.",
      "The window shape is fixed: every page at 7 or fewer, otherwise first two + a window around `current` + last two. It is not a prop.",
    ],
  },
  api: [
    {
      name: "current",
      type: "number",
      note: "The current page. The window is derived from it every call, so there is one source of truth for where the reader is.",
    },
    {
      name: "count",
      type: "number",
      note: "Total number of pages. At 7 or fewer every page is returned; above that the list is windowed.",
    },
    {
      name: "returns",
      type: "PaginationEntry[]",
      note: 'Each entry is `{ kind: "page", page }` or `{ kind: "gap", key }`. Gaps carry a stable key and NO number — they mark elision and hold no information.',
    },
  ],
  aria: [
    "Being pure logic, it produces no accessibility tree of its own.",
    'The contract that matters for consumers: a `gap` entry is decoration and must be hidden from assistive tech — kern\'s own Pagination marks it `accessibilityElementsHidden` with `importantForAccessibility="no-hide-descendants"`.',
    "The page buttons are the announcable items; the window is just which of them exist.",
  ],
};
