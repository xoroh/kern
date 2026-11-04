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
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernSettingsScreen",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernSettingsScreen"],
  keyboard: [
    {
      key: "Press",
      action:
        "Operates rows through each row's own control; the screen adds no stops of its own.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves group by group through every section — the screen always shows all of them.",
    },
  ],
  customization: {
    supported: [
      "`sections` are `KernSettingsSectionDef` data — including the profile, security, preference, notification and auto-claim presets — so a whole settings page is one declaration.",
      "`density` sets the row density across the screen's sections.",
      "`settingDefToRow` builds rows from setting definitions — one implementation, shared with web.",
    ],
    notSupported: [
      "There is no `layout` prop and no active-section value. A phone shows every group; switching sections belongs to the host navigator.",
      "There is no per-row state on the screen. Rows own theirs; the screen renders the data it is given.",
    ],
  },
  api: [
    {
      name: "sections",
      type: "readonly KernSettingsSectionDef[]",
      required: true,
    },
    {
      name: "density",
      type: '"compact" | "medium"',
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "The native screen is always the grouped list — every section renders, and section switching is the host navigator's job.",
    "`sections` are the preset definitions, so the whole page is one declaration rendered complete.",
    "`density` sets the row density across the screen's sections.",
  ],
};
