import type { ComponentDoc } from "../types";

export const input: ComponentDoc = {
  slug: "input",
  name: "Input",
  oneLiner:
    "Inputs are the text field, with an error state that is announced rather than only coloured.",
  features:
    "Reach for an input when the answer is free text. It is React Native's `TextInput` with kern's field behaviour on top, and the useful part is how it relates to a field: if you render it inside `Field.Root` it picks up the label and the error from context automatically, so its accessible name is right without you passing anything. On its own it is a plain text field and you name it yourself. The error state exists because React Native has no `accessibilityState.invalid` — so the error is announced through `accessibilityHint` instead, which is a platform substitution worth knowing about rather than a styling choice.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory. The web one carries
    // `aria-describedby`; this one announces through `accessibilityHint`.
    nativePeer: "Input",
    variants: [],
    elevation: "surface",
  },
  parts: ["Input"],
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
  usage: {
    do: [
      "Pick the variant by surface: `outlined` draws the `1px` outline, `filled` fills `surfaceContainerHighest` with a bottom indicator.",
      "Mark errors with `error` plus `errorMessage` — the message rides the focused hint because native has no invalid state.",
      "Let the enclosing field own the label where one exists (`field.label` becomes the accessible label automatically).",
    ],
    dont: [
      "Don't read `placeholder` as the label — it is the unfilled state's example text, announced only until entry starts.",
      "Don't disable by styling alone — `editable={false}` carries the disabled state the placeholder and text colors follow.",
    ],
  },
  tokens: [
    {
      element: "Outlined field",
      state: "resting",
      token: "theme.color.outline",
      value: "1px outline on surface, minHeight 56",
    },
    {
      element: "Filled field",
      state: "resting",
      token: "theme.color.surfaceContainerHighest",
      value: "surfaceContainerHighest fill, extra-small top corners",
    },
    {
      element: "Field border",
      state: "error",
      token: "theme.color.error",
      value: "error border via `error` or the field's error",
    },
    {
      element: "Entered text",
      state: "resting",
      token: "theme.color.onSurface",
      value: "onSurface, 16px / 24px",
    },
    {
      element: "Placeholder",
      state: "resting",
      token: "theme.color.onSurfaceVariant",
      value: "onSurfaceVariant (38% onSurface when disabled)",
    },
  ],
  faq: [
    {
      q: "How is an error announced?",
      a: "React Native has no invalid state, so the error message joins the focused field's hint and `FieldMessage` adds the live alert nearby. `error` paints the border; `errorMessage` speaks.",
    },
    {
      q: "Filled or outlined?",
      a: "Functionally identical — pick by surface. Outlined draws the full 1px outline; filled fills the container and rounds only the top corners.",
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
