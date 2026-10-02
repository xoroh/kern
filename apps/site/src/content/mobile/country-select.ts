import type { ComponentDoc } from "../types";

export const countrySelect: ComponentDoc = {
  slug: "country-select",
  name: "Country select",
  oneLiner:
    "Country selects choose a country from data you supply — kern ships no country list.",
  features:
    "Reach for a country select when the answer is a country and you want the shape of the choice done for you. The design decision to know is what it does NOT do: kern ships NO country dataset. The options arrive as a prop, so the host stays the source of truth — which is what keeps the list yours to curate, localise, restrict or keep current, rather than frozen inside a component library. The `code` is an ISO 3166-1 alpha-2 or alpha-3 identifier and is deliberately OPAQUE to the component: it passes it back and never interprets it.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "CountrySelect",
    variants: [],
    elevation: 2,
  },
  parts: ["CountrySelect"],
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table names no select. It tabulates \"menu\" at level 2, and kern maps that row to `navigation-menu`, so there is no spec row a country select could conform to.",
      kern: "The country list rests at elevation level 2.",
      why: "The open list behaves as an overlay above the page and needs the same lift a menu has, but claiming the menu row would assert that M3 said something about selects it never said. Registered as K6 in the elevation inventory so the level is a recorded decision rather than a value in a stylesheet.",
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
