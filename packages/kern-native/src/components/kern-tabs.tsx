import { useControllableState } from "@xoroh/axis";
import { type ResolvedTheme, tokens } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { DISABLED_CONTENT_OPACITY, StateLayer } from "./state-layer";

/**
 * KernTabs — native twin of the web `KernTabs` (D951 WP1b, CL-009).
 * Same contract (`items/value/defaultValue/onValueChange/
 * variant/orientation/density` + `leadingIcon`/`badge` slots); only the
 * interaction idiom differs (N): press + screen-reader roles instead of
 * roving-tabindex keyboard nav, haptics left to the host.
 *
 * Variant mapping (parity with web):
 * - `primary`: 3dp primary indicator, primary active label (top-level bar).
 * - `secondary`: 2dp primary indicator, on-surface active label
 *   (sub-section row). NOTE — this corrects a drift in `layouts.tsx`
 *   `SecondaryTabs`, whose indicator used the *secondary* role: M3 marks
 *   secondary selection with position, and the indicator role is primary
 *   on both renderers now.
 * - `orientation="vertical"`: settings pills — the active tab fills with
 *   secondary-container instead of underlining.
 */

export type KernTabItem = {
  value: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  badge?: ReactNode;
};

export type KernTabsVariant = "primary" | "secondary";
export type KernTabsOrientation = "horizontal" | "vertical";
export type KernTabsDensity = "compact" | "medium" | "expanded";

const DENSITY_HEIGHT: Record<KernTabsDensity, number> = {
  compact: 40,
  medium: 48,
  expanded: 56,
};

export function kernTabsStyles(
  variant: KernTabsVariant,
  orientation: KernTabsOrientation,
  density: KernTabsDensity,
  scheme: ResolvedTheme = defaultScheme(),
): { row: ViewStyle; tab: ViewStyle; indicatorHeight: number } {
  return {
    row:
      orientation === "vertical"
        ? { flexDirection: "column", gap: 4 }
        : {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: scheme.color.outlineVariant,
          },
    tab: {
      minHeight: DENSITY_HEIGHT[density],
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
      ...(orientation === "vertical"
        ? { borderRadius: Number.parseFloat(scheme.shape.full) }
        : null),
    },
    indicatorHeight: variant === "primary" ? 3 : 2,
  };
}

export type NativeKernTabsProps = Omit<ViewProps, "children" | "style"> & {
  items: KernTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: KernTabsVariant;
  orientation?: KernTabsOrientation;
  density?: KernTabsDensity;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function KernTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "primary",
  orientation = "horizontal",
  density = "medium",
  children,
  style,
  testID,
  ...props
}: NativeKernTabsProps) {
  const [current, setCurrent] = useControllableState<string>(
    value,
    defaultValue ?? items.find((tab) => !tab.disabled)?.value ?? "",
    onValueChange,
  );
  const scheme = useKernScheme();
  const styles = kernTabsStyles(variant, orientation, density, scheme);
  const vertical = orientation === "vertical";
  const fallback = items.find((tab) => !tab.disabled)?.value;
  const active = items.some((tab) => tab.value === current && !tab.disabled)
    ? current
    : fallback;

  if (active === undefined) return null;

  const panel = children ?? items.find((tab) => tab.value === active)?.content;

  return (
    // Vertical (settings pills) stacks the pill column above the panel —
    // side-by-side only fits wide screens, which pick SupportingPane.
    <View
      {...props}
      testID={testID ?? "kern-tabs"}
      style={[
        vertical ? { flexDirection: "column", gap: 8 } : undefined,
        style,
      ]}
    >
      <View accessibilityRole="tablist" style={styles.row}>
        {items.map((tab) => {
          const selected = tab.value === active;
          return (
            <Pressable
              key={tab.value}
              role="tab"
              accessibilityRole="tab"
              aria-selected={selected}
              aria-disabled={tab.disabled || undefined}
              accessibilityLabel={tab.label}
              disabled={tab.disabled}
              onPress={() => setCurrent(tab.value)}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              style={[
                styles.tab,
                vertical && selected
                  ? { backgroundColor: scheme.color.secondaryContainer }
                  : undefined,
                tab.disabled
                  ? { opacity: DISABLED_CONTENT_OPACITY }
                  : undefined,
                { overflow: "hidden" as const },
              ]}
            >
              {({ pressed: isPressed }) => (
                <>
                  {tab.leadingIcon}
                  <RNText
                    style={{
                      fontSize: 14,
                      fontWeight: selected ? "600" : "500",
                      color: vertical
                        ? selected
                          ? scheme.color.onSecondaryContainer
                          : scheme.color.onSurfaceVariant
                        : selected
                          ? variant === "primary"
                            ? scheme.color.primary
                            : scheme.color.onSurface
                          : scheme.color.onSurfaceVariant,
                    }}
                  >
                    {tab.label}
                  </RNText>
                  {tab.badge}
                  {!vertical ? (
                    <View
                      style={{
                        height: styles.indicatorHeight,
                        alignSelf: "stretch",
                        marginTop: 2,
                        borderRadius: Number.parseFloat(scheme.shape.full),
                        backgroundColor: scheme.color.primary,
                        opacity: selected ? 1 : 0,
                      }}
                    />
                  ) : null}
                  <StateLayer
                    ink={
                      vertical && selected
                        ? scheme.color.onSecondaryContainer
                        : scheme.color.onSurface
                    }
                    visible={isPressed && !tab.disabled}
                  />
                </>
              )}
            </Pressable>
          );
        })}
      </View>
      {panel ? <View>{panel}</View> : null}
    </View>
  );
}
