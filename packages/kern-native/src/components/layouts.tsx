import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-theme";
import type { ReactNode } from "react";
import {
  Pressable,
  Text as RNText,
  ScrollView,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme, useKernTheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";
import { Chip } from "./chip";
import { Text } from "./text";

/**
 * Layout compositions: the filter chip row, secondary tabs, and pane
 * containers that mirror the web `kern-start` layouts at phone widths.
 */

/**
 * M3 filter chip row. A horizontally scrolling rail of `filter` chips; the
 * host owns selection so the same row can drive a query, a board column, or
 * a saved view.
 */
export type FilterChipRowProps = {
  options: { value: string; label: string }[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function FilterChipRow({
  options,
  value,
  defaultValue,
  onValueChange,
  style,
  testID,
}: FilterChipRowProps) {
  const [selected, setSelected] = useControllableState<string[]>(
    value,
    defaultValue ?? [],
    onValueChange,
  );
  const active = selected ?? [];
  return (
    <ScrollView
      testID={testID ?? "kern-filter-chip-row"}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={{
        gap: Number.parseFloat(tokens.spacing["space-100"]),
        paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
        paddingVertical: Number.parseFloat(tokens.spacing["space-100"]),
      }}
    >
      {options.map((option) => (
        <Chip
          key={option.value}
          variant="filter"
          selected={active.includes(option.value)}
          accessibilityLabel={option.label}
          onPress={() =>
            setSelected((previous) => {
              const current = previous ?? [];
              return current.includes(option.value)
                ? current.filter((entry) => entry !== option.value)
                : [...current, option.value];
            })
          }
        >
          {option.label}
        </Chip>
      ))}
    </ScrollView>
  );
}

/**
 * M3 secondary tabs: a row of text tabs with a 2dp indicator under the
 * selected one. Primary tabs (filled pill) belong to {@link Tabs}; these are
 * the flat, top-of-screen variant.
 */
export type SecondaryTab = {
  value: string;
  label: string;
  content?: ReactNode;
};

export type SecondaryTabsProps = {
  tabs: SecondaryTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function secondaryTabsStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  row: ViewStyle;
  tab: ViewStyle;
  indicator: ViewStyle;
} {
  return {
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: scheme.color.outlineVariant,
    },
    tab: {
      minHeight: 48,
      justifyContent: "center",
      paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
    },
    indicator: {
      height: 2,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.secondary,
    },
  };
}

export function SecondaryTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  style,
  testID,
}: SecondaryTabsProps) {
  const [current, setCurrent] = useControllableState<string>(
    value,
    defaultValue ?? tabs[0]?.value ?? "",
    onValueChange,
  );
  const scheme = useKernScheme();
  const styles = secondaryTabsStyles(scheme);
  const active = current ?? tabs[0]?.value;
  const panel = tabs.find((tab) => tab.value === active)?.content;
  return (
    <View testID={testID ?? "kern-secondary-tabs"} style={style}>
      <View style={styles.row} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const selected = tab.value === active;
          return (
            <Pressable
              key={tab.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
              onPress={() => setCurrent(tab.value)}
              style={({ pressed }) => [
                styles.tab,
                pressed ? { opacity: 0.82 } : undefined,
              ]}
            >
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: selected ? "600" : "500",
                  color: selected
                    ? scheme.color.onSurface
                    : scheme.color.onSurfaceVariant,
                }}
              >
                {tab.label}
              </RNText>
              <View
                style={[
                  styles.indicator,
                  { marginTop: 2, opacity: selected ? 1 : 0 },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      {panel}
    </View>
  );
}

export type PaneWidth = "narrow" | "default" | "wide" | "full";

export const PANE_WIDTHS: Record<PaneWidth, number | string> = {
  narrow: "35%",
  default: "45%",
  wide: "60%",
  full: "100%",
};

/**
 * Phone-width mirror of the web `Pane`: a tonal container that separates one
 * region from another. The Layered Surface Shell law applies — canvas behind,
 * `surface` card groups on top.
 */
export type PaneProps = {
  children?: ReactNode;
  /** `canvas` sits on the container ladder; `surface` is the white card group. */
  variant?: "canvas" | "surface";
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Pane({
  children,
  variant = "surface",
  padded = false,
  style,
  testID,
}: PaneProps) {
  const scheme = useKernScheme();
  return (
    <View
      testID={testID ?? "kern-pane"}
      style={[
        {
          backgroundColor:
            variant === "canvas"
              ? scheme.color.surfaceContainer
              : scheme.color.surface,
          borderRadius: Number.parseFloat(scheme.shape.small),
          padding: padded ? Number.parseFloat(tokens.spacing["space-200"]) : 0,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * List-detail at phone widths: the list pane until an item is selected, then
 * the detail pane with a back affordance. Same data shape as the web
 * `ListDetail`; only the presentation collapses to one pane at a time.
 */
export type ListDetailProps = {
  list: ReactNode;
  detail?: ReactNode;
  /** True once the host has an item selected. */
  showingDetail?: boolean;
  onBack?: () => void;
  backLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function ListDetail({
  list,
  detail,
  showingDetail = false,
  onBack,
  backLabel = "Back",
  style,
  testID,
}: ListDetailProps) {
  const { scheme } = useKernTheme();
  return (
    <View
      testID={testID ?? "kern-list-detail"}
      style={[{ flex: 1, backgroundColor: scheme.color.surface }, style]}
    >
      {showingDetail && detail ? (
        <View style={{ flex: 1 }}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={backLabel}
              onPress={onBack}
              style={({ pressed }) => ({
                minHeight: 48,
                justifyContent: "center",
                paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
                opacity: pressed ? 0.82 : 1,
              })}
            >
              <Text variant="label" style={{ color: scheme.color.secondary }}>
                ‹ {backLabel}
              </Text>
            </Pressable>
          ) : null}
          {detail}
        </View>
      ) : (
        list
      )}
    </View>
  );
}

/**
 * M3 supporting pane: a persistent side region beside the main content on
 * wide screens (tablets, foldables). Collapses to nothing below the M3
 * compact breakpoint, which is the host's signal to render the content as a
 * sheet instead.
 */
export type SupportingPaneProps = {
  supporting: ReactNode;
  children?: ReactNode;
  width?: PaneWidth;
  /** Hide entirely below this width in dp (M3 compact = 600). */
  compactBreakpoint?: number;
  currentWidth?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function SupportingPane({
  supporting,
  children,
  width = "default",
  compactBreakpoint = 600,
  currentWidth,
  style,
  testID,
}: SupportingPaneProps) {
  const scheme = useKernScheme();
  const compact =
    currentWidth !== undefined && currentWidth < compactBreakpoint;
  if (compact) return <>{children}</>;
  return (
    <View
      testID={testID ?? "kern-supporting-pane"}
      style={[
        {
          flexDirection: "row",
          backgroundColor: scheme.color.surfaceContainer,
          gap: Number.parseFloat(tokens.spacing["space-50"]),
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>{children}</View>
      <View
        style={{
          width: PANE_WIDTHS[width],
          backgroundColor: scheme.color.surface,
        }}
      >
        {supporting}
      </View>
    </View>
  );
}
