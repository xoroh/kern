/**
 * Presentation hosts — the native bindings for the kernel presentation models.
 *
 * ## Dual-path, stated once
 *
 * Every host here binds a `@xoroh/kern-primitives` model to React Native
 * mechanics. None of them replaces a platform owner: `Modal` keeps presenting
 * overlays, `Pressable` keeps reporting presses, `onRequestClose` keeps
 * covering the system back button. These hosts are the OWNED path the kernel
 * offers alongside — adopted per surface where the surface owns its own
 * mechanics (sheets, close controls), never as a second implementation of
 * what the platform already does.
 *
 * This module is deliberately NOT barrel-exported: the generated registry
 * treats every barrel export as a component, and these are bindings, not
 * components. Surfaces import them directly.
 */

import {
  type A11yDir,
  type AutofocusEvent,
  createIdScope,
  createPortalRegistry,
  createPresenceModel,
  type DismissBranches,
  type DismissSource,
  type DismissWiringOptions,
  dismissBranchesFor,
  mergeSlotProps,
  type Placement,
  resolveAutofocus,
  resolveDir,
  resolveFloatingRect,
  resolvePortalTarget,
  shouldDismissOn,
  usePress,
} from "@xoroh/kern-primitives";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Text as RNText, type StyleProp, type TextStyle } from "react-native";

// ---------------------------------------------------------------------------
// VisuallyHidden — announced content with no visual footprint.
// ---------------------------------------------------------------------------

export type NativeVisuallyHiddenProps = {
  children?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
};

/**
 * Screen-reader-only text. RN has no `clip`, so the footprint collapses to a
 * 1x1 transparent node — present in the accessibility tree, invisible on
 * screen. A consumer `style` merges via the shared slot kernel: the hidden
 * geometry is the default the part supplies, and an explicit consumer
 * declaration wins per key.
 */
export function VisuallyHidden({
  children,
  style,
  testID,
}: NativeVisuallyHiddenProps) {
  const merged = mergeSlotProps<{ style?: TextStyle }>(
    {
      style: {
        position: "absolute",
        width: 1,
        height: 1,
        opacity: 0,
      },
    },
    { style: (style ?? undefined) as TextStyle | undefined },
  );
  return (
    <RNText
      testID={testID}
      accessible
      style={merged.style as StyleProp<TextStyle>}
    >
      {children}
    </RNText>
  );
}

// ---------------------------------------------------------------------------
// KernPortal — the owned portal registry, alongside `Modal`.
// ---------------------------------------------------------------------------

/** Module-singleton registry: every owned overlay on screen orders here. */
const kernPortalRegistry = createPortalRegistry();

/** Scoped ids for owned portals: `kern-portal-1`, never `kern-portal-0`. */
const kernPortalIds = createIdScope("kern-portal");

export function getKernPortalRegistry() {
  return kernPortalRegistry;
}

export function nextKernPortalId(): string {
  return kernPortalIds.nextId();
}

export function resolveKernPortalTarget(options?: {
  ownerProvided?: string;
}): string {
  return resolvePortalTarget({ ownerProvided: options?.ownerProvided });
}

/**
 * Register `id` in the owned registry while `active`, unregister on cleanup.
 * `Modal` keeps presenting the surface — this registration is what makes the
 * open overlay OBSERVABLE to the kernel (ordering, modality), the same facts
 * the web side reads off its own registry.
 */
export function useKernPortalRegistration(id: string, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    kernPortalRegistry.mount(id);
    return () => {
      kernPortalRegistry.unmount(id);
    };
  }, [id, active]);
}

// ---------------------------------------------------------------------------
// PresenceGate — exit suspension for self-mounted surfaces.
// ---------------------------------------------------------------------------

export type NativePresenceGateProps = {
  open: boolean;
  children?: React.ReactNode;
  render?: (state: {
    present: boolean;
    exiting: boolean;
    finishExit: () => void;
  }) => React.ReactNode;
};

/**
 * Native binding for the kernel presence model. Keeps `children` mounted
 * through the `exiting` window after `open` flips false; only the surface's
 * own exit signal (`finishExit`, from its Animated completion) unmounts.
 * `Modal`-presented surfaces do NOT use this — the modal owns their mount.
 */
export function PresenceGate({
  open,
  children,
  render,
}: NativePresenceGateProps) {
  const [model] = useState(() => createPresenceModel(open));
  const [state, setState] = useState(model.getState());
  useEffect(() => model.subscribe(() => setState(model.getState())), [model]);
  useEffect(() => {
    model.setOpen(open);
  }, [model, open]);
  if (state === "unmounted") return null;
  if (render)
    return (
      <>
        {render({
          present: true,
          exiting: state === "exiting",
          finishExit: () => model.finishExit(),
        })}
      </>
    );
  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// FocusTrap — autofocus events plus index moves, focusing stays native.
// ---------------------------------------------------------------------------

/**
 * Describe where focus goes when a modal surface presents: the kernel's
 * autofocus event over the surface's stop list. The caller performs the focus
 * (refs + `setAccessibilityFocus`) — the kernel only names the target.
 *
 * Stops are `[close?, card]`: the close control first when the policy renders
 * one, else the card alone. `stopCount` must be derived from the same policy
 * value the close control reads, or the event names a stop that is not there.
 */
export function describeAutofocus(options: {
  hasCloseControl: boolean;
  autoFocusIndex?: number;
}): AutofocusEvent {
  return resolveAutofocus(
    options.hasCloseControl ? 2 : 1,
    options.autoFocusIndex ?? 0,
  );
}

// ---------------------------------------------------------------------------
// Press — begin/end/cancel bound to Pressable events.
// ---------------------------------------------------------------------------

export type KernPressNativeBindings = {
  pressed: boolean;
  /** Wire to `Pressable.onPressIn`. */
  onPressIn: () => void;
  /** Wire to `Pressable.onPressOut`: release off-target cancels, no press. */
  onPressOut: () => void;
  /**
   * Wire to `Pressable.onPress` INSTEAD of the consumer's own handler — the
   * kernel reports the press. Wiring both double-reports; that is the one
   * rule of this binder.
   */
  onPress: () => void;
};

/**
 * Native binding for the kernel press model. Press-in begins, release over
 * the target reports through `onPress`, release off-target cancels (RN fires
 * `onPressOut` without `onPress`). The model owns pressed-or-not;
 * `Pressable` owns the gesture.
 *
 * Order hazard, stated plainly: `Pressable` fires `onPressOut` on EVERY
 * release — including a successful tap, where the order is
 * `onPressIn` → `onPressOut` → `onPress`. A naive `onPressOut → cancel`
 * pairing would idle the model before `onPress` runs, so `end()` becomes a
 * no-op and a real tap never reports. The commit below re-begins when idle,
 * which makes `onPress` report exactly once under BOTH platform orders
 * (out-then-press and press-then-out): when pressed, `begin()` is a no-op
 * and `end()` reports; when idled by an earlier `onPressOut`, `begin()`
 * re-arms and `end()` reports. Off-target releases still report nothing —
 * the platform never fires `onPress` for those.
 */
export function useKernPress(options?: {
  disabled?: boolean;
  onPress?: () => void;
}): KernPressNativeBindings {
  const press = usePress(options);
  const { begin, end } = press;
  const commit = useCallback(() => {
    begin();
    end();
  }, [begin, end]);
  return {
    pressed: press.pressed,
    onPressIn: press.begin,
    onPressOut: press.cancel,
    onPress: commit,
  };
}

// ---------------------------------------------------------------------------
// Dismiss branches, positioning, direction — thin renderer-owned wrappers.
// ---------------------------------------------------------------------------

/**
 * The branches a surface wires, from the kernel declaration. The renderer
 * binds its own triggers (scrim `Pressable`, `onRequestClose`, close control)
 * to whichever branches are set.
 */
export function useDismissBranches({
  modal,
  dismissible,
  hasVisibleClose,
}: DismissWiringOptions): {
  branches: DismissBranches;
  fires: (source: DismissSource, enabled: boolean) => boolean;
} {
  const branches = useMemo(
    () => dismissBranchesFor({ modal, dismissible, hasVisibleClose }),
    [modal, dismissible, hasVisibleClose],
  );
  return useMemo(
    () => ({
      branches,
      fires: (source: DismissSource, enabled: boolean) =>
        shouldDismissOn(source, enabled, branches),
    }),
    [branches],
  );
}

/** Preferred floating origin for an anchor + size, clamped into `viewport`. */
export function resolvePopoverOrigin(
  anchor: { x: number; y: number; width: number; height: number },
  size: { width: number; height: number },
  options?: {
    placement?: Placement;
    offset?: number;
    viewport?: { width: number; height: number };
    viewportPadding?: number;
  },
) {
  return resolveFloatingRect(anchor, size, options);
}

/** Explicit `dir` wins, else the host default, else `ltr` — never undefined. */
export function useKernDir(options?: {
  dir?: A11yDir;
  defaultDir?: A11yDir;
}): A11yDir {
  return resolveDir(options);
}
