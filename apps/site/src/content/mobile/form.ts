import type { ComponentDoc } from "../types";

export const form: ComponentDoc = {
  slug: "form",
  name: "Form",
  oneLiner:
    "Native form container powered by the Axis Form behavior primitive.",
  features:
    "Reach for a form when several fields validate and submit together. Built on the Axis Form primitive, it coordinates validation timing, field registration, error aggregation, and submit handling across native Field controls.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    nativePeer: "Form",
    variants: [],
    elevation: "surface",
  },
  parts: ["Form"],
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
