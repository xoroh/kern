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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      note: "Stable identity: section keys + the screen's active-section value.",
    },
    {
      name: "title",
      type: "ReactNode",
      required: true,
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "rows",
      type: "readonly KernSettingsRowProps[]",
      required: true,
    },
    {
      name: "density",
      type: '"compact" | "medium"',
      note: "Row density for the section's rows.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "The section is labelled by its title, so the group announces as a named unit rather than a run of rows.",
    "`description` carries the section's explanatory line beneath the title.",
    "`id` is the stable identity — section keys and the screen's active-section value agree on it.",
  ],
};
