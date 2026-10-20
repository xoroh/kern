import { SheetHandle } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * SheetHandle examples — the drag affordance at the top of a sheet.
 *
 * The handle is a VISUAL hint: it is hidden from assistive technology
 * (`accessibilityElementsHidden`), because a drag affordance means nothing
 * to someone who cannot drag, and the dismissal is available through the
 * scrim and the hardware back button regardless.
 */
export const SHEET_HANDLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "sheet-handle-affordance",
    title: "The pill that says “this sheet moves”",
    description:
      "The handle is drawn at the top of a sheet, at the Material 3 handle size and in `onSurfaceVariant` at reduced emphasis. It carries no name and needs none — the sheet's own title is what announces the surface.",
    render: () => (
      <div className="flex w-64 flex-col rounded-t-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) p-3">
        <SheetHandle />
      </div>
    ),
    code: `<SheetHandle />`,
    package: "@xoroh/kern-native",
  },
];
