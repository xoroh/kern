import type { ComponentDoc } from "../types";

export const countrySelect: ComponentDoc = {
  slug: "country-select",
  name: "Country select",
  oneLiner:
    "Country selects pick a country from a list, showing its flag and dial code alongside its name.",
  features:
    "Reach for a country select when the answer is a country and the list is long enough to need one: a shipping address, a phone number's prefix, a locale preference. It is a select with the country's shape already accounted for — the flag, the name and the dial code all render from one option. Pass the names in the locale your interface is written in, because a list of countries in the wrong language is a list nobody can search. If the answer is a language rather than a country, those are not the same thing and should not share a list.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "CountrySelect",
    // No variant axis. One treatment; the state is open or closed.
    variants: [],
    // kern's own decision. M3's component elevation table names no select of
    // any kind — its "menu" row is taken by `navigation-menu`. The popup ships
    // `--md-sys-elevation-level2` and the choice is registered as K6.
    elevation: 2,
  },
  parts: [
    "CountrySelect",
    "CountrySelectRoot",
    "CountrySelectTrigger",
    "CountrySelectValue",
    "CountrySelectContent",
    "CountrySelectItem",
    "CountrySelectLabel",
  ],
  deviations: [
    {
      id: "K6",
      spec: 'M3\'s component elevation table names no select. It tabulates "menu" at level 2, and kern maps that row to `navigation-menu`, so there is no spec row a country select could conform to.',
      kern: "The country list rests at elevation level 2.",
      why: "The open list behaves as an overlay above the page and needs the same lift a menu has, but claiming the menu row would assert that M3 said something about selects it never said. Registered as K6 in the elevation inventory so the level is a recorded decision rather than a value in a stylesheet.",
    },
  ],
  anatomy: [
    {
      name: "CountrySelectRoot",
      role: "Owns the open state and the chosen country. Takes the countries as `options`.",
    },
    {
      name: "CountrySelectTrigger",
      role: "The closed control showing the chosen country. Opens the list.",
    },
    {
      name: "CountrySelectValue",
      role: "Renders the chosen country inside the trigger.",
    },
    {
      name: "CountrySelectContent",
      role: "The list surface. Scrollable and capped in height, since a country list is long by nature.",
    },
    {
      name: "CountrySelectItem",
      role: "One country: flag, name and dial code.",
    },
    {
      name: "CountrySelectLabel",
      role: "Names the field, or a run of countries.",
    },
    {
      name: "CountrySelect",
      role: "The namespace object: all of the parts above.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Countries are data — `code`, `name`, optional `dialCode`, optional `flag`, optional `disabled` — so the list is yours to localise.",
      "The flag slot is any node, so an emoji, an icon component or an image all work.",
    ],
    notSupported: [
      "There is no `locale` prop. Names come from the `options` you pass, which is also how the list gets localised — the component does not translate.",
      "There is no `searchable` prop on this component. A country list you can type to filter is `Autocomplete` or `Command`, not this.",
      "There is no `dialCodePrefix` prop. `dialCode` is deliberately stored WITHOUT the leading `+`, so the caller formats it — see the API row.",
    ],
  },
  api: [
    {
      name: "options",
      type: "readonly CountryOption[]",
      note: "The countries, on `CountrySelectRoot`. Each carries `code`, `name`, and optionally `dialCode`, `flag` and `disabled`. The Select's `items` prop is omitted — this replaces it.",
    },
    {
      name: "onCountryChange",
      type: "(country: CountryOption | null) => void",
      note: "Fires with the whole chosen country, not just its code — so a dial code and a flag are available without a second lookup. Nullable: nothing chosen is `null`.",
    },
    {
      name: "code",
      type: "string",
      note: "On an option: the stable key, conventionally the ISO 3166-1 alpha-2 code. It is what you store; the name is what you show.",
    },
    {
      name: "dialCode",
      type: "string",
      note: "On an option: the dial code WITHOUT the leading `+`. Storing it unprefixed is deliberate — the caller decides how to render it, so a formatted number is not baked into the data.",
    },
    {
      name: "flag",
      type: "ReactNode",
      note: "On an option: the leading adornment. A flag emoji, an icon, or any node — the component does not own a flag set.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an option, or on the whole select.",
    },
  ],
  aria: [
    "The trigger is a combobox with `aria-expanded`, and the list is a listbox of options — the WAI-ARIA select pattern.",
    "Each option reads as its country name; the flag is decoration and the dial code is secondary text, so the name is what is announced.",
    "Up/Down move through the list and Enter chooses; typing jumps to matching countries.",
    "The chosen country is exposed on the trigger, so the current selection is announced when focus lands on it.",
  ],
};
