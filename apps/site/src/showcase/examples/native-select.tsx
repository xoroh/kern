import { NativeSelect } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Native select examples — the browser's own dropdown.
 *
 * The trade this component makes is deliberate: how the list looks is the
 * browser's, and what a select means stays the platform's. What kern owns is
 * the field RECIPE — the height, the border and the surface, so a native
 * select sits level with the other fields in a form.
 */
export const NATIVE_SELECT_EXAMPLES: ExampleSpec[] = [
  {
    id: "native-select-options",
    title: "The platform dropdown, in the field recipe",
    description:
      "A real `<select>` with real `<option>`s: the value, the change event and the keyboard are the browser's. Kern supplies the box, so it lines up with the fields beside it.",
    render: () => (
      <NativeSelect
        className="w-full max-w-xs"
        aria-label="Sort order"
        defaultValue="recent"
      >
        <option value="recent">Most recent</option>
        <option value="oldest">Oldest first</option>
        <option value="name">Name</option>
      </NativeSelect>
    ),
    code: `<NativeSelect className="w-full max-w-xs" aria-label="Sort order" defaultValue="recent">
  <option value="recent">Most recent</option>
  <option value="oldest">Oldest first</option>
  <option value="name">Name</option>
</NativeSelect>`,
  },
];
