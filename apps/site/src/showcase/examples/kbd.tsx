import { Kbd } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Kbd examples — a key, or a chord, in the shape of a key.
 *
 * The component renders the `<kbd>` element, so a screen reader reads the text
 * as user keyboard input rather than as ordinary words, and the text stays
 * selectable and copyable. A chord is several `Kbd` parts with a space
 * between them: there is no chord formatter to reach for, because how a
 * shortcut is written is a notation decision for the product.
 */
export const KBD_EXAMPLES: ExampleSpec[] = [
  {
    id: "kbd-chord",
    title: "A chord, one key per part",
    description:
      'The shortcut is text and the component renders the `<kbd>` element, so it reads as keyboard input and copies as prose. The chord is the caller\'s notation — a space between the parts, not a parsed "Mod+K".',
    render: () => (
      <>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </>
    ),
    code: `<Kbd>Ctrl</Kbd>
<Kbd>K</Kbd>`,
  },
];
