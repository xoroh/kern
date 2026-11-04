import type { MouseEvent, ReactElement, ReactNode } from "react";
import { cloneElement, useState } from "react";
import { cn } from "../utils/cn";
import {
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Dialog } from "./dialog";
import { Drawer } from "./drawer";
import { FOCUS_RING_CLASS } from "./focus-ring";
import { Sheet } from "./sheet";
import { BottomSheet, DockSheet, SnapSheet } from "./sheet-family";
import { Tabs } from "./tabs";

/**
 * KernOverlay — ONE overlay system (CL-015; D925 "one overlay").
 *
 * Variants (one contract, platform-split renderers):
 * - `modal` — centered dialog (W default; N centered modal).
 * - `sheet` — bottom-anchored surface (W `BottomSheet`; N bottom sheet).
 * - `drawer` — bottom-anchored large surface (W `Drawer` primitive; N sheet).
 * - `side-sheet` — edge-anchored panel, M3 side sheets (W `Sheet` side panel;
 *   N drawer surface). The P3 "side sheets" ask lands here: no new component.
 * - `alert` — interrupting confirmation (M3 2-action law: keep `footer` to
 *   one confirm + one dismiss).
 * - `tabbed-dialog` — modal with a tab strip under the title: the scaffold
 *   the 3 avatar-tab inventory copies converge onto. Tab labels accept any
 *   node (avatar + name included).
 * - `dock` — persistent bottom bar, NOT modal (W+N `DockSheet`): quick
 *   actions that peek from the edge and never take the interaction lock.
 *
 * Props: `size` (dialog widths), `dismissible` (scrim/outside dismissal;
 * Escape always dismisses per M3), `snapPoints` + snap index (N snap/dock
 * physics; W applies the largest detent as the sheet max-height),
 * `tabs` (tabbed-dialog scaffold).
 *
 * Slots: `trigger` / title+description+children (panel) / `footer`
 * (footer-actions). Open state is controlled (`open` + `onOpenChange`) or
 * uncontrolled (`defaultOpen`).
 *
 * M3: https://m3.material.io/components/dialogs,
 * https://m3.material.io/components/bottom-sheets,
 * https://m3.material.io/components/side-sheets,
 * https://m3.material.io/components/tabs
 */

export type KernOverlayVariant =
  | "modal"
  | "sheet"
  | "drawer"
  | "side-sheet"
  | "alert"
  | "tabbed-dialog"
  | "dock";

/** Dialog widths. `full` is near-viewport (M3 full-screen dialog stays a WP2a P3 verify item). */
export type KernOverlaySize = "sm" | "md" | "lg" | "full";

const OVERLAY_SIZES: Record<KernOverlaySize, string> = {
  sm: "w-[min(24rem,calc(100vw-2rem))]",
  md: "w-[min(35rem,calc(100vw-2rem))]",
  lg: "w-[min(48rem,calc(100vw-2rem))]",
  full: "w-[calc(100vw-2rem)]",
};

export type KernOverlayTab = {
  key: string;
  /** Tab label — text or an avatar + name composition. */
  label: ReactNode;
  /** Panel rendered when this tab is active. */
  panel?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};

export type KernOverlayProps = {
  variant?: KernOverlayVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Heading. Required: every overlay surface must be nameable. */
  title: ReactNode;
  description?: ReactNode;
  size?: KernOverlaySize;
  /**
   * Scrim/outside-press dismissal. Default `true`. Escape ALWAYS dismisses
   * (M3 back-dismissal); `false` only removes scrim dismissal and is
   * honoured by the dialog-root variants (`modal`, `drawer`, `side-sheet`,
   * `tabbed-dialog`). Bottom `sheet`/`dock` stay scrim-dismissible — M3
   * modal sheets have no non-dismissible form, so a blocking flow must use
   * `modal`. `alert` is always dismissible (the primitive omits the knob).
   */
  dismissible?: boolean;
  /**
   * Close-button action (R2 lexicon: a DOMAIN action, not state). Renders
   * the × control; fires when it activates. Omit it and no × renders.
   */
  onClose?: () => void;
  /** Edge for `side-sheet` (the `drawer` variant is bottom-anchored). */
  side?: "left" | "right";
  /** Modal root for `side-sheet`. Default `true`; `false` leaves the page interactive. */
  modal?: boolean;
  /**
   * Detents as a fraction of viewport height (0–1). With `variant="sheet"`
   * a provided `snapPoints` renders the snap surface instead of the plain
   * bottom sheet; N drives real snap physics, W caps the sheet at the
   * largest detent.
   */
  snapPoints?: readonly number[];
  snapIndex?: number;
  defaultSnapIndex?: number;
  onSnapIndexChange?: (index: number) => void;
  /** Tabbed-dialog scaffold: strip + panels. Only read by `tabbed-dialog`. */
  tabs?: readonly KernOverlayTab[];
  activeTab?: string;
  defaultActiveTab?: string;
  onActiveTabChange?: (key: string) => void;
  /** Footer-actions slot: Cancel/Apply, confirm/dismiss. */
  footer?: ReactNode;
  /**
   * Trigger slot: the element rendered AS the trigger (Base UI `render`
   * model — typically a `<button>`; never a bare string). The primitive
   * merges open/focus behaviour onto it, so focus-return on dismiss is
   * preserved. `sheet`/`dock` wrap it in an opener span instead (the
   * sheet-family surfaces own no trigger part).
   */
  trigger?: ReactElement;
  children?: ReactNode;
  /**
   * Accessible name for sheet-family surfaces when `title` is a node.
   * Defaults to the title text when `title` is a string.
   */
  label?: string;
  className?: string;
  testID?: string;
};

function withOpener(trigger: ReactElement, onOpen: () => void): ReactElement {
  const props = trigger.props as {
    onClick?: (event: MouseEvent) => void;
  };
  const onClick = (event: MouseEvent) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) onOpen();
  };
  return cloneElement(trigger, { onClick } as Record<string, unknown>);
}

function titleText(title: ReactNode, label?: string): string {
  if (label !== undefined) return label;
  return typeof title === "string" ? title : "Overlay";
}

function CloseButton({
  onClose,
  onRequestClose,
}: {
  onClose: () => void;
  onRequestClose: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        // Explicit dismissal always lands: the × is a deliberate act, not a
        // scrim accident, so `dismissible={false}` never blocks it. State
        // still flows through the single `reportOpen` channel.
        onClose();
        onRequestClose();
      }}
      aria-label="Close"
      className={
        "kern-overlay-close absolute end-4 top-4 grid size-12 place-items-center rounded-(--sys-shape-corner-full) text-(--sys-color-on-surface-variant) before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface-variant) hover:before:opacity-[var(--sys-state-hover)] " +
        FOCUS_RING_CLASS +
        " outline-none"
      }
    >
      <span aria-hidden="true">×</span>
    </button>
  );
}

/** ONE overlay system: modal/sheet/drawer/side-sheet/alert/tabbed-dialog/dock. */
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
  side = "right",
  modal = true,
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
  children,
  label,
  className,
  testID,
}: KernOverlayProps) {
  const surfaceLabel = titleText(title, label);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? false,
  );
  const openValue = open ?? uncontrolledOpen;
  const reportOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  // The sheet-family surfaces own no trigger part, so the trigger element
  // itself becomes the opener: its `onClick` is chained (inner behaviour
  // first — a consumer `preventDefault` vetoes the open), never wrapped in
  // a second interactive layer (no nested buttons, no static-element
  // handlers). Primitive-trigger variants use `render={trigger}` instead.
  const opener =
    trigger !== undefined ? withOpener(trigger, () => reportOpen(true)) : null;

  if (variant === "dock") {
    return (
      <>
        {opener}
        <DockSheet
          label={surfaceLabel}
          testID={testID ?? "kern-overlay-dock"}
          className={className}
        >
          {children}
        </DockSheet>
      </>
    );
  }

  if (variant === "sheet") {
    if (snapPoints && snapPoints.length > 0) {
      return (
        <>
          {opener}
          <SnapSheet
            open={openValue}
            onOpenChange={reportOpen}
            label={surfaceLabel}
            snapPoints={snapPoints}
            value={snapIndex}
            defaultValue={defaultSnapIndex}
            onValueChange={onSnapIndexChange}
            testID={testID ?? "kern-overlay-sheet"}
            className={className}
          >
            {children}
            {footer ? (
              <div
                data-slot="overlay-footer"
                className="flex justify-end gap-2 pt-2"
              >
                {footer}
              </div>
            ) : null}
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
          title={typeof title === "string" ? title : undefined}
          label={surfaceLabel}
          onClose={
            onClose
              ? () => {
                  onClose();
                  reportOpen(false);
                }
              : undefined
          }
          testID={testID ?? "kern-overlay-sheet"}
          className={className}
        >
          {typeof title !== "string" ? (
            <div
              data-slot="overlay-title"
              className="text-(--sys-typescale-title-large-font-size) font-semibold text-(--sys-color-on-surface)"
            >
              {title}
            </div>
          ) : null}
          {description ? (
            <p
              data-slot="overlay-description"
              className="text-sm text-(--sys-color-on-surface-variant)"
            >
              {description}
            </p>
          ) : null}
          {children}
          {footer ? (
            <div data-slot="overlay-footer" className="flex justify-end gap-2">
              {footer}
            </div>
          ) : null}
        </BottomSheet>
      </>
    );
  }

  if (variant === "drawer") {
    return (
      <Drawer.Root
        open={openValue}
        onOpenChange={reportOpen}
        disablePointerDismissal={!dismissible}
      >
        {trigger ? <Drawer.Trigger render={trigger} /> : null}
        <Drawer.Content
          data-testid={testID ?? "kern-overlay-drawer"}
          className={className}
        >
          {onClose ? (
            <CloseButton
              onClose={onClose}
              onRequestClose={() => reportOpen(false)}
            />
          ) : null}
          <Drawer.Title className="pe-12 text-(--sys-typescale-title-large-font-size) font-semibold text-(--sys-color-on-surface)">
            {title}
          </Drawer.Title>
          {description ? (
            <Drawer.Description className="text-sm text-(--sys-color-on-surface-variant)">
              {description}
            </Drawer.Description>
          ) : null}
          {children}
          {footer ? (
            <div data-slot="overlay-footer" className="flex justify-end gap-2">
              {footer}
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  if (variant === "side-sheet") {
    return (
      <Sheet.Root
        open={openValue}
        onOpenChange={reportOpen}
        modal={modal}
        disablePointerDismissal={!dismissible}
      >
        {trigger ? <Sheet.Trigger render={trigger} /> : null}
        <Sheet.Content
          side={side}
          modal={modal}
          data-testid={testID ?? "kern-overlay-side-sheet"}
          className={className}
        >
          {onClose ? (
            <CloseButton
              onClose={onClose}
              onRequestClose={() => reportOpen(false)}
            />
          ) : null}
          <Sheet.Title className="pe-12 text-(--sys-typescale-title-large-font-size) font-semibold text-(--sys-color-on-surface)">
            {title}
          </Sheet.Title>
          {description ? (
            <Sheet.Description className="text-sm text-(--sys-color-on-surface-variant)">
              {description}
            </Sheet.Description>
          ) : null}
          {children}
          {footer ? (
            <div data-slot="overlay-footer" className="flex justify-end gap-2">
              {footer}
            </div>
          ) : null}
        </Sheet.Content>
      </Sheet.Root>
    );
  }

  if (variant === "alert") {
    return (
      <AlertDialogRoot open={openValue} onOpenChange={reportOpen}>
        {trigger ? <AlertDialogTrigger render={trigger} /> : null}
        <AlertDialogContent
          data-testid={testID ?? "kern-overlay-alert"}
          className={className}
        >
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
          {children}
          {/* M3 2-action law: confirm + dismiss, never a button row. */}
          {footer ? (
            <div data-slot="overlay-footer" className="flex justify-end gap-2">
              {footer}
            </div>
          ) : (
            <div data-slot="overlay-footer" className="flex justify-end gap-2">
              <AlertDialogClose>Dismiss</AlertDialogClose>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialogRoot>
    );
  }

  // `modal` and `tabbed-dialog` share the centered dialog shell; the tabbed
  // scaffold adds the tab strip + panels under the title.
  const isTabbed = variant === "tabbed-dialog";
  return (
    <Dialog.Root
      open={openValue}
      onOpenChange={reportOpen}
      disablePointerDismissal={!dismissible}
    >
      {trigger ? <Dialog.Trigger render={trigger} /> : null}
      <Dialog.Content
        data-testid={testID ?? "kern-overlay"}
        className={cn(
          "kern-overlay",
          OVERLAY_SIZES[size],
          "relative",
          className,
        )}
      >
        {onClose ? (
          <CloseButton
            onClose={onClose}
            onRequestClose={() => reportOpen(false)}
          />
        ) : null}
        <Dialog.Title className="pe-12">{title}</Dialog.Title>
        {description ? (
          <Dialog.Description>{description}</Dialog.Description>
        ) : null}
        {isTabbed && tabs.length > 0 ? (
          <Tabs.Root
            value={activeTab}
            defaultValue={defaultActiveTab ?? tabs[0]?.key}
            onValueChange={(v) => onActiveTabChange?.(v as string)}
          >
            <Tabs.List aria-label={`${surfaceLabel} sections`}>
              {tabs.map((tab) => (
                <Tabs.Tab key={tab.key} value={tab.key} disabled={tab.disabled}>
                  {tab.label}
                  {tab.badge}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Panel key={tab.key} value={tab.key}>
                {tab.panel}
              </Tabs.Panel>
            ))}
          </Tabs.Root>
        ) : null}
        {children}
        {footer ? (
          <div
            data-slot="overlay-footer"
            className="flex justify-end gap-2 pt-2"
          >
            {footer}
          </div>
        ) : null}
      </Dialog.Content>
    </Dialog.Root>
  );
}
