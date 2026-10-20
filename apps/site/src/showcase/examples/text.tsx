import { Text } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Text examples — one line of type at one of the typescale's styles.
 *
 * The axis is the typescale, not a size: every property a variant sets (size,
 * line height, letter spacing, weight) comes from the tokens together, so the
 * four never drift apart. `as` changes the ELEMENT, so semantics follow the
 * content's meaning rather than its size.
 *
 * WEB composition. The native `Text` is the same four styles over React
 * Native's `Text`; the mobile page carries its own live demo.
 */
export const TEXT_EXAMPLES: ExampleSpec[] = [
  {
    id: "text-type-scale",
    title: "Four styles, all off the typescale",
    description:
      "Body, label, title and headline. There is no `size` prop: a numeric size would mean the type had stopped following the system.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Text variant="headline">Headline small</Text>
        <Text variant="title">Title large</Text>
        <Text variant="body">Body medium — the M3 default.</Text>
        <Text variant="label">Label large</Text>
      </div>
    ),
    code: `<Text variant="headline">Headline small</Text>
<Text variant="title">Title large</Text>
<Text variant="body">Body medium — the M3 default.</Text>
<Text variant="label">Label large</Text>`,
  },
];
