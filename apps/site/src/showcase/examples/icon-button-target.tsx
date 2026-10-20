import { IconButton, IconButtonTarget } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Icon button target examples — the wrapper that guarantees the hit area.
 *
 * The wrapper is not pressable itself: it enlarges the AREA, and the control
 * inside keeps its own name and role. On this renderer the platform minimum
 * touch target is the floor, and the wrapper is that floor.
 */
export const ICON_BUTTON_TARGET_EXAMPLES: ExampleSpec[] = [
  {
    id: "icon-button-target-wrap",
    title: "A small button, a full target",
    description:
      "The wrapper brings the control up to the platform minimum touch target without changing the control's own box. The button inside keeps its name and its role.",
    package: "@xoroh/kern-native",
    render: () => (
      <IconButtonTarget>
        <IconButton label="Add" variant="filled">
          +
        </IconButton>
      </IconButtonTarget>
    ),
    code: `<IconButtonTarget>
  <IconButton label="Add" variant="filled">
    +
  </IconButton>
</IconButtonTarget>`,
  },
];
