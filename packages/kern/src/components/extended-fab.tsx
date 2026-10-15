import {
  type ComponentProps,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

/**
 * M3 extended FAB — a FAB that carries a text label beside its icon, for the
 * screen's *primary* action where the label is worth the extra width.
 *
 * M3 specifies one behaviour kern owns here: **the extended FAB collapses into
 * a plain FAB when the label no longer fits.** A truncated or wrapped label is
 * an unreadable primary action; the collapse is the spec's answer. M3 triggers
 * it on scroll, which is host state the component cannot see, so the trigger is
 * an **imperative handle** rather than a gesture kern would have to invent:
 *
 * ```tsx
 * const fab = useRef<ExtendedFabHandle>(null);
 * useEffect(() => {
 *   const onScroll = (e: WheelEvent) => fab.current?.[e.deltaY > 0 ? "collapse" : "expand"]();
 *   addEventListener("wheel", onScroll);
 *   return () => removeEventListener("wheel", onScroll);
 * }, []);
 * return <ExtendedFab ref={fab} icon={<PencilIcon />} label="Compose" />;
 * ```
 *
 * A double-click or long-press toggle was rejected: it is not in the M3 spec,
 * and shipping a gesture the platform does not define makes the component's
 * behaviour a Kern invention that consumers then have to discover.
 *
 * - Controlled (`collapsed` + `onCollapsedChange`) or uncontrolled
 *   (`defaultCollapsed`), so a host can bind it to its own scroll position.
 * - **The accessible name survives collapse.** Collapsed, the label text is no
 *   longer rendered, so the name comes from `label` on the element. A collapsed
 *   FAB that left the label in the a11y tree would announce a longer name than
 *   it shows; one with neither announces nothing.
 * - Resting elevation is the plain FAB's `elevation-level3` and the shape is
 *   `corner-large`: the extended form is the same button at a different width,
 *   not a second component.
 */

export type ExtendedFabSize = "small" | "medium" | "large";

/**
 * M3 extended FAB sizes (MDC-Android comp tokens): small 56dp / 24px icon /
 * large corner, medium 80dp / 28px icon / large-increased corner, large 96dp
 * / 36px icon / extra-large corner.
 */
const EXTENDED_FAB_GEOMETRY: Record<
  ExtendedFabSize,
  { bar: string; icon: string; collapsed: string }
> = {
  small: {
    bar: "h-14 rounded-(--sys-shape-corner-large)",
    icon: "[&_svg]:size-6",
    collapsed: "w-14",
  },
  medium: {
    bar: "h-20 rounded-(--sys-shape-corner-large-increased)",
    icon: "[&_svg]:size-7",
    collapsed: "w-20",
  },
  large: {
    bar: "h-24 rounded-(--sys-shape-corner-extra-large)",
    icon: "[&_svg]:size-9",
    collapsed: "w-24",
  },
};

export type ExtendedFabHandle = {
  /** Collapse to the icon-only FAB. */
  collapse: () => void;
  /** Restore the labelled FAB. */
  expand: () => void;
  /** Collapse or expand, whichever is not current. */
  toggle: () => void;
};

export type ExtendedFabProps = Omit<
  ComponentProps<"button">,
  "children" | "ref"
> & {
  /**
   * Imperative handle for M3's scroll-driven collapse. The component cannot
   * see the host's scroll position, so the trigger is an explicit handle
   * rather than a gesture kern would have to invent.
   */
  ref?: Ref<ExtendedFabHandle>;
  /** Visible label. Doubles as the accessible name when collapsed. */
  label: string;
  icon: ReactNode;
  /** Controlled collapse state. */
  collapsed?: boolean;
  /** Initial collapse state for the uncontrolled case. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * R2 lexicon canonical names (`value` wins when both are passed; both
   * callbacks fire). `collapsed`/`defaultCollapsed`/`onCollapsedChange` are
   * deprecated aliases onto the same state — including the imperative
   * handle, which drives the same path.
   */
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (collapsed: boolean) => void;
  /**
   * M3 extended size. `small` is the current rendering, kept default;
   * `medium`/`large` swap the expressive 80/96dp geometry.
   */
  size?: ExtendedFabSize;
};

export function ExtendedFab({
  ref,
  label,
  icon,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = "small",
  disabled,
  type = "button",
  className,
  ...props
}: ExtendedFabProps) {
  const controlled = valueProp !== undefined || collapsed !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? defaultCollapsed,
  );
  const isCollapsed = controlled
    ? (valueProp ?? collapsed ?? false)
    : uncontrolled;
  // The handle must know the CURRENT state to be idempotent — two scrolls in
  // the same direction must not report two collapses. `stateRef` is updated in
  // an effect, not during render, so a controlled prop that a host fails to
  // echo back still leaves the handle reading the last value kern itself
  // emitted rather than a value that was never applied.
  const stateRef = useRef(isCollapsed);
  useEffect(() => {
    stateRef.current = isCollapsed;
  }, [isCollapsed]);
  const geo = EXTENDED_FAB_GEOMETRY[size];

  const setCollapsed = useCallback(
    (next: boolean) => {
      // Record the intent immediately: `collapse()` twice in a row has to be one
      // report, and a controlled host may not re-render between the two calls.
      stateRef.current = next;
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
      onCollapsedChange?.(next);
    },
    [controlled, onCollapsedChange, onValueChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      collapse: () => {
        if (!stateRef.current) setCollapsed(true);
      },
      expand: () => {
        if (stateRef.current) setCollapsed(false);
      },
      toggle: () => setCollapsed(!stateRef.current),
    }),
    [setCollapsed],
  );

  return (
    <button
      type={type}
      data-slot="extended-fab"
      data-collapsed={isCollapsed || undefined}
      // The name is always on the element: collapsed, the visible label is gone
      // and `label` is the only thing left to announce.
      aria-label={label}
      disabled={disabled}
      className={cn(
        "kern-extended-fab relative inline-flex shrink-0 items-center gap-3 pr-5 pl-4 text-(--sys-color-on-primary-container) shadow-(--sys-elevation-level3) hover:shadow-(--sys-elevation-level4) transition-[padding,color,background-color,border-color,box-shadow] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none " +
          FOCUS_RING_CLASS +
          " disabled:pointer-events-none disabled:opacity-38 aria-disabled:pointer-events-none aria-disabled:opacity-38 after:absolute after:-inset-2 after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] hover:before:bg-(--sys-color-on-primary-container) focus-visible:before:opacity-[var(--sys-state-focus)] focus-visible:before:bg-(--sys-color-on-primary-container) active:before:opacity-[var(--sys-state-press)] active:before:bg-(--sys-color-on-primary-container) disabled:before:opacity-0 aria-disabled:before:opacity-0 [&_svg]:shrink-0",
        "bg-(--sys-color-primary-container)",
        geo.bar,
        geo.icon,
        isCollapsed && `justify-center px-0 ${geo.collapsed}`,
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="flex items-center justify-center">
        {icon}
      </span>
      {isCollapsed ? null : (
        <span
          data-slot="extended-fab-label"
          className="truncate text-sm leading-5 font-medium tracking-[0.1px]"
        >
          {label}
        </span>
      )}
    </button>
  );
}
