import { useControllableState } from "@xoroh/kern-primitives";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Pressable, type PressableProps, View } from "react-native";
import { useKernScheme } from "../theme";
import { fabColorRoles, fabStyles } from "./fab";
import { Text } from "./text";

/**
 * M3 extended FAB — a FAB carrying a text label beside its icon, for the
 * screen's *primary* action where the label earns the extra width.
 *
 * M3 specifies exactly one behaviour kern owns: **the extended FAB collapses
 * into a plain FAB when the label no longer fits.** A truncated or wrapped
 * label is an unreadable primary action; the collapse is the spec's answer. M3
 * triggers it on scroll — host state this component cannot see — so the trigger
 * is an **imperative handle**, exactly as on web, rather than a gesture kern
 * would have to invent. A double-tap or long-press toggle was rejected for the
 * same reason web rejected it: it is not in the spec, and shipping a gesture
 * the platform does not define makes the component's behaviour a Kern invention
 * that consumers then have to discover.
 *
 *   const fab = useRef<NativeExtendedFabHandle>(null);
 *   // …on scroll down: fab.current?.collapse(); on scroll up: fab.current?.expand();
 *   return <ExtendedFab ref={fab} icon={<PencilIcon />} label="Compose" />;
 *
 * - Controlled (`value` + `onValueChange`) or uncontrolled
 *   (`defaultValue`), so a host can bind it to its own scroll position.
 * - **The accessible name survives collapse.** Collapsed, the label text is no
 *   longer rendered, so the name has to come from `label` on the element. A
 *   collapsed FAB that left the label in the a11y tree would announce a longer
 *   name than it shows; one with neither announces nothing.
 * - The handle is **idempotent**: two scrolls in the same direction must not
 *   report two collapses, so `collapse()` on an already-collapsed FAB fires
 *   nothing. `stateRef` is written during the call rather than read from an
 *   effect, because a controlled host may not re-render between two calls.
 */
export type NativeExtendedFabHandle = {
  /** Collapse to the icon-only FAB. */
  collapse: () => void;
  /** Restore the labelled FAB. */
  expand: () => void;
  /** Collapse or expand, whichever is not current. */
  toggle: () => void;
};

export type NativeExtendedFabSize = "small" | "medium" | "large";

export type NativeExtendedFabProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "ref"
> & {
  ref?: React.Ref<NativeExtendedFabHandle>;
  /** Visible label. Doubles as the accessible name when collapsed. */
  label: string;
  icon: ReactNode;
  /**
   * M3 extended size: small 56dp, medium 80dp, large 96dp. Collapse lands
   * on the square of the same height.
   */
  size?: NativeExtendedFabSize;
  /** Controlled collapse state. */
  value?: boolean;
  /** Initial collapse state for the uncontrolled case. */
  defaultValue?: boolean;
  onValueChange?: (collapsed: boolean) => void;
  variant?: "primary" | "tonal";
  disabled?: boolean;
  onPress?: PressableProps["onPress"];
  testID?: string;
};

export const ExtendedFab = forwardRef<
  NativeExtendedFabHandle,
  NativeExtendedFabProps
>(function ExtendedFab(
  {
    label,
    icon,
    value: valueProp,
    defaultValue = false,
    onValueChange,
    variant = "primary",
    size = "small",
    disabled = false,
    onPress,
    hitSlop,
    accessibilityState,
    testID,
    ...props
  },
  ref,
) {
  const scheme = useKernScheme();
  const [isCollapsed, setCollapsed] = useControllableState(
    valueProp,
    defaultValue,
    (next) => {
      onValueChange?.(next);
    },
  );
  const collapsedNow = isCollapsed ?? false;

  // Mirrors the last value kern itself emitted, so `collapse()` twice in a row
  // is one report even when a controlled host has not re-rendered in between.
  const stateRef = useRef(collapsedNow);
  stateRef.current = collapsedNow;

  const apply = useCallback(
    (next: boolean) => {
      stateRef.current = next;
      setCollapsed(next);
    },
    [setCollapsed],
  );

  useImperativeHandle(
    ref,
    () => ({
      collapse: () => {
        if (!stateRef.current) apply(true);
      },
      expand: () => {
        if (stateRef.current) apply(false);
      },
      toggle: () => apply(!stateRef.current),
    }),
    [apply],
  );

  // Container + ink resolve through the shared FAB roles: `primary` is the
  // primary container pair, `tonal` the secondary container pair. (Previously
  // the label painted `onPrimary` on a primary-container fill — a broken
  // tonal pair.)
  const roles = fabColorRoles(variant === "primary" ? "primary" : "secondary", scheme);
  // Extended size maps onto the FAB size ladder: small 56, medium 80,
  // large 96. Collapse lands on the square of the same height.
  const fabSize = size === "small" ? "default" : size;
  const box = fabSize === "default" ? 56 : fabSize === "medium" ? 80 : 96;
  const base = { ...fabStyles(fabSize, scheme), backgroundColor: roles.container };
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-extended-fab"}
      accessibilityRole="button"
      // Always on the element: collapsed, the visible label is gone and this is
      // the only thing left to announce.
      accessibilityLabel={label}
      accessibilityState={{
        ...accessibilityState,
        disabled: disabled || undefined,
      }}
      disabled={disabled}
      hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onPress}
      style={({ pressed }) => [
        base,
        // Collapsed is the icon FAB: square of the size height, no gap,
        // centred. Expanded adds the label's own padding — the same button
        // at a different width, not a second component.
        collapsedNow
          ? { paddingHorizontal: 0, gap: 0, minWidth: box, width: box }
          : { paddingHorizontal: 20, gap: 12 },
        { opacity: disabled ? 0.38 : pressed ? 0.9 : 1 },
      ]}
    >
      <View
        accessible={false}
        importantForAccessibility="no"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {icon}
      </View>
      {collapsedNow ? null : (
        <Text variant="label" style={{ color: roles.ink }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});
