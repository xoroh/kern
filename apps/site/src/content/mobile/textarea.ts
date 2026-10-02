import type { ComponentDoc } from "../types";

export const textarea: ComponentDoc = {
  slug: "textarea",
  name: "Textarea",
  oneLiner:
    "Textareas are the multi-line text field — the input with line breaks turned on.",
  features:
    "Reach for a textarea when the answer is a paragraph rather than a phrase: a comment, a description, a message. It is the same component as `Input` with `multiline` forced, and the `multiline` prop is deliberately removed from its type so it cannot be turned off — a textarea that can become single-line is just an input with a confusing name. Everything said about `Input` applies here: inside `Field.Root` it takes its label and error from context, and its error is announced through `accessibilityHint` because React Native has no invalid state.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Textarea",
    variants: [],
    elevation: "surface",
  },
  parts: ["Textarea"],
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
