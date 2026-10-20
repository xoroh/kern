import { Toolbar } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * Toolbar examples — the bar of controls that act on the content below.
 *
 * The toolbar is a LANDMARK with a keyboard contract of its own: the bar is
 * one tab stop and the arrow keys move between the controls inside it. So the
 * example shows the group and the separator, because those are what make the
 * bar read as one thing rather than as loose buttons.
 *
 * WEB composition. The native toolbar is a React Native row of labelled
 * actions; the mobile page carries its own live demo.
 */
export const TOOLBAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "toolbar-actions-row",
    title: "One stop, with the arrows moving inside it",
    description:
      "The root is a `toolbar` landmark, so it needs an `aria-label` — two toolbars on a page are indistinguishable without one. The controls are real buttons, and the separator is decorative: the grouping is what a screen reader hears.",
    render: () => (
      <Toolbar.Root aria-label="Text formatting">
        <Toolbar.Group>
          <Toolbar.Button aria-label="Bold">
            <Icon name="format-bold" />
          </Toolbar.Button>
          <Toolbar.Button aria-label="Italic">
            <Icon name="format-italic" />
          </Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Toolbar.Button aria-label="Copy">
            <Icon name="content-copy" />
          </Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>
    ),
    code: `<Toolbar.Root aria-label="Text formatting">
  <Toolbar.Group>
    <Toolbar.Button aria-label="Bold"><Icon name="format-bold" /></Toolbar.Button>
    <Toolbar.Button aria-label="Italic"><Icon name="format-italic" /></Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Button aria-label="Copy"><Icon name="content-copy" /></Toolbar.Button>
  </Toolbar.Group>
</Toolbar.Root>`,
  },
];
