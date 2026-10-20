import { LinkButton } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Link button examples — the button treatment on a navigation control.
 *
 * It is a BRIDGE onto `Button`, not a second implementation: every axis
 * (variant, color, size, shape, block, loading, icon) is Button's, and the
 * render is Button's `href` branch. So the example's job is to show that the
 * destination is what makes it a link — the treatment says how it looks, the
 * label says where it goes.
 *
 * WEB composition. The native link button opens through `Linking` rather
 * than an anchor; the mobile page carries its own live demo.
 */
export const LINK_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "link-button-navigation",
    title: "A link wearing the button treatment",
    description:
      "`href` is required, so a link button can never be an action in disguise. There is no `asChild` here on purpose: compose routers by URL, because element takeover is what the composition rule forbids.",
    render: () => (
      <LinkButton href="/docs/components/button" variant="text">
        Read the button docs
      </LinkButton>
    ),
    code: `<LinkButton href="/docs/components/button" variant="text">
  Read the button docs
</LinkButton>`,
  },
];
