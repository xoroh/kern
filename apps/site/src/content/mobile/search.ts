import type { ComponentDoc } from "../types";

export const search: ComponentDoc = {
  slug: "search",
  name: "Search",
  oneLiner:
    "Search is the text field that reports every change and, separately, when to search.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory. The web `Search`
    // strips `onSubmit`/`onChange` in favour of `onSearch`/`onValueChange`.
    nativePeer: "Search",
    variants: [],
    elevation: "surface",
  },
  parts: ["Search"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "focused"],
  keyboard: [
    {
      key: "External keyboard",
      action:
        "The field takes native focus and the OS keyboard opens; entry and dismissal belong to the platform, `onSearch` carries the query to run.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The bar announces as search with its label; the clear control reads as a button and double-tap clears the query.",
    },
    {
      key: "Enter (external keyboard)",
      action:
        "Submits the query — the field's submit key is wired to `onSearch`, and the platform's search key is what sends it.",
    },
  ],
  customization: {
    supported: [
      "`label` names the field.",
      "`onValueChange` is the live change, `onSearch` is the query to run — two separate callbacks.",
      "`TextInputProps` pass through apart from the three this component owns.",
    ],
    notSupported: [
      "There is no `onSubmit`/`onChange`. They are omitted from the inherited props in favour of `onSearch`/`onValueChange` — the same renaming the web `Search` does.",
      "There is no `loading` or `results` prop. Search finds; what shows the results is yours.",
      "There is no `size` or `variant`.",
    ],
  },
  api: [
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires AS THE TEXT CHANGES. The live half — use it for filtering as you type.",
    },
    {
      name: "onSearch",
      type: "(value: string) => void",
      note: "Fires when the query should RUN. The submit half. Keeping it separate from `onValueChange` is what lets a live filter and a submit-on-enter UI be the same component.",
    },
    {
      name: "label",
      type: "string",
      note: "The field's name.",
    },
    {
      name: "value / defaultValue",
      type: "string",
      note: "The query. Controlled or uncontrolled. Note `value` and `onChangeText` are OMITTED from the inherited `TextInputProps` and redeclared — this component owns them and renames them.",
    },
    {
      name: "…TextInputProps",
      type: "Omit<TextInputProps, 'value' | 'onChangeText' | 'style'>",
      note: "Everything else the text field takes. Only those three are handled specially.",
    },
    {
      name: "style",
      type: "StyleProp<TextStyle>",
      note: "React Native text styles.",
    },
  ],
  aria: [
    "`label` names the field, and it is a text input underneath, so it announces as the search field it is.",
    "`onSearch` separating the run from the typing is what makes the behaviour predictable for everyone — a screen reader user submitting a query gets the same timing as anyone else.",
    "It finds things; it does not show them. Keeping results out of the component is what lets the same field serve a dropdown, a page and a panel.",
  ],
};
