import type { ComponentDoc } from "../types";

export const search: ComponentDoc = {
  slug: "search",
  name: "Search",
  oneLiner:
    "Search is the text field that reports every change and, separately, when to search.",
  features:
    "Reach for search when the input IS a query: filtering a list, finding a record, looking something up. It keeps two callbacks apart, which is the part worth understanding before you wire it. `onValueChange` fires as the text changes and `onSearch` fires when the query should RUN — so a live filter and a submit-on-enter UI are the same component, and neither has to guess at the other's timing. `label` is the field's name. Note the underlying `value`/`onChangeText` are omitted from the inherited props: this component owns them and renames them.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory. The web `Search`
    // strips `onSubmit`/`onChange` in favour of `onSearch`/`onValueChange`.
    nativePeer: "Search",
    variants: [],
    elevation: "surface",
  },
  parts: ["Search"],
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
  ],
  usage: {
    do: [
      "`label` names the field — the placeholder is separate and defaults to the same wording.",
      "Keep `onValueChange` (live change) and `onSearch` (the query to run) separate — they are two different moments.",
      "Use the docked bar for in-screen search; full search with results wants its own route.",
    ],
    dont: [
      "Don't submit from `onValueChange` — wait for `onSearch`, or every keystroke runs a query.",
      "Don't hide the clear control's label — it is the only control in the bar besides entry.",
    ],
  },
  tokens: [
    {
      element: "Bar",
      state: "resting",
      token: "theme.color.surfaceContainerHigh",
      value: "surfaceContainerHigh stadium, full pill, minHeight 56",
    },
    {
      element: "Bar border",
      state: "focused",
      token: "theme.color.primary",
      value: "1px primary border only while focused",
    },
    {
      element: "Query text",
      state: "resting",
      token: "theme.color.onSurface",
      value: "onSurface; placeholder is onSurfaceVariant",
    },
  ],
  faq: [
    {
      q: "Search or text field?",
      a: "A query that runs (`onSearch`) with a clear control means search. Free entry with validation means a text field.",
    },
    {
      q: "How does this differ from the web search?",
      a: "Same contract (`label`, live change vs run, `onSubmit`/`onChange` stripped in favor of `onSearch`/`onValueChange`). The docked stadium and the focus-only border are drawn to the same roles natively.",
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
