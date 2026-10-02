import type { ComponentDoc } from "../types";

export const checkbox: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  oneLiner:
    "Checkboxes let people pick several things from a set, or agree to something one at a time.",
  features:
    "Reach for a checkbox when each choice is independent and more than one can be on: permissions, ingredients, the columns you want in a table. A single checkbox is right for something you agree to separately from anything else — terms, a subscription, a flag. If only one option in a set may be chosen, that is a radio group; if the choice is a single thing you turn on and off and it applies immediately, that is a switch. Give the checkbox a label — an unnamed checkbox is a shape that means nothing to a screen reader.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Checkbox",
    // No variant axis. Checked, unchecked and indeterminate are states the
    // control moves through, not treatments a caller picks between.
    variants: [],
    elevation: "surface",
  },
  parts: ["Checkbox"],
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
  ],
  aria: [
    "The control is a real checkbox, so it carries the checkbox role and `aria-checked`, and Space toggles it.",
    "`indeterminate` is reported as the mixed state rather than being a visual-only dash.",
    "The `label` prop associates the text with the control by wrapping it, so the name is read when focus lands on the box.",
    "Without `label`, the checkbox has no accessible name. A composed checkbox must supply its own, or it is unusable with a screen reader.",
  ],
};
