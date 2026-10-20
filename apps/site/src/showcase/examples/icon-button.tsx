import { IconButton } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * IconButton examples — a button whose content is one glyph.
 *
 * The variant axis is EMPHASIS, never meaning: the same action in four
 * weights. `label` is the accessible name, and it is the prop that makes a
 * glyph-only button usable at all.
 */
export const ICON_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "icon-button-variants",
    title: "Four emphases, one name",
    description:
      'A glyph-only button with no name is announced as "button" and means nothing. `label` supplies the name; `variant` chooses how loud the button is, never what it does.',
    render: () => (
      <>
        <IconButton label="Add" variant="standard" icon={<Icon name="add" />} />
        <IconButton label="Add" variant="filled" icon={<Icon name="add" />} />
        <IconButton label="Add" variant="tonal" icon={<Icon name="add" />} />
        <IconButton label="Add" variant="outlined" icon={<Icon name="add" />} />
      </>
    ),
    code: `<IconButton label="Add" variant="standard" icon={<Icon name="add" />} />
<IconButton label="Add" variant="filled" icon={<Icon name="add" />} />
<IconButton label="Add" variant="tonal" icon={<Icon name="add" />} />
<IconButton label="Add" variant="outlined" icon={<Icon name="add" />} />`,
  },
];
