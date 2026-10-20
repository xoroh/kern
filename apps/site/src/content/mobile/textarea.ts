import type { ComponentDoc } from "../types";

export const textarea: ComponentDoc = {
  slug: "textarea",
  name: "Textarea",
  oneLiner:
    "Textareas are the multi-line text field — the input with line breaks turned on.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Textarea",
    variants: [],
    elevation: "surface",
  },
  parts: ["Textarea"],
  // The contract, read off the component: it is the multi-line `Input`, so
  // the field itself owns no key handling.
  keyboard: [
    {
      key: "Enter",
      action:
        "Inserts a line break in the field. It does not submit the form — submitting is the form's business, and a multi-line field that submitted on Enter would be a trap.",
    },
    {
      key: "External keyboard",
      action:
        "The field takes native focus and the OS keyboard opens; apart from the line break above, the component handles no key of its own — entry, correction and dismissal belong to the platform.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The field announces its label (or the enclosing field's label), its hint, and the error message when invalid; double-tap focuses and opens the keyboard.",
    },
  ],
  customization: {
    supported: [
      "Every `Input` prop except `multiline` — the text-field surface is shared deliberately.",
      "`error`/`errorMessage` behave exactly as on `Input`, including the field-context fallbacks.",
      "`style` is a React Native `TextStyle`.",
    ],
    notSupported: [
      "There is no `multiline` prop. It is omitted from the type on purpose: `Textarea` IS the multi-line form, and being able to turn that off would make it a differently-named `Input`.",
      "There is no `rows` or `autoGrow` prop. The height is the platform's.",
      "There is no `label`; it comes from `Field.Root`'s context or `accessibilityLabel`, as on `Input`.",
    ],
  },
  api: [
    {
      name: "props",
      type: "Omit<NativeInputProps, 'multiline'>",
      note: "Everything `Input` takes, minus `multiline`. The implementation is literally `<Input multiline {...props} />` — one component, one behaviour, two names.",
    },
    {
      name: "error",
      type: "boolean",
      note: "As on `Input`: the prop OR the enclosing field's error.",
    },
    {
      name: "errorMessage",
      type: "string",
      note: 'As on `Input`: falls back to the field\'s error, then "Invalid input". Always announced.',
    },
    {
      name: "style",
      type: "StyleProp<TextStyle>",
      note: "React Native text styles.",
    },
  ],
  aria: [
    "Identical to `Input` — the accessible name falls back to the enclosing field's `label`.",
    "The same platform substitution applies: errors are announced through `accessibilityHint` because React Native has no `accessibilityState.invalid`.",
    "Because it is the same component as `Input`, nothing about its announcement differs just because it wraps to several lines.",
  ],
};
