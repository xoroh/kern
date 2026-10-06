import type { ComponentDoc } from "../types";

// `switch` is a reserved word, so the export name carries a suffix and the
// route slug — which is what the URL and the registry key on — stays `switch`.
export const switchDoc: ComponentDoc = {
  slug: "switch",
  name: "Switch",
  oneLiner: "A switch turns a single setting on or off and applies it at once.",
  features:
    "Reach for a switch when flipping it takes effect immediately and does not need a save step: notifications on, dark mode, auto-play. It is a thin wrapper over one Base UI primitive — the whole component is a stateful root and a thumb, and kern supplies the M3 look and the focus ring rather than any behaviour of its own. If the change only applies after a tap on a separate save button, that is a checkbox, not a switch. A switch carries its state in its own appearance, so it needs a visible label next to it rather than a label that only exists for assistive tech.",
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
  customization: {
    supported: [
      "`className` is passed through and merged after the component's own classes, on both the track and the thumb.",
      "Checked and unchecked colour come from `--md-sys-color-primary` and `--md-sys-color-outline`, so a theme moves the switch with everything else.",
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
  ],
  aria: [
    'The root sets `role="switch"` and reflects state as `aria-checked`.',
    "Space and Enter toggle it; the native button semantics carry the keyboard behaviour.",
    "It is focusable and shows a `:focus-visible` ring. The state is also carried in `data-checked`, so a label styled with the switch cannot drift from it.",
  ],
};
