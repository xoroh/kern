import type { ComponentDoc } from "../types";

export const iconButton: ComponentDoc = {
  slug: "icon-button",
  name: "Icon button",
  oneLiner:
    "Icon buttons are buttons whose only content is an icon, so their name must be supplied.",
  features:
    "Reach for an icon button where the action is unmistakable from its glyph and space is tight: a close, a favourite, an overflow. The one rule is in the type: `label` is REQUIRED, because there is no visible text to supply a name. That is the whole accessibility contract and it is enforced rather than documented — an icon-only button with no name is the most common inaccessible control there is, and here you cannot ship one. There is also a toggle form with controlled `pressed`, so a favourite button is the same component as a close button rather than a second thing to learn.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "IconButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["IconButton"],
  customization: {
    supported: [
      "`label` is required and is the accessible name.",
      "`variant` is the container treatment.",
      "The toggle form takes a controlled `pressed` state.",
    ],
    notSupported: [
      "There is no `label`-less mode. The name is required by the type, not by convention.",
      "There is no text alongside the icon. A button with icon AND text is a `Button`.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "REQUIRED. The accessible name — there is no visible text to supply one. The type enforces what the web usually leaves to review.",
    },
    {
      name: "variant",
      type: "IconButtonVariant",
      note: "The container treatment.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The icon element.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "The toggle form: controlled pressed state. Same component as the plain button, so a favourite and a close are one thing to learn.",
    },
    {
      name: "style",
      type: "PressableProps['style']",
      note: "React Native pressable styles.",
    },
  ],
  aria: [
    "`label` required is the accessibility contract, enforced in the type rather than left to review — an unnamed icon button is the most common inaccessible control there is.",
    "It is pressable, so the whole control is the target — which matters more here than anywhere, since an icon gives a smaller visual target than text would.",
    "The toggle form reports its pressed state, so a favourite button says whether it is on rather than only changing colour.",
  ],
};
