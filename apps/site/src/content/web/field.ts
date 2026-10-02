import type { ComponentDoc } from "../types";

export const field: ComponentDoc = {
  slug: "field",
  name: "Field",
  oneLiner:
    "A field pairs a control with its label, its help text and its error, and wires them together.",
  features:
    "Reach for a field whenever you render a labelled control — it is the thing that makes a text box a form control rather than a box. It owns the association a screen reader needs: the label names the control, the description and the error are announced with it, and the error announces itself when it appears. Reach for the individual parts when you are composing something the field does not cover, but keep the wiring — a label that is not associated with its input is a label sighted users benefit from and everyone else does not.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // The native renderer ships Field, FieldRoot and FieldMessage but not the
    // label/description/error parts — a deliberate asymmetry recorded in
    // docs/parity-contract.md, since RN folds the description and error into
    // one announced hint. Named here rather than hidden behind "same API".
    nativePeer: "Field",
    // No variant axis. A field is a layout and wiring concern; emphasis comes
    // from the control inside it.
    variants: [],
    elevation: "surface",
  },
  parts: [
    "Field",
    "FieldRoot",
    "FieldLabel",
    "FieldDescription",
    "FieldError",
    "FieldMessage",
  ],
  anatomy: [
    {
      name: "FieldRoot",
      role: "The stack. Groups the parts and owns the association between them.",
    },
    {
      name: "FieldLabel",
      role: "Names the control. Becomes its accessible name.",
    },
    {
      name: "FieldDescription",
      role: "Help text. Wired to `aria-describedby` so it is read with the control.",
    },
    {
      name: "FieldError",
      role: "The error line. Announces itself when it appears.",
    },
    {
      name: "FieldMessage",
      role: "The generic message line in either tone, used by `Input` to render its own error.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Tone comes from the system roles — `--md-sys-color-error` for errors, the surface-variant roles for help text.",
      "`FieldMessage` takes a `variant` of `description` or `error`, so one line component covers both tones.",
    ],
    notSupported: [
      "There is no `required` or `optional` prop on the field. Marker text belongs in the label, where it is read in the right order.",
      "There is no `size` prop. Type sizes are the typescale's, not the field's.",
      "There is no `layout` prop. The field is a vertical stack; side-by-side label and control is a grid in your own layout.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"description" | "error"',
      default: '"description"',
      note: "On `FieldMessage`. The `error` variant takes the alert role, so it interrupts; `description` does not.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `FieldRoot`: the parts. Order in the DOM is the reading order, so keep the label first.",
    },
  ],
  aria: [
    "`FieldLabel` becomes the accessible name of the control it is paired with.",
    "`FieldDescription` is associated via `aria-describedby`, so it is announced after the name rather than dropped.",
    '`FieldError` carries `role="alert"`, so it is announced when it appears — which is how a validation failure reaches someone who cannot see the red text.',
    "The parts wire themselves through the root; re-parenting them outside `FieldRoot` breaks the association silently.",
  ],
};
