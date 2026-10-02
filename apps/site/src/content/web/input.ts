import type { ComponentDoc } from "../types";

export const input: ComponentDoc = {
  slug: "input",
  name: "Input",
  oneLiner:
    "Inputs take a single line of text from someone and hand it to you.",
  features:
    "Reach for an input when the answer is one short line: a name, an email, a search term, a quantity. Wrap it in a Field so the label, help text and error are wired to it — an input on its own has no label and no way to report a problem. Pick the `type` that matches the answer, because it changes the keyboard on a phone and the validation the browser offers for free. If the answer is longer than a line, that is a textarea; if it is one of a known set of values, that is a select.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native ships `Input` with the same `errorMessage` contract: the message
    // is folded into the announced hint, since RN has no
    // `accessibilityState.invalid`. The delivery attributes differ; the
    // public prop surface does not.
    nativePeer: "Input",
    // No variant axis. Emphasis and tone come from the field state (error,
    // disabled, focused) rather than from a variant.
    variants: [],
    elevation: "surface",
  },
  parts: ["Input"],
  customization: {
    supported: [
      "`className` is passed through and merged after the input's own classes, so a token-backed utility overrides the shape.",
      "State is exposed as `data-invalid`, and the error border is applied both through that attribute and directly, so it shows with or without a Field.",
      "Height, radius and border all come from system tokens — `--md-sys-shape-corner-small` and the outline roles.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. A field is one height, which is what keeps a form's rows level.",
      "There is no `label`, `description` or `error` prop. Those are Field's parts — pass the control into a Field rather than duplicating the wiring here.",
      "There is no `clearable` or `prefix`/`suffix` prop. Compose those around the input; the input owns one value and one line.",
    ],
  },
  api: [
    {
      name: "errorMessage",
      type: "string",
      note: "The error TEXT, not just the state. Passing it implies `error`, so `aria-invalid` fires, the border turns to the error role, and the message renders and is wired to the input through `aria-describedby`. You do not pass `error` as well. Do not also render a sibling `FieldMessage` — this prop owns it.",
    },
    {
      name: "error",
      type: "boolean",
      default: "false",
      note: "Marks the input invalid on its own, with no message. Use it when the reason is explained somewhere other than the field.",
    },
    {
      name: "aria-describedby",
      type: "string",
      note: "Preserved and extended rather than overwritten: when `errorMessage` is set, the message's id is appended to it so your own description is still read.",
    },
    {
      name: "type",
      type: "string",
      note: "The input type. Drives the keyboard on touch devices and the browser's own validation.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the input's own classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLInputElement>",
      note: "Forwarded to the underlying control.",
    },
  ],
  aria: [
    "The input takes the label of the `FieldLabel` it sits inside, so it has an accessible name without an `aria-label` of its own.",
    "When `errorMessage` is set, `aria-invalid` is set and the message is associated via `aria-describedby` — which is what makes a validation failure audible rather than merely red.",
    'The error message renders as a `FieldMessage variant="error"`, which carries `role="alert"`, so it is announced when it appears.',
    "`aria-describedby` is additive: a description you already set is kept alongside the error, so help text is not silently dropped when a validation message arrives.",
  ],
};
