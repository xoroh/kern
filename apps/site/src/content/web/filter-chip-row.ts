import type { ComponentDoc } from "../types";

export const filterChipRow: ComponentDoc = {
  slug: "filter-chip-row",
  name: "Filter chip row",
  oneLiner:
    "The filter chip row is a horizontal row of multi-select toggles — press once to apply a filter, press again to remove it.",
  features:
    "Reach for a filter chip row when the reader is narrowing a set and should SEE the active filters as they work: tags, facets, quick categories. The row is a group and each chip is a real toggle carrying `aria-pressed` — and multi-select is the contract, so a second press REMOVES the value rather than being ignored. A filter that cannot be switched off is not a toggle. The selection is controllable from outside (the same controlled-uncontrolled pair the native row uses) and the row scrolls horizontally rather than wrapping, so a filter set does not eat the screen's height.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "FilterChipRow",
    variants: [],
    // No elevation token on the row, and no row keyed under this slug in
    // m3-elevation.ts (M3's chips row is keyed `chip`, level 0) — so nothing
    // is asserted either way, and the strip says what the component ships.
    elevation: "surface",
  },
  parts: ["FilterChipRow"],
  customization: {
    supported: [
      "`options` is data: `{ value, label }` per chip — value is the identity, label is what is read.",
      "`value` / `defaultValue` / `onValueChange` are the controlled-uncontrolled pair for the selected SET.",
      "`label` names the group; `className` is merged after the row's own classes.",
    ],
    notSupported: [
      "No single-select mode. A one-of-N choice is a `SegmentedButton`; this row is a set of independent toggles.",
      "Chips are label-only — no icons, no avatars, no remove affordance. A chip with a trailing remove is an input chip composition.",
      "No wrapping and no overflow menu: the row scrolls horizontally when the filters exceed the width.",
    ],
  },
  api: [
    {
      name: "options",
      type: "readonly FilterChipOption[]",
      required: true,
      note: "The chips: `{ value, label }`. The value is the identity reported to `onValueChange`; the label is the chip's name.",
    },
    {
      name: "value",
      type: "readonly string[]",
      note: "Controlled selection — the set of selected VALUES. Multi-select: pressing a selected chip's toggle removes it.",
    },
    {
      name: "defaultValue",
      type: "readonly string[]",
      default: "[]",
      note: "Uncontrolled starting selection. Omit `value` to let the row own the set.",
    },
    {
      name: "onValueChange",
      type: "(value: readonly string[]) => void",
      note: "Fires with the WHOLE next set on every toggle — the same shape as the native row's contract.",
    },
    {
      name: "label",
      type: "string",
      default: '"Filters"',
      note: "The group's accessible name.",
    },
    {
      name: "className",
      type: "string",
      note: "Passed through and merged after the row's own classes.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-filter-chip-row"',
      note: "Test hook for the row.",
    },
  ],
  aria: [
    "The row is a `group` named by `label`; each chip is a toggle button carrying `aria-pressed` — the selection is announced, not just tinted.",
    "The second press removes the value: `aria-pressed` goes false again, which is what makes the row a set of toggles rather than a row of one-way buttons.",
    "Selected and unselected chips differ by fill AND outline treatment; the pressed state is the semantics, so the row works for a reader who cannot see either.",
  ],
};
