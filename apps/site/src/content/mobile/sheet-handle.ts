import type { ComponentDoc } from "../types";

export const sheetHandle: ComponentDoc = {
  slug: "sheet-handle",
  name: "Sheet handle",
  oneLiner:
    "Sheet handles are the small drag affordance drawn at the top of a sheet.",
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
  // The handle is an AFFORDANCE, not a control: it is hidden from
  // assistive tech entirely and handles no keys. The drag belongs to the
  // sheet and the host.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is not the model here — the handle's look is Material 3's and comes from the resolved scheme.",
      "`testID` supplies the test hook, defaulting to `kern-sheet-handle`.",
    ],
    notSupported: [
      "There is no `size` or `color` prop. It is a fixed pill at the Material 3 handle size, on `onSurfaceVariant` at reduced emphasis, and that is what makes it read as the Material 3 handle.",
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
