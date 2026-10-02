import type { ComponentDoc } from "../types";

export const collapsible: ComponentDoc = {
  slug: "collapsible",
  name: "Collapsible",
  oneLiner:
    "Collapsibles hide a section of content behind a trigger and show it on demand.",
  features:
    "Reach for a collapsible when some of the content is optional reading: the details behind a summary, the advanced settings under a form, the rest of a long list. The trigger is the contract — what it says must describe what opens, and its state must be visible. Keep the thing that opens self-contained; a collapsible whose content needs the context above it has just hidden something important. If everything should be open all the time, do not build the toggle. If the content is navigation, that is a disclosure in a menu, not a collapsible.",
  meta: {
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
  anatomy: [
    {
      name: "CollapsibleRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    {
      name: "CollapsibleTrigger",
      role: "What opens it. Carries the expanded state, so its meaning is announced rather than implied by an arrow rotating.",
    },
    {
      name: "CollapsiblePanel",
      role: "The revealed content. Kept out of the tab order while closed.",
    },
    {
      name: "Collapsible",
      role: "The namespace object: Root, Trigger and Panel.",
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
      type: "boolean",
      note: "Controlled open state on `CollapsibleRoot`. Omit for uncontrolled.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      note: "Initial state when uncontrolled. A section open by default is a section people read; choose it deliberately.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires when the state flips, however it was flipped.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On the trigger: it will not open the panel and is announced as unavailable.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
  ],
  aria: [
    "The trigger carries `aria-expanded`, so whether the section is open is announced rather than left to be inferred from an arrow.",
    "The panel is associated with its trigger, so a screen reader knows what the button reveals.",
    "While closed, the panel's content is out of the tab order — a collapsed section must not trap focus in invisible controls.",
    "This is the disclosure pattern, not the dialog pattern: nothing is modal and nothing traps focus.",
  ],
};
