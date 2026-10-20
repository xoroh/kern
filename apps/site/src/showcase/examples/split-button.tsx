import { SplitButton } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Split button examples — one action, plus a menu of its siblings.
 *
 * The two halves are TWO controls with two names: the primary is a button
 * named by `label`, the overflow is a second one named by `menuLabel`. M3 is
 * explicit that a split button must not be one element with two hit regions,
 * because a single element can be announced as neither.
 */
export const SPLIT_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "split-button-primary-and-overflow",
    title: "One action, and a menu of its siblings",
    description:
      "The primary half is the action people mean most of the time, and the overflow half opens a menu of the alternatives. An empty `actions` list renders no overflow half at all, so a split button with nothing to split degrades to a plain button rather than a dead second half.",
    render: () => (
      <SplitButton
        label="Save"
        menuLabel="More save options"
        onClick={() => {}}
        actions={[
          { key: "copy", label: "Save a copy" },
          { key: "draft", label: "Save as draft", separated: true },
        ]}
      />
    ),
    code: `<SplitButton
  label="Save"
  menuLabel="More save options"
  onClick={() => {}}
  actions={[
    { key: "copy", label: "Save a copy" },
    { key: "draft", label: "Save as draft", separated: true },
  ]}
/>`,
  },
];
