import type { ComponentDoc } from "../types";

export const field: ComponentDoc = {
  slug: "field",
  name: "Field",
  oneLiner:
    "Fields pair a control with its label, description and error message, and wire them together for assistive tech.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Field",
    variants: [],
    elevation: "surface",
  },
  // One family, one page: `FieldRoot` and `FieldMessage` are this family's
  // parts and their URLs 301 here per the canonical-slug rule. `FieldMessage`
  // is standalone enough to deserve its own row, so it is listed here and
  // documented below.
  parts: ["Field", "FieldRoot", "FieldMessage"],
  // M2: the field is a WIRING container — label, control, message. It
  // takes no focus and answers no key; the control it holds is what the
  // screen reader reaches, and the field is what hands it its name.
  nonInteractive: true,
  customization: {
    supported: [
      "`label` is required; `description` and `error` are optional strings that the composition renders as messages.",
      "`Field.Control` is `Input`, so the default control is the text field; the parts are individually usable too.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `required` or `optional` marker prop. The label is what you pass it.",
      "`error` and `description` are not shown together — error wins. There is no mode in which both render.",
      "There is no `layout` or `orientation` prop. The field is a vertical stack with a fixed gap.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "REQUIRED. The field's name. It is published through context so the control picks it up as its accessible name.",
    },
    {
      name: "description",
      type: "string",
      note: "Help text under the control. Rendered only when `error` is absent — error takes precedence.",
    },
    {
      name: "error",
      type: "string",
      note: "The error message. When present it replaces the description and is announced as an alert. Published through context so the control can associate it.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The control. `Field.Control` is `Input` for the common case.",
    },
    {
      name: "FieldMessage",
      type: "component",
      note: 'The message part, exported standalone. `variant: "description" | "error"`, default `description`. On `error` it sets `accessibilityRole="alert"` so the message is announced; on `description` the role is `none`.',
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. The stack uses a fixed gap of 6.",
    },
  ],
  aria: [
    "The label is published through context and the control consumes it, so the accessible name is correct without wiring anything by hand — the reason this composition exists.",
    "`error` takes precedence over `description` visually AND in what is announced, so a field never speaks twice.",
    'An error message carries `accessibilityRole="alert"`, so it is announced when it appears rather than sitting there silently. A description carries `none`, because help text is not an alert.',
  ],
};
