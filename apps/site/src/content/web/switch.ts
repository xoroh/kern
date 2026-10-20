import type { ComponentDoc } from "../types";

// `switch` is a reserved word, so the export name carries a suffix and the
// route slug — which is what the URL and the registry key on — stays `switch`.
export const switchDoc: ComponentDoc = {
  slug: "switch",
  name: "Switch",
  oneLiner: "A switch turns a single setting on or off and applies it at once.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/switch",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Switch",
    // No variant axis. Switch is one treatment: the track is either checked or
    // not, and that is state rather than a variant.
    variants: [],
    elevation: "surface",
  },
  parts: ["Switch"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover", "disabled"],
  keyboard: [
    {
      key: "Space / Enter",
      action: "Toggles the switch when focused.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the switch. Disabled switches are skipped.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the component's own classes, on both the track and the thumb.",
      "Checked and unchecked colour come from `--sys-color-primary` and `--sys-color-outline`, so a theme moves the switch with everything else.",
      "State is exposed as `data-checked` and `data-disabled`, so a stylesheet can target the states without touching the component.",
    ],
    notSupported: [
      "There is no `size` prop. The track and thumb dimensions are fixed.",
      "There is no `label` prop. Render a label beside it and wire it with `htmlFor`/`id` or `aria-labelledby`.",
      "There is no `color` or `variant` prop. The checked colour is the primary role; a different one is a theme change, not a prop.",
    ],
  },
  api: [
    {
      name: "checked",
      type: "boolean",
      note: "Controlled state. Omit for uncontrolled.",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean, eventDetails: object) => void",
      note: "Fires on every change, including keyboard activation.",
    },
    {
      name: "defaultChecked",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the switch via `data-disabled`.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the track's own classes. The thumb takes `className` through its own composition.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state: SwitchRootState) => CSSProperties | undefined) | undefined",
      note: "Style for the control, or a function of its state (checked, disabled, focused) returning style.",
    },
    {
      name: "form",
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the switch can live outside the `<form>` and still submit with it.",
    },
    {
      name: "id",
      type: "string | undefined",
      note: "Id of the hidden input element. When `nativeButton` is set, the id lands on the root instead.",
    },
    {
      name: "value",
      type: "string | undefined",
      note: 'Value submitted with the form when the switch is on. An on-switch submits `"on"` like a native checkbox unless this says otherwise.',
    },
    {
      name: "render",
      type: "ReactElement<unknown, string | JSXElementConstructor<any>> | ComponentRenderFn<HTMLProps, SwitchRootState> | undefined",
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
      note: "Whether the `render` replacement is a native `<button>`. Set it when it is, so semantics and the id placement stay correct.",
    },
    {
      name: "required",
      type: "boolean | undefined",
      note: "Whether the switch must be on before form submission.",
    },
    {
      name: "readOnly",
      type: "boolean | undefined",
      note: "Whether the switch is fixed: it still shows its state but cannot be flipped.",
    },
    {
      name: "inputRef",
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "uncheckedValue",
      type: "string | undefined",
      note: "Value submitted with the form when the switch is off. Unchecked switches submit nothing by default, like native checkboxes.",
    },
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the control. Opt-in only — no default. See `parity/testid-contract.md`.",
    },
  ],
  aria: [
    'The root sets `role="switch"` and reflects state as `aria-checked`.',
    "Space and Enter toggle it; the native button semantics carry the keyboard behaviour.",
    "It is focusable and shows a `:focus-visible` ring. The state is also carried in `data-checked`, so a label styled with the switch cannot drift from it.",
  ],
};
