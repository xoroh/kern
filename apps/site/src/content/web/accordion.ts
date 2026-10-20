import type { ComponentDoc } from "../types";

export const accordion: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  oneLiner:
    "Accordions stack collapsible sections, so a long page can be scanned as headings first.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
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
  // The keyboard contract, read off the trigger: it is a real button inside
  // a heading, and a closed section's panel is not in the DOM to be
  // tabbed into.
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the focused trigger — opens the section, or closes it again if it is already open.",
    },
    {
      key: "Tab",
      action:
        "Moves between the triggers and whatever the open panel holds. A closed section's panel is out of the tab order, so a collapsed stack never parks focus on hidden controls.",
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
      for: ["AccordionRoot", "AccordionItem", "AccordionTrigger"],
      type: "string | string[]",
      note: "Controlled open sections on `AccordionRoot`. One value for a single-open stack, several for independent sections. On an item it is the section’s value in the open set.",
    },
    {
      name: "defaultValue",
      for: ["AccordionRoot"],
      type: "string | string[]",
      note: "Initial open sections when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["AccordionRoot"],
      type: "(value) => void",
      note: "Fires when the open set changes.",
    },
    {
      name: "disabled",
      for: ["AccordionRoot", "AccordionItem", "AccordionTrigger"],
      type: "boolean",
      note: "On the root it locks every section; on an item just that section — it cannot be opened and is announced as unavailable.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "hiddenUntilFound",
      for: ["AccordionRoot", "AccordionPanel"],
      type: "boolean | undefined",
      note: 'Lets the browser\'s find-in-page locate and expand the panel contents. Overrides `keepMounted`, hiding the panel with `hidden="until-found"` instead of removing it from the DOM.',
    },
    {
      name: "keepMounted",
      for: ["AccordionRoot", "AccordionPanel"],
      type: "boolean | undefined",
      note: "Keeps the panel in the DOM while closed. Ignored when `hiddenUntilFound` is set.",
    },
    {
      name: "loopFocus",
      for: ["AccordionRoot"],
      type: "boolean | undefined",
      note: "Deprecated: arrow-key focus looping was removed per the ARIA practices update. This prop no longer affects keyboard focus.",
    },
    {
      name: "multiple",
      for: ["AccordionRoot"],
      type: "boolean | undefined",
      note: "Whether several sections can be open at once. Single-open by default.",
    },
    {
      name: "orientation",
      for: ["AccordionRoot"],
      type: "Orientation | undefined",
      note: "Deprecated: arrow-key orientation handling was removed per the ARIA practices update. This prop no longer affects keyboard focus.",
    },
    {
      name: "onOpenChange",
      for: ["AccordionItem"],
      type: "((open: boolean, eventDetails: AccordionItemChangeEventDetails) => void) | undefined",
      note: "Fires when this section opens or closes.",
    },
    {
      name: "nativeButton",
      for: ["AccordionTrigger"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — generic state on the stack, `AccordionItemState` on a section, `AccordionHeaderState` on a heading, `AccordionTriggerState` on a trigger, `AccordionPanelState` on a panel.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "Each trigger is a heading with a button inside it, so the sections form a document outline rather than a pile of buttons.",
    "The trigger carries `aria-expanded` and is associated with its panel, so what it opens is announced with it.",
    "While a section is closed its panel is out of the tab order — a collapsed accordion must not trap focus in invisible controls.",
    "This is the disclosure pattern applied repeatedly: nothing is modal and nothing traps focus.",
  ],
};
