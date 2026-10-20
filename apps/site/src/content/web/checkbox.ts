import type { ComponentDoc } from "../types";

export const checkbox: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  oneLiner:
    "Checkboxes let people pick several things from a set, or agree to something one at a time.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/checkbox",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Checkbox",
    // No variant axis. Checked, unchecked and indeterminate are states the
    // control moves through, not treatments a caller picks between.
    variants: [],
    elevation: "surface",
  },
  parts: ["Checkbox"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover", "disabled"],
  keyboard: [
    {
      key: "Space",
      action: "Toggles the checkbox when focused.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the checkbox. Disabled boxes are skipped.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the control's own classes.",
      "`label` wraps the control in a real `<label>`, so the text is the accessible name and clicking the text toggles the box.",
      "State is exposed as `data-checked`, `data-indeterminate` and `data-disabled`, so a stylesheet can restyle every state without new props.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. The box is one size and one treatment; the state carries the meaning.",
      "There is no `description` prop. If an option needs explaining, that is a Field around it — the checkbox owns one box and one line.",
      "`label` is optional, and when it is omitted the control renders bare with no accessible name. That is deliberate for composition, but it means the caller owns the name — pass `aria-label`, or wrap it in a label of your own.",
    ],
  },
  api: [
    {
      name: "label",
      type: "ReactNode",
      note: "The visible label. When present it wraps the control in a `<label>`, which supplies both the accessible name and click-to-toggle. When absent the control renders bare and unnamed.",
    },
    {
      name: "checked",
      type: "boolean",
      note: "Controlled state. Omit for uncontrolled.",
    },
    {
      name: "defaultChecked",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean, eventDetails: object) => void",
      note: "Fires on every change, including keyboard activation.",
    },
    {
      name: "indeterminate",
      type: "boolean",
      default: "false",
      note: "The third state — neither on nor off, usually meaning 'some of the children below are checked'. It is a real state, not a style: it sets the corresponding ARIA attribute rather than just drawing a dash.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the control.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the control's own classes.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state: CheckboxRootState) => CSSProperties | undefined) | undefined",
      note: "Style for the control, or a function of its state (checked, indeterminate, disabled, focused) returning style. The M3 container shape is fixed rather than a sys-shape step, so it lives in `style` rather than a radius utility.",
    },
    {
      name: "form",
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the checkbox can live outside the `<form>` and still submit with it.",
    },
    {
      name: "id",
      type: "string | undefined",
      note: "Id of the input element. Labels and descriptions wire to it.",
    },
    {
      name: "value",
      type: "string | undefined",
      note: 'The checkbox\'s value. Identifies it within a checkbox group; a checked box submits this, or the native `"on"` when omitted.',
    },
    {
      name: "render",
      type: "ReactElement<unknown, string | JSXElementConstructor<any>> | ComponentRenderFn<HTMLProps, CheckboxRootState> | undefined",
      note: "Replaces the control element with another tag or composes it with another component. Set `nativeButton` when the replacement is a native `<button>`.",
    },
    {
      name: "name",
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "nativeButton",
      type: "boolean | undefined",
      note: "Whether the `render` replacement is a native `<button>`. Set it when it is, so semantics stay correct.",
    },
    {
      name: "required",
      type: "boolean | undefined",
      note: "Whether the checkbox must be ticked before form submission.",
    },
    {
      name: "readOnly",
      type: "boolean | undefined",
      note: "Whether the checkbox is fixed: it still shows its state but cannot be ticked or unticked.",
    },
    {
      name: "inputRef",
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "parent",
      type: "boolean | undefined",
      note: "Whether the checkbox controls a group of child checkboxes. Only inside a checkbox group.",
    },
    {
      name: "uncheckedValue",
      type: "string | undefined",
      note: "Value submitted with the form when the checkbox is unchecked. Unchecked boxes submit nothing by default, like native checkboxes.",
    },
  ],
  aria: [
    "The control is a real checkbox, so it carries the checkbox role and `aria-checked`, and Space toggles it.",
    "`indeterminate` is reported as the mixed state rather than being a visual-only dash.",
    "The `label` prop associates the text with the control by wrapping it, so the name is read when focus lands on the box.",
    "Without `label`, the checkbox has no accessible name. A composed checkbox must supply its own, or it is unusable with a screen reader.",
  ],
};
