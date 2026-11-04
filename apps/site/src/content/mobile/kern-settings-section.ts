import type { ComponentDoc } from "../types";

export const kernSettingsSection: ComponentDoc = {
  slug: "kern-settings-section",
  name: "Kern settings section",
  oneLiner:
    "Kern settings section groups rows under a titled, describable block.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernSettingsSection",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernSettingsSection"],
  customization: {
    supported: [
      "`id` and `title` are required: identity for the screen's switching, a name for the reader.",
      "Section presets are data — profile, security, preference and notification sections spread straight into screens.",
      "`rows` are the section's row definitions in order — the same data form the screen's `sections` share.",
    ],
    notSupported: [
      "There is no children composition. Rows arrive as the `rows` data prop; the section never takes row markup.",
      "There is no collapsible behaviour. Sections always show their rows; hiding is the screen layout's job.",
    ],
  },
  api: [
    {
      name: "id",
      type: "string",
      required: true,
      note: "Stable identity: section keys plus the screen's active-section value.",
    },
    {
      name: "title",
      type: "string",
      required: true,
      note: "Section heading. Labels the group for assistive technology.",
    },
    {
      name: "description",
      type: "string",
      note: "Supporting line beneath the title.",
    },
    {
      name: "rows",
      type: "readonly NativeKernSettingsRowProps[]",
      required: true,
      note: "The section's rows, in order.",
    },
    {
      name: "density",
      type: '"compact" | "medium"',
      note: "Row density for the section.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook for the section.",
    },
  ],
  aria: [
    "The title heads the group with the description beneath it, so the rows announce under a named heading.",
    "`id` is the stable identity — section keys agree on it.",
    "`density` sets the row density for the section's rows.",
  ],
};
