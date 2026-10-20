import type { ComponentDoc } from "../types";

export const collapsible: ComponentDoc = {
  slug: "collapsible",
  name: "Collapsible",
  oneLiner:
    "Collapsibles hide a section of content behind a trigger and show it on demand.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Collapsible",
    // No variant axis. Open and closed are states, not treatments.
    variants: [],
    elevation: "surface",
  },
  parts: [
    "Collapsible",
    "CollapsibleRoot",
    "CollapsibleTrigger",
    "CollapsiblePanel",
  ],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Reveals or hides the section from the trigger. The trigger is a real button carrying `aria-expanded`, so the state is announced rather than implied by what is on screen.",
    },
    {
      key: "Tab",
      action:
        "Moves into the panel's content when the section is open. A closed panel is not in the page at all, so there is nothing to tab into.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after that part's own classes.",
      "The panel is plain content — whatever goes inside is the caller's to lay out.",
      "Open state is exposed on the trigger, so the control can be styled by state without new props.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop.",
      "There is no `animate` prop. Whether the panel animates is the caller's CSS; the component does not impose a transition.",
      "There is no `defaultOpen` on the panel alone — the state belongs to the root, because the trigger and the panel are one control.",
    ],
  },
  api: [
    {
      name: "open",
      for: ["CollapsibleRoot"],
      type: "boolean",
      note: "Controlled open state on `CollapsibleRoot`. Omit for uncontrolled.",
    },
    {
      name: "defaultOpen",
      for: ["CollapsibleRoot"],
      type: "boolean",
      note: "Initial state when uncontrolled. A section open by default is a section people read; choose it deliberately.",
    },
    {
      name: "onOpenChange",
      for: ["CollapsibleRoot"],
      type: "(open: boolean) => void",
      note: "Fires when the state flips, however it was flipped.",
    },
    {
      name: "disabled",
      for: ["CollapsibleRoot", "CollapsibleTrigger"],
      type: "boolean",
      note: "On the root it locks the section closed; on the trigger it will not open the panel and is announced as unavailable.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `CollapsibleRootState` on the stack, `CollapsibleTriggerState` on the trigger, `CollapsiblePanelState` on the panel.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger when the replacement is a native `<button>`.",
    },
    {
      name: "nativeButton",
      for: ["CollapsibleTrigger"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "hiddenUntilFound",
      for: ["CollapsiblePanel"],
      type: "boolean | undefined",
      note: 'Lets the browser\'s find-in-page locate and expand the panel contents. Overrides `keepMounted`, hiding the panel with `hidden="until-found"` instead of removing it from the DOM.',
    },
    {
      name: "keepMounted",
      for: ["CollapsiblePanel"],
      type: "boolean | undefined",
      note: "Keeps the panel in the DOM while closed. Ignored when `hiddenUntilFound` is set.",
    },
  ],
  aria: [
    "The trigger carries `aria-expanded`, so whether the section is open is announced rather than left to be inferred from an arrow.",
    "The panel is associated with its trigger, so a screen reader knows what the button reveals.",
    "While closed, the panel's content is out of the tab order — a collapsed section must not trap focus in invisible controls.",
    "This is the disclosure pattern, not the dialog pattern: nothing is modal and nothing traps focus.",
  ],
};
