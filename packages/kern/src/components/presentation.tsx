/**
 * Presentation hosts — the web bindings for the kernel presentation models.
 *
 * ## Dual-path, stated once
 *
 * Every host here binds a `@xoroh/kern-primitives` model to DOM mechanics.
 * None of them replaces a Base UI part: `Dialog`/`Popover`/`Menu` keep their
 * own `Portal`, trap and positioning. These hosts are the OWNED path the
 * kernel offers alongside — adopted per surface where the surface owns its own
 * mechanics (sheets, detents, close controls), never as a second implementation
 * of what Base UI already does.
 *
 * This module is deliberately NOT barrel-exported: the generated registry
 * treats every barrel export as a component, and these are bindings, not
 * components. Surfaces import them directly.
 */

import {
  type A11yDir,
  createIdScope,
  createPortalRegistry,
  type DismissBranches,
  type DismissWiringOptions,
  dismissBranchesFor,
  isPressActivationKey,
  mergeSlotProps,
  nextTrapIndex,
  type Placement,
  resolveAutofocus,
  resolveDir,
  resolveFloatingRect,
  resolvePortalTarget,
  shouldDismissOn,
  usePresence,
  usePress,
  VISUALLY_HIDDEN_STYLE,
} from "@xoroh/kern-primitives";
import {
  type CSSProperties,
  cloneElement,
  createElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// VisuallyHidden — screen-reader-only content.
// ---------------------------------------------------------------------------

export type VisuallyHiddenProps = {
  children?: ReactNode;
  className?: string;
  /** Merged via the shared slot kernel: the hidden geometry is the default the
   *  part supplies, and an explicit consumer declaration wins per key. */
  style?: CSSProperties;
  testID?: string;
};

/**
 * Hides content visually while keeping it announced. The geometry is the
 * kernel's `VISUALLY_HIDDEN_STYLE` (no tokens — hiding is not a visual
 * decision); a consumer `style` merges via the shared slot kernel so extra
 * declarations compose instead of replacing.
 */
export function VisuallyHidden({
  children,
  className,
  style,
  testID,
}: VisuallyHiddenProps) {
  const merged = mergeSlotProps<{ style?: CSSProperties }>(
    { style: VISUALLY_HIDDEN_STYLE as CSSProperties },
    { style },
  );
  return (
    <span
      data-slot="visually-hidden"
      data-testid={testID}
      className={className}
      style={merged.style}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Slot — element substitution with kernel merging.
// ---------------------------------------------------------------------------

export type SlottedProps = {
  /** The element to render the part as. Defaults to the part's own element. */
  asChild?: ReactElement;
  children?: ReactNode;
  className?: string;
};

/**
 * Render `render` with `partProps` merged into the consumer element via the
 * shared slot kernel: handlers chain (part first), className concatenates,
 * consumer values win. The kernel owns the merge so both renderers order it
 * identically.
 */
export function Slotted({
  asChild,
  children,
  ...partProps
}: SlottedProps & Record<string, unknown>) {
  if (!asChild) return createElement("span", partProps, children);
  const consumerProps = (asChild.props ?? {}) as Record<string, unknown>;
  const { children: consumerChildren, ...rest } = consumerProps;
  return cloneElement(
    asChild,
    mergeSlotProps(partProps, rest) as Record<string, unknown>,
    // The consumer's own children win; the part's are the fallback.
    (consumerChildren ?? children) as ReactNode,
  );
}

// ---------------------------------------------------------------------------
// KernPortal — the owned portal, alongside Base UI's.
// ---------------------------------------------------------------------------

/** Module-singleton registry: every owned portal on the page orders here. */
const kernPortalRegistry = createPortalRegistry();

/** Scoped ids for owned portals: `kern-portal-1`, never `kern-portal-0`. */
const kernPortalIds = createIdScope("kern-portal");

export function getKernPortalRegistry() {
  return kernPortalRegistry;
}

export type KernPortalProps = {
  /** Explicit mount id. Defaults to a scoped `kern-portal-N`. */
  id?: string;
  children?: ReactNode;
};

/**
 * The OWNED portal. Registers `id` in the kernel registry for its lifetime
 * and paints `children` into the `kern-portal-root` host (falling back to
 * `document.body`).
 *
 * Alongside, not instead: surfaces keep their `Primitive.Portal` — this host
 * is for content the surface owns itself. Removing the borrowed owner before
 * the owned one is proven would strand every overlay; the owned path proves
 * itself here first.
 */
export function KernPortal({ id: idProp, children }: KernPortalProps) {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) idRef.current = idProp ?? kernPortalIds.nextId();
  const id = idProp ?? (idRef.current as string);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    kernPortalRegistry.mount(id);
    const host =
      document.getElementById(resolvePortalTarget({})) ?? document.body;
    setTarget(host);
    return () => {
      kernPortalRegistry.unmount(id);
    };
  }, [id]);
  // First pass renders inline so server rendering never touches `document`;
  // the effect moves content into the owned host on the client. The portal is
  // keyed by overlay id so sibling owned portals sharing one host reconcile
  // by identity instead of position — an unkeyed mount lets React mismatch
  // one overlay's subtree for another's on reorder.
  if (!target) return <>{children}</>;
  return createPortal(children, target, id);
}

// ---------------------------------------------------------------------------
// PresenceGate — exit-animation suspension.
// ---------------------------------------------------------------------------

export type PresenceGateProps = {
  open: boolean;
  children?: ReactNode;
  /**
   * Called with the exit state so the surface can animate out. Receives
   * `finishExit`, which the surface calls from its own exit-animation signal
   * (`onAnimationEnd`): only that call unmounts. A surface with no exit
   * animation calls it promptly and unmounts without a visible delay.
   */
  render?: (state: {
    present: boolean;
    exiting: boolean;
    finishExit: () => void;
  }) => ReactNode;
};

/**
 * Keeps `children` mounted while the kernel presence model says present —
 * including the `exiting` window after `open` flips false — and unmounts only
 * when the surface reports its exit finished via `finishExit`. Surfaces whose
 * mount lifecycle is owned by Base UI do NOT use this; it is for surfaces
 * that own their own mount.
 */
export function PresenceGate({ open, children, render }: PresenceGateProps) {
  const { present, state, finishExit } = usePresence(open);
  if (!present) return null;
  if (render)
    return <>{render({ present, exiting: state === "exiting", finishExit })}</>;
  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// FocusTrap — tab looping plus autofocus events.
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

export type KernFocusTrapProps = {
  children?: ReactNode;
  className?: string;
  /** Tab wraps at the ends when true (a modal). Defaults to true. */
  loop?: boolean;
  /** Which stop takes focus on mount. Defaults to the first. */
  autoFocusIndex?: number;
};

/**
 * A DOM focus trap bound to the kernel trap model: Tab / Shift+Tab move
 * through the container's tabbable stops per `nextTrapIndex`, Home/End jump,
 * and mount focuses the kernel's autofocus event target.
 *
 * Alongside Base UI's trap, not a replacement: dialog/popover/menu surfaces
 * keep the primitive's trap. This is for surfaces that own their own
 * container (drawers, detents, custom sheets).
 */
export function KernFocusTrap({
  children,
  className,
  loop = true,
  autoFocusIndex,
}: KernFocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef(loop);
  loopRef.current = loop;
  const stops = (): HTMLElement[] =>
    containerRef.current
      ? Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR,
          ),
        )
      : [];

  // Mount-only: the trap opens once. Stops are re-read on every key.
  // biome-ignore lint/correctness/useExhaustiveDependencies: autofocus fires once on open by design
  useEffect(() => {
    const elements = stops();
    // The MODEL names the target; the renderer performs the focus. An empty
    // container emits no event and focuses nothing.
    const event = resolveAutofocus(elements.length, autoFocusIndex);
    if (event.type === "focus-stop") elements[event.index]?.focus();
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    const elements = stops();
    if (elements.length === 0) return;
    const loopNow = loopRef.current;
    if (event.key === "Tab") {
      event.preventDefault();
      const active = elements.indexOf(document.activeElement as HTMLElement);
      const next = nextTrapIndex(
        active === -1 ? 0 : active,
        elements.length,
        event.shiftKey ? "previous" : "next",
        loopNow,
      );
      elements[next]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      elements[event.key === "Home" ? 0 : elements.length - 1]?.focus();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the trap container owns key routing for its stops (the Radix FocusScope shape); stops themselves stay the interactive elements
    <div
      ref={containerRef}
      data-slot="kern-focus-trap"
      className={className}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Press — begin/end/cancel bound to web events.
// ---------------------------------------------------------------------------

export type KernPressBindings = {
  pressed: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp: (event: KeyboardEvent) => void;
};

/**
 * Web binding for the kernel press model. Pointer down begins, release over
 * the target reports the press, leaving cancels. Enter activates on key down;
 * Space activates on key UP (key down only begins — matching the platform
 * behaviour where the press commits on release).
 */
export function useKernPress(options?: {
  disabled?: boolean;
  onPress?: () => void;
}): KernPressBindings {
  const press = usePress(options);
  return {
    pressed: press.pressed,
    onPointerDown: press.begin,
    onPointerUp: press.end,
    onPointerLeave: press.cancel,
    onPointerCancel: press.cancel,
    onKeyDown: (event: KeyboardEvent) => {
      if (isPressActivationKey(event.key) && event.key === "Enter") {
        event.preventDefault();
        press.begin();
        press.end();
      } else if (event.key === " ") {
        event.preventDefault();
        press.begin();
      }
    },
    onKeyUp: (event: KeyboardEvent) => {
      if (event.key === " ") press.end();
    },
  };
}

// ---------------------------------------------------------------------------
// Dismiss branches, positioning, direction — thin renderer-owned wrappers.
// ---------------------------------------------------------------------------

/**
 * The branches a surface wires, from the kernel declaration. The renderer
 * binds its own listeners (pointer, focus, key) to whichever branches are set.
 */
export function useDismissBranches({
  modal,
  dismissible,
  hasVisibleClose,
}: DismissWiringOptions): {
  branches: DismissBranches;
  fires: (
    source: Parameters<typeof shouldDismissOn>[0],
    enabled: boolean,
  ) => boolean;
} {
  const branches = useMemo(
    () => dismissBranchesFor({ modal, dismissible, hasVisibleClose }),
    [modal, dismissible, hasVisibleClose],
  );
  return {
    branches,
    fires: (source, enabled) => shouldDismissOn(source, enabled, branches),
  };
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
