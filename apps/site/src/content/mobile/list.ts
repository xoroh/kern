import type { ComponentDoc } from "../types";

export const list: ComponentDoc = {
  slug: "list",
  name: "List",
  oneLiner:
    "List renders rows as a list with ten layout presets over one row model.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Canonical M3 spec page for this family.
    specUrl: "https://m3.material.io/components/lists/overview",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "List",
    variants: [
      "variant: one-line · two-line · avatar · icon · thumbnail · navigational · selectable · expandable · control · grouped",
      "density: compact · medium · expanded",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["List"],
  keyboard: [
    {
      key: "Press",
      action:
        "Selects, expands and activates rows — selectable rows pair with labelled checkboxes, expandable rows report expanded state on their disclosure control.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the rows in order; each reads its headline with selection and expansion state, and double-tap activates it.",
    },
  ],
  customization: {
    supported: [
      "`rows` are data — `id`, `headline`, optional supporting, leading and trailing nodes — so a queue, a booking list and a ticket list are one declaration each.",
      "`sections` switches to grouped rendering with headers and dividers; grouped data wins over `rows`.",
      "`renderRow` is the escape hatch for full control of one row's rendering.",
      "`emptyState` replaces the default empty block; `label` names the landmark.",
    ],
    notSupported: [
      "There is no `page` or `pageSize` prop. Pagination is the `paginateListRows`/`usePagination` adapters — the list stays presentational and the host slices.",
      "There is no built-in windowing. Long lists slice with the `virtualWindow` math, which is a pure helper on purpose.",
      "There is no `href` handling beyond the row's own `href`. Navigational rows navigate; action rows report through `onRowPress`.",
    ],
  },
  api: [
    {
      name: "rows",
      type: "NativeListRow[]",
    },
    {
      name: "sections",
      type: "NativeListSection[]",
    },
    {
      name: "variant",
      type: "NativeListVariant",
    },
    {
      name: "density",
      type: "NativeListDensity",
    },
    {
      name: "accessibilityLabel",
      type: "string",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
    {
      name: "selectedIds",
      type: "string[]",
    },
    {
      name: "defaultSelectedIds",
      type: "string[]",
    },
    {
      name: "onSelectedChange",
      type: "(ids: string[]) => void",
    },
    {
      name: "selectionMode",
      type: "NativeListSelectionMode",
    },
    {
      name: "expandedIds",
      type: "string[]",
    },
    {
      name: "defaultExpandedIds",
      type: "string[]",
    },
    {
      name: "onExpandedChange",
      type: "(ids: string[]) => void",
    },
    {
      name: "onRowPress",
      type: "(id: string) => void",
    },
    {
      name: "onHaptic",
      type: "(event: NativeListHapticEvent) => void",
      note: "Haptic injection: fired on select/expand/press (host wires expo-haptics).",
    },
    {
      name: "loading",
      type: "boolean",
    },
    {
      name: "loadingRows",
      type: "number",
    },
    {
      name: "emptyState",
      type: "ReactNode",
    },
  ],
  aria: [
    "Rows announce with their labels; selectable rows pair each item with a named checkbox, expandable rows report expanded state.",
    "Selection stays single or multiple per the mode, and expansion is reported on the row that owns it.",
    "Loading announces through the progress region; `accessibilityLabel` names the list.",
    "`onHaptic` is host-wired platform haptics on select, expand and press — Kern takes no native-module dependency, so feedback is the host's choice.",
  ],
};
