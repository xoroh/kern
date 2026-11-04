import { type ReactNode, useState } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { AlertDialog } from "./alert-dialog";
import { Dialog } from "./dialog";
import { BottomSheet, DockSheet, SnapSheet } from "./sheets";
import { Tabs } from "./tabs";
import { Text } from "./text";

/**
 * KernOverlay — ONE overlay system, native renderer (CL-015; D925).
 *
 * Same variant contract as web `KernOverlay`: `modal` / `sheet` /
 * `drawer` / `side-sheet` / `alert` / `tabbed-dialog` / `dock`.
 * Platform splits (recorded, not drifted):
 * - N renders every modal variant as a bottom-anchored sheet surface with
 *   snap/dock physics (sheet physics from system values; gorhom behaviour
 *   reference, MIT); W centers `modal`/`alert`/`tabbed-dialog`. `drawer`
 *   and `side-sheet` converge onto ONE bottom surface on N (a phone has no
 *   usable edge panel); W splits bottom vs edge.
 * - Scrim press + Android back ALWAYS dismiss on N (platform-owned `Modal`
 *   behaviour); `dismissible={false}` removes the visible × only. W also
 *   removes scrim dismissal. Escape-dismisssal is W-only (no Escape on N).
 * - `title`/`description` are strings on N (the Modal accessibility label
 *   requires one); W accepts rich nodes. Tab labels likewise.
 * - `snapPoints` are real detents on N (highest requested renders; the
 *   adjustable handle cycles them); W caps the sheet at the largest.
 *
 * M3: dialogs, bottom sheets, side sheets, tabs (see web twin for links).
 */

export type KernOverlayVariant =
  | "modal"
  | "sheet"
  | "drawer"
  | "side-sheet"
  | "alert"
  | "tabbed-dialog"
  | "dock";

export type KernOverlaySize = "sm" | "md" | "lg" | "full";

const SIZE_MAX_WIDTH: Record<KernOverlaySize, number | string> = {
  sm: 320,
  md: 480,
  lg: 560,
  full: "100%",
};

export type KernOverlayTab = {
  key: string;
  label: string;
  panel?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};

export type NativeKernOverlayProps = {
  variant?: KernOverlayVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Heading AND the Modal accessible name. Required, string on N. */
  title: string;
  description?: string;
  size?: KernOverlaySize;
  /**
   * Visible × affordance. Default `true`. N scrim/back dismissal is
   * platform-owned and always available (see module doc); W additionally
   * drops scrim dismissal when `false`.
   */
  dismissible?: boolean;
  /** Close-button action (DOMAIN action, not state). Renders the ×. */
  onClose?: () => void;
  snapPoints?: readonly number[];
  snapIndex?: number;
  defaultSnapIndex?: number;
  onSnapIndexChange?: (index: number) => void;
  tabs?: readonly KernOverlayTab[];
  activeTab?: string;
  defaultActiveTab?: string;
  onActiveTabChange?: (key: string) => void;
  /** Footer-actions slot: Cancel/Apply (`sheet`/`modal`/`tabbed-dialog`). */
  footer?: ReactNode;
  /** Trigger content. Wrapped in the opener; default trigger via `triggerLabel`. */
  trigger?: ReactNode;
  triggerLabel?: string;
  /** Alert decision labels (the alert slot's N expression; W uses `footer`). */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** ONE overlay system (native): modal/sheet/drawer/side-sheet/alert/tabbed-dialog/dock. */
export function KernOverlay({
  variant = "modal",
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  size = "md",
  dismissible = true,
  onClose,
  snapPoints,
  snapIndex,
  defaultSnapIndex,
  onSnapIndexChange,
  tabs = [],
  activeTab,
  defaultActiveTab,
  onActiveTabChange,
  footer,
  trigger,
  triggerLabel,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
  style,
  testID,
}: NativeKernOverlayProps) {
  const scheme = useKernScheme();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? variant === "dock",
  );
  const openValue = open ?? uncontrolledOpen;
  const reportOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const requestClose = () => {
    onClose?.();
    reportOpen(false);
  };

  const opener =
    trigger !== undefined || triggerLabel !== undefined ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={triggerLabel ?? title}
        onPress={() => reportOpen(true)}
        style={{ minHeight: 48, justifyContent: "center" }}
      >
        {trigger ?? <Text variant="label">{triggerLabel ?? title}</Text>}
      </Pressable>
    ) : null;

  if (variant === "dock") {
    return (
      <>
        {opener}
        <DockSheet
          open={openValue}
          onOpenChange={reportOpen}
          onDismiss={onClose}
          testID={testID ?? "kern-overlay-dock"}
          style={style}
        >
          <Text variant="label">{title}</Text>
          {children}
        </DockSheet>
      </>
    );
  }

  if (variant === "sheet" || variant === "drawer" || variant === "side-sheet") {
    // N converges drawer + side-sheet onto the bottom-sheet surface: an
    // edge panel is unusable on a phone. W keeps the edge/bottom split.
    if (snapPoints && snapPoints.length > 0) {
      return (
        <>
          {opener}
          <SnapSheet
            open={openValue}
            onOpenChange={reportOpen}
            onDismiss={onClose}
            title={title}
            snapPoints={snapPoints.map((fraction) => ({
              fraction,
              label: `${Math.round(fraction * 100)} percent`,
            }))}
            value={snapIndex}
            defaultValue={defaultSnapIndex}
            onValueChange={onSnapIndexChange}
            testID={testID ?? "kern-overlay-sheet"}
            style={style}
          >
            {description ? (
              <Text
                variant="label"
                style={{ color: scheme.color.onSurfaceVariant }}
              >
                {description}
              </Text>
            ) : null}
            {children}
            {footer}
          </SnapSheet>
        </>
      );
    }
    return (
      <>
        {opener}
        <BottomSheet
          open={openValue}
          onOpenChange={reportOpen}
          onDismiss={onClose}
          title={title}
          handle={dismissible}
          actions={footer}
          testID={testID ?? "kern-overlay-sheet"}
          style={style}
        >
          {description ? (
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {description}
            </Text>
          ) : null}
          {children}
        </BottomSheet>
      </>
    );
  }

  if (variant === "alert") {
    return (
      <>
        {opener}
        <AlertDialog
          open={openValue}
          onOpenChange={reportOpen}
          onDismiss={onClose}
          title={title}
          message={description}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel ?? "Dismiss"}
          onConfirm={onConfirm}
          onCancel={onCancel}
          testID={testID ?? "kern-overlay-alert"}
          style={style}
        />
      </>
    );
  }

  // `modal` and `tabbed-dialog` share the centered dialog shell; the tabbed
  // scaffold adds the tab strip + panels under the title.
  const isTabbed = variant === "tabbed-dialog";
  return (
    <>
      {opener}
      <Dialog
        open={openValue}
        onOpenChange={reportOpen}
        onDismiss={onClose}
        title={title}
        testID={testID ?? "kern-overlay"}
        style={[{ maxWidth: SIZE_MAX_WIDTH[size] }, style]}
      >
        {description ? (
          <Text
            variant="label"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {description}
          </Text>
        ) : null}
        {isTabbed && tabs.length > 0 ? (
          <Tabs
            tabs={tabs
              .filter((tab) => !tab.disabled)
              .map((tab) => ({
                value: tab.key,
                label: tab.label,
                content: tab.panel,
              }))}
            value={activeTab}
            defaultValue={defaultActiveTab}
            onValueChange={onActiveTabChange}
          />
        ) : null}
        {children}
        {footer}
        {/* The × renders only for an explicit `onClose` (same rule as W):
            N scrim/back dismissal is platform-owned and always available,
            so an unrequested × would be a second way out of every dialog. */}
        {onClose ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={requestClose}
            style={{
              minWidth: 48,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text variant="label">×</Text>
          </Pressable>
        ) : null}
      </Dialog>
    </>
  );
}
