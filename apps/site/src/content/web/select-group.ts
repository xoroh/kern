import type { ComponentDoc } from "../types";

export const selectGroup: ComponentDoc = {
  slug: "select-group",
  name: "Select group",
  oneLiner:
    "Select groups collect related options under one label inside the open list.",
  features:
    "Reach for a select group when the option list is long enough to need landmarks: sizes, cuisines, countries. It renders its children with `SelectGroupLabel` naming them, so the set reads as sections rather than as one undifferentiated run. It owns no value and no open state — grouping is presentation, and the select owns everything else.",
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
  anatomy: [
    {
      name: "SelectGroup",
      role: "The group. Renders its options with the label above them.",
    },
    {
      name: "SelectGroupLabel",
      role: "The group's name. Read with the options it heads.",
    },
  ],
  usage: {
    do: [
      "Group options that share a meaning — the label is what makes the group scannable.",
      "Keep every option inside exactly one group or none; half-grouped lists read as accidents.",
    ],
    dont: [
      "Don't nest groups — one level of sections is the whole pattern.",
      "Don't put the selected value in the label — the field already shows the choice.",
    ],
  },
  tokens: [
    {
      element: "Group",
      state: "resting",
      token: "transparent",
      value: "no surface of its own — the list surface carries the paint",
    },
  ],
  faq: [
    {
      q: "Group or flat list?",
      a: "More than a screenful of unsorted options means groups; a short set reads better flat.",
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
