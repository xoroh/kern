import type { ComponentDoc } from "../types";

export const input: ComponentDoc = {
  slug: "input",
  name: "Input",
  oneLiner:
    "Inputs are the text field, with an error state that is announced rather than only coloured.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory. The web one carries
    // `aria-describedby`; this one announces through `accessibilityHint`.
    nativePeer: "Input",
    variants: [],
    elevation: "surface",
  },
  parts: ["Input"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "error"],
  keyboard: [
    {
      key: "External keyboard",
      action:
        "The field takes native focus and the OS keyboard opens; there is no key handling of its own — entry, correction and dismissal belong to the platform.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The field announces its label (or the enclosing field's label), its hint, and the error message when invalid; double-tap focuses and opens the keyboard.",
    },
  ],
  customization: {
    supported: [
      "It is `TextInputProps`, so the usual React Native text-field props are available — `value`, `onChangeText`, `keyboardType`, `placeholder` and the rest.",
      "`error` marks the error state and `errorMessage` sets what is announced.",
      "`style` is a React Native `TextStyle`, since the input is the text box itself.",
    ],
    notSupported: [
      "There is no `label` prop. The name comes from `Field.Root`'s context, or from `accessibilityLabel` if you set it directly.",
      "There is no `description` prop. Help text is `Field`'s `description`.",
      "There is no `size` or `variant` prop. The field looks the way it looks; the variants live on the buttons and chips, not on text boxes.",
    ],
  },
  api: [
    {
      name: "error",
      type: "boolean",
      note: "Marks the error state — the border turns to the error colour. The error can also come from the enclosing `Field.Root`, in which case you do not pass it: `hasError` is the prop OR the context.",
    },
    {
      name: "errorMessage",
      type: "string",
      note: 'What is announced when there is an error. Falls back to the field context\'s error, and then to "Invalid input" — so an error is always announced, never just coloured.',
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Optional. Falls back to the enclosing `Field.Root`'s `label` — which is why rendering inside a field makes the accessible name correct for free.",
    },
    {
      name: "accessibilityHint",
      type: "string",
      note: "Your own hint. When there is an error the hint is REPLACED by the error message, because React Native has no `accessibilityState.invalid` to carry it.",
    },
    {
      name: "style",
      type: "StyleProp<TextStyle>",
      note: "React Native text styles — this is the text box, not a wrapper.",
    },
  ],
  aria: [
    "The accessible name falls back to the field context's `label`, so a field-wrapped input is named correctly without passing anything.",
    "PLATFORM SUBSTITUTION: React Native has no `accessibilityState.invalid`, so the error is announced through `accessibilityHint` rather than an invalid state. Web uses `aria-describedby`. Same intent, different mechanism, recorded rather than papered over.",
    'An error is always announced — `errorMessage`, then the field\'s error, then "Invalid input". An error that only changes a border colour is an error only sighted people learn about.',
  ],
};
