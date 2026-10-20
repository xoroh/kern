import type { ComponentDoc } from "../types";

export const field: ComponentDoc = {
  slug: "field",
  name: "Field",
  oneLiner:
    "A field pairs a control with its label, its help text and its error, and wires them together.",
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
  // M2: the field is a WIRING container — label, control, description,
  // error. It takes no focus and answers no key; the control it holds is
  // the tab stop, and the parts are what it hands that control.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Tone comes from the system roles — `--sys-color-error` for errors, the surface-variant roles for help text.",
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
      for: ["FieldMessage"],
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
    {
      name: "style",
      for: ["FieldRoot", "FieldLabel", "FieldDescription", "FieldError"],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `FieldRootState` on the root, `FieldLabelState` on the label, `FieldDescriptionState` on the description, `FieldErrorState` on the error.",
    },
    {
      name: "disabled",
      for: ["FieldRoot"],
      type: "boolean | undefined",
      note: "Whether the field ignores interaction. Wins over `disabled` on the control itself.",
    },
    {
      name: "render",
      for: ["FieldRoot", "FieldLabel", "FieldDescription", "FieldError"],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeLabel` on the label when the replacement is not a native `<label>`.",
    },
    {
      name: "name",
      for: ["FieldRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "actionsRef",
      for: ["FieldRoot"],
      type: "RefObject<FieldRootActions | null> | undefined",
      note: "Imperative handle: `validate()` validates the field on demand.",
    },
    {
      name: "validate",
      for: ["FieldRoot"],
      type: "((value: unknown, formValues: Record<string, any>) => string | void | string[] | Promise<string | void | string[] | null> | null) | undefined",
      note: "Custom validation: return error message(s) when invalid, nothing (or null/empty) when valid. Async functions run but do not block submit under `onSubmit` mode.",
    },
    {
      name: "validationMode",
      for: ["FieldRoot"],
      type: "FormValidationMode | undefined",
      note: "When the field validates: `onSubmit` (and re-validates on change after submitting), `onBlur`, or `onChange`. Wins over the `<Form>` mode.",
    },
    {
      name: "validationDebounceTime",
      for: ["FieldRoot"],
      type: "number | undefined",
      note: "Milliseconds to wait between `validate` calls in `onChange` mode.",
    },
    {
      name: "invalid",
      for: ["FieldRoot"],
      type: "boolean | undefined",
      note: "Whether the field is invalid. For state owned by an external form library.",
    },
    {
      name: "dirty",
      for: ["FieldRoot"],
      type: "boolean | undefined",
      note: "Whether the value changed from its initial value. For state owned by an external form library.",
    },
    {
      name: "touched",
      for: ["FieldRoot"],
      type: "boolean | undefined",
      note: "Whether the field was touched. For state owned by an external form library.",
    },
    {
      name: "nativeLabel",
      for: ["FieldLabel"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<label>`. Set it false for a non-label replacement (a `<div>`) so button triggers inside do not inherit label hover and click behavior.",
    },
    {
      name: "match",
      for: ["FieldError"],
      type: "boolean | keyof ValidityState | undefined",
      note: "Which validity failure shows this message: a `ValidityState` key, or `true` to always show it and let an external library own visibility.",
    },
  ],
  aria: [
    "`FieldLabel` becomes the accessible name of the control it is paired with.",
    "`FieldDescription` is associated via `aria-describedby`, so it is announced after the name rather than dropped.",
    '`FieldError` carries `role="alert"`, so it is announced when it appears — which is how a validation failure reaches someone who cannot see the red text.',
    "The parts wire themselves through the root; re-parenting them outside `FieldRoot` breaks the association silently.",
  ],
};
