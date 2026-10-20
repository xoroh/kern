import { AspectRatio, Text } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * AspectRatio examples — a box that keeps its shape.
 *
 * `ratio` is width divided by height, so `16 / 9` is widescreen and `1` is
 * square. The height follows the measured width, so the box is right at
 * every screen size without the caller recalculating anything.
 */
export const ASPECT_RATIO_EXAMPLES: ExampleSpec[] = [
  {
    id: "aspect-ratio-box",
    title: "A box that holds its ratio",
    description:
      "Reserving the space up front is an accessibility matter as much as a visual one: a layout that shifts under a pointer or a focus ring moves the target.",
    render: () => (
      <AspectRatio ratio={16 / 9} style={{ width: 240 }}>
        <Text>16 / 9</Text>
      </AspectRatio>
    ),
    code: `<AspectRatio ratio={16 / 9} style={{ width: 240 }}>
  <Text>16 / 9</Text>
</AspectRatio>`,
    package: "@xoroh/kern-native",
  },
];
