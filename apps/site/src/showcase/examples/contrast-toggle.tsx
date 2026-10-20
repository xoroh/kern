import { ContrastToggle } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Contrast toggle examples — one action that requests a contrast change.
 *
 * The name says where the press GOES ("Use high contrast" while standard),
 * never where it is. The host owns the level: the toggle asks, the host
 * applies and re-renders with the new level.
 */
export const CONTRAST_TOGGLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "contrast-toggle-action",
    title: "Named for where the press goes",
    description:
      "`contrast` is the CURRENT level and the label is derived from it, so the two cannot drift. Nothing latches: the control requests the change, the host applies it.",
    package: "@xoroh/kern-native",
    render: () => <ContrastToggle contrast="standard" onToggle={() => {}} />,
    code: `<ContrastToggle contrast="standard" onToggle={() => {}} />`,
  },
];
