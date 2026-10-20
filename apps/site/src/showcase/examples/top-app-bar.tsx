import { TopAppBar } from "@xoroh/kern/start";
import type { ExampleSpec } from "../example";

/**
 * Top app bar examples — the screen's header.
 *
 * The bar is three slots: a leading affordance, the title, and the trailing
 * actions. The example has to show the slots rather than a bar with a word
 * in it, because the slots are the whole API — `size` is the only other
 * decision, and it changes the height, not the shape.
 *
 * WEB composition. `@xoroh/kern/start` is the composition tier, so the bar is
 * a shell composition rather than a primitive; the native top app bar is a
 * React Native surface and the mobile page carries its own live demo.
 */
export const TOP_APP_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "top-app-bar-header",
    title: "Leading slot, title, trailing actions",
    description:
      "The title is the children, so it is what names the screen for a screen reader. The slots are yours: the leading affordance and the trailing actions are whatever the screen needs, and `size` picks one of Material 3's three bar heights.",
    package: "@xoroh/kern/start",
    render: () => (
      <TopAppBar
        leading={<span aria-hidden="true">☰</span>}
        trailing={<span aria-hidden="true">⋯</span>}
      >
        Kern
      </TopAppBar>
    ),
    code: `<TopAppBar
  leading={<span aria-hidden="true">☰</span>}
  trailing={<span aria-hidden="true">⋯</span>}
>
  Kern
</TopAppBar>`,
  },
];
