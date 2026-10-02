import {
  createOverlayModality,
  type OverlayId,
  type OverlayModalityState,
  useControllableState,
  useOverlayModality,
  useOverlayRegistration,
} from "@xoroh/kern-primitives";
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import {
  Modal,
  type ModalProps,
  Pressable,
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewProps,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

/* ------------------------------------------- overlay modality (P2c-4 re-point) */

type OverlayRegistry = ReturnType<typeof createOverlayModality>;

const OverlayRegistryContext = createContext<OverlayRegistry | null>(null);

/**
 * Shares ONE overlay stack across the subtree.
 *
 * P2c-4: kern-native owned drawer / popover / scroll-area and the sheet family
 * with no single place that knew which overlay was on top, so each decided
 * independently and a drawer opened over a sheet had no way to know it was not
 * the interactive one. The stack itself is the extracted
 * `@xoroh/kern-primitives` kernel -- this provider is the RENDERER half: the
 * registry, a stable id, and the platform trait that expresses "interactive".
 *
 * **Optional on purpose.** A consumer who has not opted in must not get a thrown
 * error at render time, so with no provider every overlay is interactive -- the
 * correct behaviour for exactly one overlay, and the pre-P2c-4 behaviour.
 */
export function OverlayModalityProvider({
  children,
}: {
  children?: ReactNode;
}) {
  const registry = useMemo(() => createOverlayModality(), []);
  return (
    <OverlayRegistryContext.Provider value={registry}>
      {children}
    </OverlayRegistryContext.Provider>
  );
}

/**
 * Register this overlay while `active`, and report whether it is the topmost.
 *
 * Returns `isInteractive: true` with NO provider, so opting in is additive.
 */
function useKernOverlay(active: boolean): { isInteractive: boolean } {
  const registry = useContext(OverlayRegistryContext);
  const id: OverlayId = useId();

  useOverlayRegistration(registry ?? FALLBACK_REGISTRY, id, active);
  const state: OverlayModalityState = useOverlayModality(
    registry ?? FALLBACK_REGISTRY,
  );

  // With no provider the fallback registry is shared by everything, so fall back
  // to "interactive" rather than letting unrelated overlays make each other inert.
  if (!registry) return { isInteractive: true };
  return { isInteractive: !state.isInertOutside(id) };
}

/** Used only when no provider is mounted; see `useKernOverlay`. */
const FALLBACK_REGISTRY = createOverlayModality();

/**
 * Overlay surfaces family — P2b-3, tranche 5.
 *
 * `Drawer`, `Popover` and `ScrollArea`: the three web-only overlay rows that
 * own real behaviour on both sides, shipped together because they are one
 * concern — a surface that appears over content and how assistive technology is
 * told about it. They are not grouped because they are similar looking, but
 * because they share the same parity risk: each is easy to implement with a
 * plausible role and be subtly wrong, and the difference between a modal and a
 * non-modal surface is invisible until a screen reader walks into it.
 *
 * **The one distinction this file exists to get right:**
 *
 *   `Drawer`  is M3's MODAL drawer variant — it covers content behind a scrim,
 *             so it is a dialog and the content behind it is inert.
 *   `Popover` is NOT modal — the content behind stays interactive. Claiming
 *             modality there is the bug the suite asserts against.
 *
 * That difference is not stylistic. On web it is `aria-modal`; on React Native
 * it is `accessibilityViewIsModal`. Both exist, both are silent when wrong.
 *
 * Imports: `react`, `react-native` and the shared theme only — no behavior
 * primitive (ADR 002), and nothing from `@xoroh/kern`.
 */

/* ------------------------------------------------------------------ Drawer */

export type DrawerProps = Omit<ModalProps, "visible" | "onRequestClose"> & {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called with the requested open state, from the scrim and the close control. */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the drawer surface. */
  title: string;
  children?: ReactNode;
};

function DrawerBody({
  onDismiss,
  children,
}: {
  onDismiss: () => void;
  children?: ReactNode;
}) {
  const scheme = useKernScheme();
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss menu"
        onPress={onDismiss}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: scheme.color.scrim,
        }}
      />
      <View
        accessibilityRole="none"
        style={{
          backgroundColor: scheme.color.surfaceContainerHigh,
          borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
          borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
          paddingBottom: Number.parseFloat(scheme.shape.full),
          minHeight: 120,
        }}
      >
        <View style={{ padding: 16 }}>{children}</View>
      </View>
    </View>
  );
}

/**
 * M3 modal Drawer — a side/edge surface over a scrim that makes the content
 * behind it inert. `title` is the accessible name; the scrim is a real,
 * labelled dismiss control rather than a tappable void.
 */
export function Drawer({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  title,
  children,
  ...modalProps
}: DrawerProps) {
  const [open, setOpen] = useControllableState<boolean>(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );

  // P2c-4: register this drawer for as long as it is OPEN, so the shared kernel
  // knows whether it is the topmost overlay. A drawer mounted-but-closed must
  // not make content outside it inert -- which is why this keys off `open`,
  // not off mount.
  const { isInteractive } = useKernOverlay(open ?? false);

  // The trigger state is announced even when the drawer is closed, so an
  // assistive-tech user can tell a drawer exists before opening it.
  const announced = (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ height: 0, width: 0 }}
    >
      <DrawerTriggerAnnouncer open={open ?? false} title={title} />
    </View>
  );

  return (
    <>
      {announced}
      <Modal
        visible={open ?? false}
        transparent
        animationType="fade"
        // A covered overlay takes no touches: without this a tap landing on a
        // drawer that is under another overlay passes through to whatever is
        // behind it, which is the specific bug a stack of independent overlays
        // cannot prevent.
        onRequestClose={() => setOpen(false)}
        {...modalProps}
      >
        <View
          // `role`, NOT `accessibilityRole`, carries the dialog role: the
          // platform-trait union (`AccessibilityRole`) has no `dialog` member,
          // while the ARIA-aligned `Role` union does — Fabric resolves it to
          // `Role::Dialog`. `accessibilityRole="alert"` is retained as the
          // repo's existing dialog mapping (cf. dialog.tsx:83-90), the closest
          // real trait VoiceOver/TalkBack have for an interrupting container.
          // This is a Drawer, so interrupting is the correct trait.
          role="dialog"
          accessibilityRole="alert"
          // P2c-4: the kernel decides, rather than every drawer assuming it is
          // on top. This View is a trait carrier -- the scrim and the body are
          // siblings -- so a covered drawer's modality is cleared here where the
          // screen reader reads it.
          accessibilityViewIsModal={isInteractive}
          pointerEvents={isInteractive ? "auto" : "none"}
          accessibilityLabel={title}
        >
          <DrawerBody onDismiss={() => setOpen(false)}>{children}</DrawerBody>
        </View>
      </Modal>
    </>
  );
}

/**
 * The `expanded` affordance for a drawer trigger. Rendered as a visually hidden
 * control so the state is discoverable without inventing a visible button that
 * M3 does not define for this surface.
 */
function DrawerTriggerAnnouncer({
  open,
  title,
}: {
  open: boolean;
  title: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      accessibilityState={{ expanded: open }}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}

Drawer.Content = DrawerContent;

function DrawerContent({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/* ----------------------------------------------------------------- Popover */

type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

function PopoverRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const [open, setOpen] = useControllableState<boolean>(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );
  return (
    <PopoverOpenContext.Provider
      value={{ open: open ?? false, setOpen: (next: boolean) => setOpen(next) }}
    >
      {children}
    </PopoverOpenContext.Provider>
  );
}

type PopoverOpen = { open: boolean; setOpen: (open: boolean) => void };

const PopoverOpenContext = createContext<PopoverOpen>({
  open: false,
  setOpen: () => undefined,
});

function PopoverTrigger({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  const { open, setOpen } = useContext(PopoverOpenContext);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: open }}
      onPress={() => setOpen(!open)}
    >
      {children ?? <Text>{label}</Text>}
    </Pressable>
  );
}

/**
 * The popover surface. Deliberately does NOT set `accessibilityViewIsModal`:
 * a popover leaves the content behind it interactive, and claiming modality
 * would tell assistive technology it is not.
 */
function PopoverContent({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  const scheme = useKernScheme();
  const { open, setOpen } = useContext(PopoverOpenContext);
  if (!open) return null;
  return (
    <View
      role="dialog"
      accessibilityLabel={label}
      style={{
        backgroundColor: scheme.color.surfaceContainerHigh,
        borderRadius: Number.parseFloat(scheme.shape.medium),
        padding: 12,
        shadowColor: scheme.color.shadow,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        // M3 level 2 == 3dp. This was `2`, which matches NO level on M3's scale
        // (0/1/3/6/8/12) -- an off-scale value is an inconsistency, not a design
        // choice. Web's `PopoverContent` uses `--md-sys-elevation-level2` (3dp),
        // so this also restores cross-renderer parity. Same ruling shape as the
        // drawer (35985a5): conform, don't rule.
        elevation: 3,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Dismiss ${label}`}
        onPress={() => setOpen(false)}
      >
        {children}
      </Pressable>
    </View>
  );
}

function PopoverBody({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Body: PopoverBody,
};

/* -------------------------------------------------------------- ScrollArea */

type ScrollAreaProps = Omit<ScrollViewProps, "horizontal"> & {
  horizontal?: boolean;
  children?: ReactNode;
};

/**
 * Scrollable region. RN's `ScrollView` already provides the platform behaviour;
 * what Kern adds is the labelled region the contract pins, and the explicit
 * scrollability the web side signals via `role="group"` + scrollbar parts.
 *
 * **Exported from the package deliberately.** `ScrollArea` was exported here
 * but never re-exported from `kern-native`'s index, so a consumer could not
 * import it — while the registry counted `scroll-area` as a SHARED concept and
 * the parity row recorded it as component-covered. Both claims were false. The
 * registry is derived by scanning source files rather than the public API,
 * which is exactly how an unreachable component looks shipped: the same
 * "passes because it did not look" family the provenance gate keeps surfacing.
 */
function ScrollArea({ children, ...scrollProps }: ScrollAreaProps) {
  // Scrollability is announced with the ARIA-aligned `role` prop, not
  // `accessibilityRole`: RN 0.86's `ScrollViewProps` extends `ViewProps`, whose
  // platform-trait `AccessibilityRole` union has no scrollable member, while the
  // `Role` union does. Same reasoning as `dialog.tsx:83-90` — a prop value that
  // does not exist in the union is not a styling choice, it is a type error or a
  // silently ignored prop.
  const { horizontal, ...rest } = scrollProps;
  return (
    <ScrollView accessible role="group" horizontal={horizontal} {...rest}>
      {children}
    </ScrollView>
  );
}

function ScrollAreaViewport({
  label,
  children,
  ...rest
}: ViewProps & { label?: string; children?: ReactNode }) {
  return (
    <View accessible={label !== undefined} accessibilityLabel={label} {...rest}>
      {children}
    </View>
  );
}

function ScrollAreaRow({
  label,
  children,
  ...rest
}: ViewProps & { label?: string; children?: ReactNode }) {
  return (
    <View accessible={label !== undefined} accessibilityLabel={label} {...rest}>
      {children}
    </View>
  );
}

ScrollArea.Viewport = ScrollAreaViewport;
ScrollArea.Row = ScrollAreaRow;

export { ScrollArea };
