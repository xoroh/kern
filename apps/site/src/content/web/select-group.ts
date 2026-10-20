import type { ComponentDoc } from "../types";

export const selectGroup: ComponentDoc = {
  slug: "select-group",
  name: "Select group",
  oneLiner:
    "Select groups collect related options under one label inside the open list.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // A composition part of the select, documented on its own page so the
    // export is claimed exactly once. No native counterpart — the native
    // select renders a flat option list.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["SelectGroup"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Tab",
      action:
        'Never lands on the group. It is a `role="group"` container rather than a control, so it is not in the tab order at all — its label is read with the options it names.',
    },
    {
      key: "Arrow keys",
      action:
        "Move the highlight between the options while the list is open. The group label is skipped — only options are selectable, so a group boundary is not a stop.",
    },
    {
      key: "Enter / Space",
      action:
        "Commits the highlighted option and closes the list; focus returns to the trigger.",
    },
    {
      key: "Escape",
      action:
        "Closes the list without changing the value; focus returns to the trigger.",
    },
  ],
  customization: {
    supported: [
      "`className` is merged after the group's own classes; `style` and `render` pass through to the underlying element.",
    ],
    notSupported: [
      "There is no `value` or selection prop. Grouping is presentation — the select owns the value.",
      "There is no `label` prop. The label is `SelectGroupLabel`, rendered, not passed.",
    ],
  },
  api: [
    {
      name: "className",
      type: "string",
      note: "Merged after the group's own classes.",
    },
    {
      name: "style",
      type: "React.CSSProperties",
      note: "Passed through to the underlying element.",
    },
    {
      name: "render",
      type: "ReactElement | ((props) => ReactElement)",
      note: "Renders the group itself instead of the default element.",
    },
  ],
  aria: [
    'The group renders with `role="group"` named by `SelectGroupLabel`, so options announce inside the section they belong to.',
    "Grouping changes nothing about selection — the value contract stays entirely on the select.",
  ],
};
