import type { ComponentDoc } from "../types";

export const sheetHandle: ComponentDoc = {
  slug: "sheet-handle",
  name: "Sheet handle",
  oneLiner:
    "Sheet handles are the small drag affordance drawn at the top of a sheet.",
  features:
    "Reach for a sheet handle when the sheet can be dragged and the affordance should say so. It is a fixed 32x4 pill on the reduced-emphasis variant colour — Material 3's handle, drawn as it is specified rather than approximated. The one rule that matters is the same one the rest of the family follows: only show the handle where dragging actually dismisses the sheet. A handle on a sheet that will not drag is a promise the interface does not keep, and every sheet in the family exposes a way to hide it for exactly that reason.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Sheet` is a side panel and carries no drag
    // handle. No export to name as a peer.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["SheetHandle"],
  customization: {
    supported: [
      "`className` is not the model here — the handle's look is Material 3's and comes from the resolved scheme.",
      "`testID` supplies the test hook, defaulting to `kern-sheet-handle`.",
    ],
    notSupported: [
      "There is no `size` or `color` prop. It is a 32x4 pill on `onSurfaceVariant` at reduced emphasis, and that is what makes it read as the Material 3 handle.",
      "There is no `onDrag` or `gesture` prop. The handle is the affordance; the dragging belongs to the sheet and the host.",
    ],
  },
  api: [
    {
      name: "testID",
      type: "string",
      default: '"kern-sheet-handle"',
      note: "The test hook. Has a default, so tests can find the handle without the caller naming it.",
    },
  ],
  aria: [
    "The handle is hidden from assistive tech — `accessibilityElementsHidden` is set on it.",
    "That is the right treatment: a drag affordance is a visual hint for people who can see it, and the dismissal itself is available through the scrim and hardware back regardless.",
    "It has no name and needs none. The sheet's `title` is what announces the surface.",
  ],
};
