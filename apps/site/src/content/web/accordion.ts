import type { ComponentDoc } from "../types";

export const accordion: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  oneLiner:
    "Accordions stack collapsible sections, so a long page can be scanned as headings first.",
  features:
    "Reach for an accordion when the content is several sections of the same kind and most readers want only one or two: FAQs, a settings page, a record's grouped details. The headings become the index, which is the point — you can see the shape of the whole without reading it. Keep each section self-contained and the headings short enough to compare at a glance. If everyone needs all of it, do not hide it; an accordion is for content that is optional to read, not for content that is merely long.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Accordion",
    variants: [],
    elevation: "surface",
  },
  parts: [
    "Accordion",
    "AccordionRoot",
    "AccordionItem",
    "AccordionHeader",
    "AccordionTrigger",
    "AccordionPanel",
  ],
  anatomy: [
    {
      name: "AccordionRoot",
      role: "The stack. Owns which sections are open — one at a time or several, as the primitive allows.",
    },
    { name: "AccordionItem", role: "One section: its heading and its panel." },
    {
      name: "AccordionHeader",
      role: "The heading wrapper. It is what makes the trigger a heading in the document outline.",
    },
    {
      name: "AccordionTrigger",
      role: "What opens the section. Carries the expanded state.",
    },
    {
      name: "AccordionPanel",
      role: "The revealed content, out of the tab order while its section is closed.",
    },
    {
      name: "Accordion",
      role: "The namespace object: all of the parts above.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The panel is plain content — whatever goes inside is the caller's to lay out.",
      "Open state is on the trigger, so the control can be styled by state without new props.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop.",
      "There is no `animate` prop. Whether a panel opens with a transition is the caller's CSS.",
      "There is no `headingLevel` prop. The level follows the `AccordionHeader`'s own element, which is where the document outline is decided.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string | string[]",
      note: "Controlled open sections on `AccordionRoot`. One value for a single-open stack, several for independent sections — the shape says which behaviour you are in.",
    },
    {
      name: "defaultValue",
      type: "string | string[]",
      note: "Initial open sections when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value) => void",
      note: "Fires when the open set changes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a trigger: the section cannot be opened and is announced as unavailable.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
  ],
  aria: [
    "Each trigger is a heading with a button inside it, so the sections form a document outline rather than a pile of buttons.",
    "The trigger carries `aria-expanded` and is associated with its panel, so what it opens is announced with it.",
    "While a section is closed its panel is out of the tab order — a collapsed accordion must not trap focus in invisible controls.",
    "This is the disclosure pattern applied repeatedly: nothing is modal and nothing traps focus.",
  ],
};
