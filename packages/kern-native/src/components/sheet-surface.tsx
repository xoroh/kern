import {
  createDismissPolicy,
  dismissBranchesFor,
  shouldDismissOn,
} from "@xoroh/kern-primitives";
import type { ReactNode } from "react";
import { type ElementRef, useRef } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Modal,
  Pressable,
  Text as RNText,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { overlayStyles } from "../utils/overlay-styles";
import { useKernOverlay } from "./overlay-surfaces";
import { describeAutofocus, useKernPortalRegistration } from "./presentation";

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
  /**
   * R2 lexicon: state callback for visibility. Every dismissal path below
   * calls `onDismiss()` AND `onOpenChange(false)` — one close path, both
   * callbacks, so a host on either name hears it. Uncontrolled state is the
   * host's (sheets are controlled-only); this reports, it does not store.
   */
  onOpenChange?: (open: boolean) => void;
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
  /**
   * The close affordance's glyph. A prop rather than kern's themed `<Text>` so
   * this component stops reaching `tokens.typography` and becomes
   * extraction-ready.
   *
   * Two reasons this is the better API, not just the convenient one:
   *  - A close button's appearance is the caller's business. A sheet that wants a
   *    real icon button, a themed label, or nothing at all can now say so.
   *  - The hardcoded `×` was doing double duty as both the visual and the only
   *    rendering, so the accessible name came from `closeLabel` while the visible
   *    glyph was fixed. Those can now disagree, which is the caller's call.
   *
   * Defaults to an `×` in the platform's own Text — NOT kern's, which would
   * re-couple this file to the token engine. RN's Text is a layout primitive and
   * reads no kern token. (A bare string is not an option: React Native rejects a
   * raw string inside a View, which the Pressable is.)
   */
  closeGlyph?: ReactNode;
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
  onOpenChange,
  surface,
  testID,
  handle,
  dismissible,
  closeLabel,
  closeGlyph = <RNText>×</RNText>,
  placement = "bottom",
  style,
}: SheetSurfaceProps) {
  // The dismissal DECISION is the shared `dismiss-policy` primitive
  // (P2c-2 Wave 1); the triggers below stay native. This line used to encode
  // the rule by hand — `dismissible ?? Boolean(onDismiss)` — which is the
  // `useControllableState` failure mode repeating: the web surface derives the
  // same rule differently, so a fix to one did not reach the other.
  //
  // `open` is threaded through `shouldDismiss` rather than by nulling the
  // handlers: a trigger bound to a CLOSED surface must do nothing, and
  // unbinding it would change what the tree renders.
  const policy = createDismissPolicy({
    dismissible,
    hasDismissHandler: Boolean(onDismiss),
  });
  // The BRANCHES the surface wires, from the shared dismiss-wiring kernel: a
  // modal dismissible surface wires every branch, so the scrim Pressable, the
  // system back handler and the close control each fire through the branch
  // they declare. `open` is threaded through `shouldDismissOn` rather than by
  // nulling the handlers: a trigger bound to a CLOSED surface must do nothing,
  // and unbinding it would change what the tree renders.
  const branches = dismissBranchesFor({
    modal: true,
    dismissible: policy.canDismiss,
    hasVisibleClose: policy.showClose,
  });
  const fires = (
    source: "outside-pointer" | "system-back" | "close",
  ): boolean => shouldDismissOn(source, open, branches);
  // R2 lexicon: the single close path — dismissal action plus state report.
  const notifyDismiss = () => {
    onDismiss?.();
    onOpenChange?.(false);
  };
  const dismiss = fires("outside-pointer") ? notifyDismiss : undefined;

  // D3a: register this sheet for as long as it is OPEN, so the shared kernel
  // knows a modal is on screen (Drawer precedent). Registration only — the
  // sheet's own modality/pointer handling is unchanged; what this buys is the
  // app-side `useAnyModalOpen` signal for background inerting. Keys off `open`,
  // not mount: a mounted-but-closed sheet must not inert the background.
  useKernOverlay(open);

  // DUAL-PATH (D12): `Modal` keeps presenting the surface; the owned portal
  // registry ALSO tracks it while open, so the kernel can observe which
  // overlays are on screen (ordering, modality) on both renderers.
  useKernPortalRegistration(testID, open);

  // D2: RN `Modal` presents the window but never moves the accessibility
  // cursor — without this, TalkBack focus stays on the background control that
  // opened the sheet (measured live: the green ring never enters
  // BottomSheet/BottomSheetPicker). Web inherits Base UI's auto-focus; native
  // must do it explicitly. `onShow` fires on presentation, so no
  // timer-to-animation guessing (`animationType="slide"`).
  //
  // Target: the close control when the policy renders one (first in tab order,
  // always actionable — the APG "focus to first focusable" shape). Otherwise
  // the card container, best-effort: a plain `View` takes no focus, so a
  // missing tag is a silent no-op rather than a defect. The card is
  // deliberately NOT marked `accessible` to make it focusable — that would
  // collapse the sheet's children into one Android node (the D4 class).
  //
  // The TARGET is the shared focus-trap kernel's autofocus event over the
  // stop list `[close?, card]`: index 0 is the close control exactly when the
  // policy renders one. The focusing ACT stays native (refs + the focus tag).
  const autofocus = describeAutofocus({ hasCloseControl: policy.showClose });
  const closeRef = useRef<ElementRef<typeof Pressable>>(null);
  const cardRef = useRef<ElementRef<typeof View>>(null);
  const moveFocusInside = () => {
    const closeStop =
      autofocus.type === "focus-stop" &&
      autofocus.index === 0 &&
      policy.showClose;
    const node = closeStop
      ? (closeRef.current ?? cardRef.current)
      : cardRef.current;
    const tag = node ? findNodeHandle(node) : null;
    if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
  };
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      accessibilityViewIsModal
      onShow={moveFocusInside}
      onRequestClose={fires("system-back") ? notifyDismiss : undefined}
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
          onPress={dismiss}
          style={{ flex: 1 }}
        />
        <View testID={testID} ref={cardRef} style={[surface, style]}>
          {policy.showClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={closeLabel ?? `Close ${title}`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              ref={closeRef}
              onPress={fires("close") ? notifyDismiss : undefined}
              style={{
                alignSelf: "flex-end",
                minWidth: 48,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {closeGlyph}
            </Pressable>
          ) : null}
          {handle}
          {children}
        </View>
      </View>
    </Modal>
  );
}
