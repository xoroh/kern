import type { ComponentDoc } from "../types";

export const iconButton: ComponentDoc = {
  slug: "icon-button",
  name: "Icon button",
  oneLiner:
    "Icon buttons are buttons whose only content is an icon, so their name must be supplied.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "IconButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["IconButton"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the button when it is reached with an external keyboard or switch control.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves to the button and activates it; in the toggle form the press flips the state that `aria-selected` carries.",
    },
  ],
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
