import { BottomSheetPicker } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Bottom sheet picker examples — the sheet that is a selector.
 *
 * The options are DATA and the selection is the CALLER's: `value` marks the
 * current pick and `onSelect` reports the next one. The sheet does not store
 * a selection of its own, so a host that needs the value somewhere else has
 * it.
 *
 * WEB composition. The native picker sheet is the same idea hosted in a React
 * Native `Modal`; the mobile page carries its own live demo.
 */
export const BOTTOM_SHEET_PICKER_EXAMPLES: ExampleSpec[] = [
  {
    id: "bottom-sheet-picker-options",
    title: "A sheet that is a selector",
    description:
      "The options are data and the pick is the caller's. The check mark carries the selection — never a differently coloured row — so the state survives a colour-blind reader and a dark theme alike.",
    render: () => (
      <BottomSheetPicker
        defaultOpen
        label="Sort by"
        title="Sort by"
        value="recent"
        options={[
          { value: "recent", label: "Most recent" },
          { value: "name", label: "Name" },
        ]}
        onSelect={() => {}}
      />
    ),
    code: `<BottomSheetPicker
  defaultOpen
  label="Sort by"
  title="Sort by"
  value="recent"
  options={[
    { value: "recent", label: "Most recent" },
    { value: "name", label: "Name" },
  ]}
  onSelect={() => {}}
/>`,
  },
];
