import type { ComponentDoc } from "../types";

export const splitButton: ComponentDoc = {
  slug: "split-button",
  name: "Split button",
  oneLiner:
    "Split buttons pair one primary action with a list of alternatives, in two halves.",
  features:
    "Reach for a split button when there is one obvious action and a few near-neighbours: save and its variants, submit and its options. The left half does the primary thing and the right half opens the rest. Two details make it behave. The icon is hidden from assistive tech, because the primary action's name is `label` and an icon beside it is decoration — announcing both would say the same thing twice. And an empty `actions` list renders NO overflow half, so the control degrades to a plain button rather than showing a dead second half. `separated` on an action draws a divider above it, which is how a destructive choice stays away from the ordinary ones.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "SplitButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["SplitButton"],
  customization: {
    supported: [
      "`label` is the primary action AND its accessible name, so the two cannot disagree.",
      "`actions` are data — `key`, `label`, optional `icon`, `disabled`, `separated`, `onSelect`.",
      "`menuLabel` names the overflow trigger separately from the primary action.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop here.",
      "There is no `direction`. It is one primary half and one overflow half.",
      "There is no custom trigger for the overflow — it is the second half by construction.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "REQUIRED. The primary action, and ALSO the primary button's accessible name — one string, so the two can never disagree.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Inside the primary button and HIDDEN from assistive tech. The name is `label`; an icon beside it is decoration, and announcing both would say the same thing twice.",
    },
    {
      name: "actions",
      type: "NativeSplitButtonAction[]",
      note: "The overflow list. `NativeSplitButtonAction` is `{ key, label, icon?, disabled?, separated?, onSelect? }`. AN EMPTY LIST RENDERS NO OVERFLOW HALF — the control degrades to a plain button rather than showing a dead second half.",
    },
    {
      name: "menuLabel",
      type: "string",
      note: "The overflow trigger's accessible name. The two halves need two names.",
    },
    {
      name: "separated",
      type: "boolean",
      note: "On an action: draws a divider above it. How a destructive choice stays apart from the ordinary ones.",
    },
    {
      name: "style",
      type: "object",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The primary action's name is `label` and its icon is hidden, so the button announces once and clearly.",
    "`menuLabel` names the overflow half separately — two halves, two names, or the second is an unnamed control.",
    "An empty `actions` list removes the overflow half entirely. A visible control that opens nothing is worse than no control.",
    "`separated` keeps a destructive action visually apart, and each action carries its own `label` and `disabled` state.",
  ],
};
