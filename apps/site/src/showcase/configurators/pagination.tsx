import { Pagination } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Pagination configurator — the twentieth Part-4 configurator (move #22),
 * first kern-owned navigation (custom window logic, no primitive under
 * it). Knobs are the shape axes: `count` (total pages — 5 renders every
 * page, 24 collapses the middle into ellipsis gaps), `defaultPage` (where
 * the window starts). No `siblingCount`/`boundaryCount` (the window is
 * fixed constants, not props), no `size`/`variant` — none exists to rule
 * out or to offer. The stage is the documented component whole — prev,
 * window, next — so the fence teaches it too. The stage remounts by key on
 * every knob so it cannot drift from the fence.
 *
 * Every knob pairing is in-range by construction (defaultPage 1 or 3
 * against count 5 or 24): the root clamps out-of-range pages, but the
 * knobs never ask it to — clamping is pinned by the edge test, not the
 * stage.
 */
function countOf(v: ConfigValues): number {
  return v.count === "24" ? 24 : 5;
}

function defaultPageOf(v: ConfigValues): number {
  return v.defaultPage === "3" ? 3 : 1;
}

export const PAGINATION_CONFIGURATOR: ConfiguratorSpec = {
  id: "pagination-knobs",
  title: "Configure the pagination",
  description:
    "Total pages and starting page. Past seven pages the middle collapses into ellipsis gaps around the current page, the first two, and the last two — that window is the behaviour, not a bug. The knobs describe the next mount (the stage remounts by key): paging the live control does not flip them back, so a paged stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "count",
      label: "Page count",
      options: ["5", "24"],
      default: "5",
    },
    {
      kind: "select",
      name: "defaultPage",
      label: "Starting page",
      options: ["1", "3"],
      default: "1",
    },
  ],
  render: (v) => (
    <Pagination
      key={`${countOf(v)}-${defaultPageOf(v)}`}
      count={countOf(v)}
      defaultPage={defaultPageOf(v)}
      aria-label="Search results"
    />
  ),
  code: (v) =>
    `<Pagination count={${countOf(v)}} defaultPage={${defaultPageOf(v)}} aria-label="Search results" />`,
};
