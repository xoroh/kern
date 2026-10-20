import { Pagination } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Pagination examples — a window of pages, not a wall of them.
 *
 * `count` is the whole set; the component draws the window (first two, a
 * window around the current page, last two) and leaves a gap where a page
 * was left out. The current page carries `aria-current`, so which page is
 * showing is announced rather than only seen.
 */
export const PAGINATION_EXAMPLES: ExampleSpec[] = [
  {
    id: "pagination-window",
    title: "A window of pages, with gaps",
    description:
      "Every page is a real button, so moving through the set is possible from the keyboard alone. The ends are reached from the window like any other page.",
    render: () => (
      <Pagination count={24} defaultValue={12} aria-label="Pagination" />
    ),
    code: `<Pagination count={24} defaultValue={12} aria-label="Pagination" />`,
  },
];
