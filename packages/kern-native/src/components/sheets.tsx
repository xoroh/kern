import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  Text as RNText,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { SheetSurface } from "./sheet-surface";
import { Text } from "./text";

/**
 * The M3 bottom sheet family. Built on the RN `Modal` primitive so
 * `kern-native` keeps its "no styling dependencies" contract — the sheet
 * *engine* (gorhom + reanimated) is an Expo-layer concern and is the
 * `kern-expo` split this plan's step 1 defers. Every sheet obeys the M3
 * "50% cap" rule: a sheet never covers more than half the viewport unless
 * the host explicitly opts into a full-height sheet.
 */

export type BottomSheetSize = "medium" | "large";

export function bottomSheetStyles(
  size: BottomSheetSize,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  return {
    backgroundColor: scheme.color.surfaceContainerLow,
    borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
    borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
    paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
    paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
    paddingTop: Number.parseFloat(tokens.spacing["space-100"]),
    maxHeight: size === "medium" ? "50%" : "92%",
  };
}

/** M3 drag handle: 32x4 pill, `onSurfaceVariant` at reduced emphasis. */
export function SheetHandle({ testID }: { testID?: string }) {
  const scheme = useKernScheme();
  return (
    <View
      testID={testID ?? "kern-sheet-handle"}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        alignSelf: "center",
        width: 32,
        height: 4,
        borderRadius: Number.parseFloat(scheme.shape.full),
        backgroundColor: scheme.color.onSurfaceVariant,
        opacity: 0.4,
        marginBottom: Number.parseFloat(tokens.spacing["space-100"]),
      }}
    />
  );
}

export type NativeBottomSheetProps = {
  open: boolean;
  title: string;
  size?: BottomSheetSize;
  children?: ReactNode;
  onDismiss?: () => void;
  /** Actions under the content — M3 caps sheets at two actions. */
  actions?: ReactNode;
  /** Hides the drag handle for sheets that are not dismissible by drag. */
  handle?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function BottomSheet({
  open,
  title,
  size = "medium",
  children,
  onDismiss,
  actions,
  handle = true,
  style,
  testID,
}: NativeBottomSheetProps) {
  const scheme = useKernScheme();
  const cardStyle = bottomSheetStyles(size, scheme);
  // P2b-2: the Modal+scrim shell lives in the shared `SheetSurface`, so a sheet
  // cannot silently lose its dismissal path (scrim press AND hardware back).
  return (
    <SheetSurface
      open={open}
      title={title}
      onDismiss={onDismiss}
      testID={testID ?? "kern-bottom-sheet"}
      handle={handle ? <SheetHandle /> : null}
      surface={cardStyle}
      style={style}
    >
      <Text variant="title" numberOfLines={2}>
        {title}
      </Text>
      {children}
      {actions}
    </SheetSurface>
  );
}

export type SnapPoint = {
  /** Fraction of the viewport height, 0–1. */
  fraction: number;
  label: string;
};

export type NativeSnapSheetProps = {
  open: boolean;
  title: string;
  snapPoints: SnapPoint[];
  /** Index into `snapPoints`; defaults to the first. */
  index?: number;
  onIndexChange?: (index: number) => void;
  children?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Snap-point sheet. Renders the highest requested point and lets the host
 * drive the index (the reanimated/gorhom engine plugs in here later without
 * an API change).
 */
export function SnapSheet({
  open,
  title,
  snapPoints,
  index = 0,
  onIndexChange,
  children,
  onDismiss,
  style,
  testID,
}: NativeSnapSheetProps) {
  const scheme = useKernScheme();
  const safeIndex = Math.min(
    Math.max(index, 0),
    Math.max(snapPoints.length - 1, 0),
  );
  const point = snapPoints[safeIndex] ?? { fraction: 0.5, label: "" };
  // P2b-2: shared Modal+scrim shell. Snap-specific behaviour — the adjustable
  // handle that cycles snap points — stays here, in the `handle` slot.
  return (
    <SheetSurface
      open={open}
      title={title}
      onDismiss={onDismiss}
      testID={testID ?? "kern-snap-sheet"}
      handle={
        <Pressable
          accessibilityRole="adjustable"
          accessibilityLabel={`${title}, snap point ${safeIndex + 1} of ${snapPoints.length}`}
          accessibilityValue={{ text: point.label }}
          onPress={() =>
            onIndexChange?.((safeIndex + 1) % Math.max(snapPoints.length, 1))
          }
          style={{
            paddingVertical: Number.parseFloat(tokens.spacing["space-100"]),
          }}
        >
          <SheetHandle />
        </Pressable>
      }
      surface={{
        backgroundColor: scheme.color.surfaceContainerLow,
        borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
        borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
        paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
        maxHeight: `${Math.round(Math.min(point.fraction, 1) * 100)}%`,
      }}
      style={style}
    >
      <View
        style={{
          paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
        }}
      >
        <Text variant="title" numberOfLines={2}>
          {title}
        </Text>
        {children}
      </View>
    </SheetSurface>
  );
}

/**
 * Dock sheet — the compact form factor for a persistent quick-action bar that
 * peeks from the bottom edge. Sized to content, never a full sheet.
 */
export type NativeDockSheetProps = {
  open: boolean;
  children?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function DockSheet({
  open,
  children,
  onDismiss,
  style,
  testID,
}: NativeDockSheetProps) {
  const scheme = useKernScheme();
  if (!open) return null;
  return (
    <View
      testID={testID ?? "kern-dock-sheet"}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: Number.parseFloat(tokens.spacing["space-100"]),
          padding: Number.parseFloat(tokens.spacing["space-100"]),
          borderRadius: Number.parseFloat(scheme.shape["extra-large"]),
          backgroundColor: scheme.color.surfaceContainerHigh,
          shadowColor: scheme.color.scrim,
          shadowOpacity: 0.16,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss dock"
          onPress={onDismiss}
          style={{
            minWidth: 48,
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNText style={{ color: scheme.color.onSurfaceVariant }}>×</RNText>
        </Pressable>
      ) : null}
    </View>
  );
}

export type PickerOption = {
  value: string;
  label: string;
  supporting?: string;
  disabled?: boolean;
};

export type NativeBottomSheetPickerProps = {
  open: boolean;
  title: string;
  options: PickerOption[];
  value?: string;
  onSelect: (value: string) => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Picker sheet: the native counterpart of a web select. M3 keeps the
 * selected row marked with a check, never a different row color.
 */
export function BottomSheetPicker({
  open,
  title,
  options,
  value,
  onSelect,
  onDismiss,
  style,
  testID,
}: NativeBottomSheetPickerProps) {
  const scheme = useKernScheme();
  // P2b-2: shared Modal+scrim shell (see `SheetSurface`).
  return (
    <SheetSurface
      open={open}
      title={title}
      onDismiss={onDismiss}
      testID={testID ?? "kern-bottom-sheet-picker"}
      handle={<SheetHandle />}
      surface={{
        backgroundColor: scheme.color.surfaceContainerLow,
        borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
        borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
        paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
        paddingHorizontal: Number.parseFloat(tokens.spacing["space-150"]),
      }}
      style={style}
    >
      <View
        style={{
          paddingHorizontal: Number.parseFloat(tokens.spacing["space-50"]),
        }}
      >
        <Text variant="title">{title}</Text>
      </View>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="menuitem"
            accessibilityState={{
              selected,
              disabled: Boolean(option.disabled),
            }}
            accessibilityLabel={option.label}
            disabled={option.disabled}
            onPress={() => {
              onSelect(option.value);
              onDismiss?.();
            }}
            style={({ pressed }) => ({
              minHeight: 56,
              flexDirection: "row",
              alignItems: "center",
              gap: Number.parseFloat(tokens.spacing["space-150"]),
              paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
              opacity: option.disabled ? 0.38 : pressed ? 0.82 : 1,
            })}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: selected
                    ? scheme.color.onSurface
                    : scheme.color.onSurfaceVariant,
                  fontWeight: selected ? "600" : "400",
                }}
              >
                {option.label}
              </Text>
              {option.supporting ? (
                <Text
                  variant="label"
                  style={{ color: scheme.color.onSurfaceVariant }}
                >
                  {option.supporting}
                </Text>
              ) : null}
            </View>
            {selected ? (
              <RNText style={{ color: scheme.color.primary }}>✓</RNText>
            ) : null}
          </Pressable>
        );
      })}
    </SheetSurface>
  );
}

export type EntityField = {
  label: string;
  value: string;
  /** Renders the value in the monospaced/tonal data treatment. */
  data?: boolean;
};

export type NativeEntitySheetProps = {
  open: boolean;
  title: string;
  supporting?: string;
  fields: EntityField[];
  children?: ReactNode;
  onDismiss?: () => void;
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Entity sheet: the read-mostly detail surface for one record. Field values
 * sit on `surfaceContainerHighest` so the eye lands on the value, not the
 * label — the same hierarchy the web entity panes use.
 */
export function EntitySheet({
  open,
  title,
  supporting,
  fields,
  children,
  onDismiss,
  actions,
  style,
  testID,
}: NativeEntitySheetProps) {
  const scheme = useKernScheme();
  return (
    <SheetSurface
      open={open}
      title={title}
      onDismiss={onDismiss}
      testID={testID ?? "kern-entity-sheet"}
      handle={<SheetHandle />}
      surface={{
        backgroundColor: scheme.color.surfaceContainerLow,
        borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
        borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
        paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
        paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
        paddingTop: Number.parseFloat(tokens.spacing["space-100"]),
        maxHeight: "92%",
        gap: Number.parseFloat(tokens.spacing["space-150"]),
      }}
      style={style}
    >
      <View>
        <Text variant="headline" numberOfLines={2}>
          {title}
        </Text>
        {supporting ? (
          <Text
            variant="label"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {supporting}
          </Text>
        ) : null}
      </View>
      {fields.map((field) => (
        <View
          key={field.label}
          style={{
            backgroundColor: scheme.color.surfaceContainerHighest,
            borderRadius: Number.parseFloat(scheme.shape.medium),
            padding: Number.parseFloat(tokens.spacing["space-150"]),
            gap: 2,
          }}
        >
          <RNText
            style={{ fontSize: 12, color: scheme.color.onSurfaceVariant }}
          >
            {field.label}
          </RNText>
          <RNText
            style={{
              fontSize: field.data ? 13 : 15,
              fontWeight: field.data ? "500" : "400",
              color: scheme.color.onSurface,
            }}
          >
            {field.value}
          </RNText>
        </View>
      ))}
      {children}
      {actions}
    </SheetSurface>
  );
}
