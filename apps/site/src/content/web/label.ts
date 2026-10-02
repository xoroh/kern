import type { ComponentDoc } from "../types";

export const label: ComponentDoc = {
  slug: "label",
  name: "Label",
  oneLiner: "Labels name the control they sit beside.",
  features:
    "Reach for a label whenever a control needs a name you can see: a field, a checkbox, a slider. A visible label is not decoration — it is how anyone who cannot see the placeholder, or who has already typed past it, knows what the control is for. Associate it with its control rather than merely placing it nearby, or it names nothing as far as assistive tech is concerned. If the control is part of a group answering one question, the question belongs to the group's legend and the label names the individual control.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Label",
    variants: [],
    elevation: "surface",
  },
  parts: ["Label"],
  customization: {
    supported: [
      "`className` is passed through and merged after the label's own classes.",
      "It renders a real `<label>`, so its props are the element's and the association is the element's too.",
      "Size and weight come from the typescale rather than from numbers in the component.",
    ],
    notSupported: [
      "There is no `required` or `optional` prop. Marker text belongs in the label's own content, where it is read in the right order rather than appended afterwards.",
      "There is no `size` or `variant` prop. The label is one style.",
      "There is no `hint` or `description` prop. Help text is a separate element associated with the control.",
    ],
  },
  api: [
    {
      name: "htmlFor",
      type: "string",
      note: "The id of the control this names. THIS is what makes the label name something — a label with no association is text sitting near a box.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the label's own classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The name itself. Include any required marker here so it is read at the right point.",
    },
  ],
  aria: [
    "A real `<label>` associated by `htmlFor` becomes the control's accessible name, and clicking it focuses the control.",
    "Without that association the label names nothing — it is visual only, and the control falls back to whatever else it has.",
    "A label is not a heading and not a caption. It names one control; a group's question belongs to a `FieldsetLegend`.",
  ],
};
