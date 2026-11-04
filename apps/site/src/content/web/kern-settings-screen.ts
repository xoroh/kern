import type { ComponentDoc } from "../types";

export const kernSettingsScreen: ComponentDoc = {
  slug: "kern-settings-screen",
  name: "Kern settings screen",
  oneLiner:
    "Kern settings screen is the settings page block over section presets with sidebar or tab layout.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "KernSettingsScreen",
    variants: ["layout: sidebar · tabs"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernSettingsScreen"],
  keyboard: [
    {
      key: "Arrow keys",
      action:
        "In the `tabs` layout the sections keep the vertical tab strip's keyboard — arrows move, Home and End jump, selection follows focus.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates rows through each row's own control; the screen adds no key handling of its own.",
    },
  ],
  customization: {
    supported: [
      "`sections` are `KernSettingsSectionDef` data — including the profile, security, preference, notification and auto-claim presets — so a whole settings page is one declaration.",
      "`layout` picks `sidebar` for full pages and `tabs` for dialogs and narrow widths.",
      "`settingDefToRow` builds rows from setting definitions, and `settingsRoutesToSections` delegates to the navigation adapter — one implementation each.",
    ],
    notSupported: [
      "There is no per-row state on the screen. Active-section switching is the screen's only state; rows own theirs.",
      "There is no third layout. Sidebar and tabs cover full pages and dialogs; anything else is a custom composition.",
    ],
  },
  api: [
    {
      name: "sections",
      type: "readonly KernSettingsSectionDef[]",
      required: true,
    },
    {
      name: "value",
      type: "string | undefined",
      note: "Controlled active section id.",
    },
    {
      name: "defaultValue",
      type: "string | undefined",
    },
    {
      name: "onValueChange",
      type: "((id: string) => void) | undefined",
    },
    {
      name: "layout",
      type: '"sidebar" | "tabs"',
      note: "`sidebar` (default): full page — KernNavigation `sidebar-pane` with the section rows in the detail pane. `tabs`: KernTabs vertical pills beside the rows — the CMP-0596 dialog-tabs pattern for dialogs and narrow widths. Never both (one section list per screen).",
    },
    {
      name: "header",
      type: "ReactNode",
    },
    {
      name: "footer",
      type: "ReactNode",
    },
    {
      name: "label",
      type: "string | undefined",
    },
    {
      name: "density",
      type: '"compact" | "medium"',
      note: "Row density for the screen's sections.",
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
    "`value`/`defaultValue`/`onValueChange` carry the canonical active section, so the painted section and the announced one never disagree.",
    "The `sidebar` layout pairs the navigation sidebar with a detail pane carrying the active section's rows.",
    "The `tabs` layout renders the dialog-tabs pattern for dialogs and narrow widths.",
  ],
};
