import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { overlayStyles } from "../utils/overlay-styles";
import { Text } from "./text";

/**
 * The shared Modal + scrim primitive for the kern sheet family (P2b-2).
 *
 * ## Why this exists
 *
 * Every Modal-hosted sheet in `sheets.tsx` was repeating the same five
 * elements: `Modal` → `View(bottomScrim)` → `Pressable` scrim → card `View`.
 * Four sheets carried four copies of that shell, and `MenuSheet`,
 * `AppsSheet` and `CreateSheet` were worse — they declared an `onDismiss`
 * prop and **never used it**. They rendered a bare `<View>` with no `Modal`,
 * no scrim and no dismissal path, so a caller passing `onDismiss` got a
 * sheet that could not be dismissed and trapped no focus.
 *
 * This component is the single place that wires scrim-press and
 * `onRequestClose` (Android back) to `onDismiss`. A sheet that is not hosted
 * here cannot silently drop its dismissal.
 */

export type SheetSurfaceProps = {
  /** Drives the Modal's visibility. */
  open: boolean;
  title: string;
  children?: ReactNode;
  /** Wired to BOTH scrim press and hardware back. */
  onDismiss?: () => void;
  /** The card body. Receives the scheme so cards read tokens, not literals. */
  surface: ViewStyle;
  testID: string;
  /** Hides the drag handle for sheets not dismissible by drag. */
  handle?: ReactNode;
  /**
   * Renders the M3 close affordance (a 48x48 icon button bound to
   * `onDismiss`). Defaults to `true` whenever `onDismiss` is supplied, so a
   * sheet that declares a dismissal path always has a visible way out. Set
   * `false` only for a sheet that is deliberately scrim/back-only.
   */
  dismissible?: boolean;
  /** Overrides the close button's accessible name. */
  closeLabel?: string;
  /** Places the card at the bottom edge (default) or centred. */
  placement?: "bottom" | "center";
  style?: StyleProp<ViewStyle>;
};

/**
 * A Modal-hosted surface with a working dismissal path. The scrim is a real
 * `Pressable` with an accessible label, and `onRequestClose` covers the
 * Android hardware back button — the two ways a user leaves a modal sheet.
 */
export function SheetSurface({
  open,
  title,
  children,
  onDismiss,
  surface,
  testID,
  handle,
  dismissible,
  closeLabel,
  placement = "bottom",
  style,
}: SheetSurfaceProps) {
  // M3 sheets offer a close affordance IN ADDITION to the scrim. Without one,
  // a touch-only user who does not know to tap outside the card has no way
  // out, and `onDismiss` becomes unreachable — the exact defect the scrim-only
  // shell shipped. Derived from `onDismiss` so a sheet cannot declare a
  // dismissal path and render no control for it.
  const showClose = dismissible ?? Boolean(onDismiss);
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      accessibilityViewIsModal
      onRequestClose={onDismiss}
    >
      <View
        style={
          placement === "bottom"
            ? overlayStyles.bottomScrim
            : overlayStyles.scrim
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Dismiss ${title}`}
          onPress={onDismiss}
          style={{ flex: 1 }}
        />
        <View testID={testID} style={[surface, style]}>
          {showClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={closeLabel ?? `Close ${title}`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={onDismiss}
              style={{
                alignSelf: "flex-end",
                minWidth: 48,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text variant="title">×</Text>
            </Pressable>
          ) : null}
          {handle}
          {children}
        </View>
      </View>
    </Modal>
  );
}
