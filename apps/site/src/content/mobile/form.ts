import type { ComponentDoc } from "../types";

export const form: ComponentDoc = {
  slug: "form",
  name: "Form",
  oneLiner:
    "Native form container powered by the Axis Form behavior primitive.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    nativePeer: "Form",
    variants: [],
    elevation: "surface",
  },
  parts: ["Form"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the submit control — there is no native form submit on this renderer, so the press is what calls `actions.submit()`, and `onFormSubmit` fires only when every registered field validates.",
    },
  ],
  customization: {
    supported: [
      "`style` is passed through to the form container View.",
      "`errors` passes external or server-side field errors.",
      "`onFormSubmit` receives the collected valid field values.",
      "`validationMode` controls whether validation runs on submit, blur, or change.",
    ],
    notSupported: [
      "There is no schema prop; validation is declared on individual Field parts.",
    ],
  },
  api: [
    {
      name: "onFormSubmit",
      type: "(values: Record<string, unknown>) => void",
      note: "Fires when the form validates and submits.",
    },
    {
      name: "errors",
      type: "FieldErrors | undefined",
      note: "Server or external errors keyed by field name.",
    },
    {
      name: "validationMode",
      type: '"onSubmit" | "onBlur" | "onChange"',
      note: "Default validation timing for fields without their own mode.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "Style for the form container.",
    },
  ],
  aria: [
    "Native form container wrapping Field controls with accessible error messaging.",
  ],
};
