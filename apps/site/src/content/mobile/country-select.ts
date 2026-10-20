import type { ComponentDoc } from "../types";

export const countrySelect: ComponentDoc = {
  slug: "country-select",
  name: "Country select",
  oneLiner:
    "Country selects choose a country from data you supply — kern ships no country list.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "CountrySelect",
    variants: [],
    elevation: 2,
  },
  parts: ["CountrySelect"],
  // The native country select is a SINGLE control, not a list you browse: it
  // exposes itself as a combobox carrying the chosen country, and one press
  // takes the first available country. That is the shipped behaviour, so the
  // contract says it rather than describing a list that does not exist.
  keyboard: [
    {
      key: "Enter / Space via external keyboard or switch control",
      action:
        "Takes the first available country in the list — the same press a touch makes.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        'The control reads as a combobox carrying the chosen country by name, or "Select country" while nothing is chosen; double-tap takes the first available country.',
    },
  ],
  customization: {
    supported: [
      "`options` are data — `code`, `label`, optional `dial`, optional `disabled`. Your list, your rules.",
      "`dial` carries the dialling code alongside the name when a phone context needs it.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is NO country dataset bundled. Kern ships no list, so nothing here goes stale on your behalf — and nothing arrives for free either.",
      "The `code` is opaque. The component does not parse, validate or interpret ISO 3166-1 values; it hands back what you gave it.",
      "There is no flag rendering. A label is a label.",
    ],
  },
  api: [
    {
      name: "options",
      type: "CountryOption[]",
      note: "`{ code, label, dial?, disabled? }`. The data is YOURS — kern ships no country dataset, so the host stays the source of truth and the list is yours to curate, localise or restrict.",
    },
    {
      name: "code",
      type: "string",
      note: "ISO 3166-1 alpha-2 or alpha-3 — and deliberately OPAQUE to the component. It is passed back unchanged and never parsed, so your identifier scheme cannot be second-guessed.",
    },
    {
      name: "dial",
      type: "string",
      note: "The dialling code, for contexts where a phone number is the point.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "It is a select underneath, so it announces as the single-choice control it is.",
    "Because the labels are yours, so is the announcement — which means localised names and your own terminology reach the screen reader unchanged.",
    "The `code` being opaque is an accessibility-adjacent guarantee too: what you put in is what comes out, so no transformation can quietly rename a country.",
  ],
};
