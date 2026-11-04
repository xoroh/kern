import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { type ReactNode, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { scrimStyle } from "../utils/overlay-styles";
import { menuStyles } from "./menu";
import { DISABLED_CONTENT_OPACITY, StateLayer } from "./state-layer";
import { Text } from "./text";

export type NativeSplitButtonAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  separated?: boolean;
  onSelect?: () => void;
};

export type NativeSplitButtonVariant = "filled" | "tonal" | "outlined";
export type NativeSplitButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "md"
  | "lg"
  | "xl";

export type NativeSplitButtonProps = {
  /** Primary action. Also the primary button's accessible name. */
  label: string;
  onPress?: () => void;
  /** Icon inside the primary button, hidden from assistive tech. */
  icon?: ReactNode;
  /** Overflow actions. An empty list renders no overflow half. */
  actions: NativeSplitButtonAction[];
  /** Visual emphasis shared by both halves. */
  variant?: NativeSplitButtonVariant;
  /** M3 Expressive size step shared by both halves. */
  size?: NativeSplitButtonSize;
  /** Accessible name of the overflow trigger. */
  menuLabel?: string;
  disabled?: boolean;
  style?: object;
  testID?: string;
};

const SPLIT_HEIGHT: Record<NativeSplitButtonSize, number> = {
  xs: 32,
  sm: 36,
  default: 40,
  md: 56,
  lg: 96,
  xl: 136,
};

const SPLIT_OVERFLOW_WIDTH: Record<NativeSplitButtonSize, number> = {
  xs: 32,
  sm: 36,
  default: 40,
  md: 48,
  lg: 64,
  xl: 88,
};

const SPLIT_INNER_RADIUS: Record<NativeSplitButtonSize, number> = {
  xs: 4,
  sm: 4,
  default: 4,
  md: 4,
  lg: 8,
  xl: 12,
};

export function splitButtonStyles(
  scheme: ResolvedTheme = defaultScheme(),
  variant: NativeSplitButtonVariant = "filled",
  size: NativeSplitButtonSize = "default",
): {
  row: ViewStyle;
  primary: ViewStyle;
  overflow: ViewStyle;
  divider: ViewStyle;
  ink: string;
} {
  const pill = Number.parseFloat(scheme.shape.full);
  const inner = SPLIT_INNER_RADIUS[size];
  const bg =
    variant === "tonal"
      ? scheme.color.secondaryContainer
      : variant === "outlined"
        ? "transparent"
        : scheme.color.primary;
  const ink =
    variant === "tonal"
      ? scheme.color.onSecondaryContainer
      : variant === "outlined"
        ? scheme.color.onSurfaceVariant
        : scheme.color.onPrimary;
  const border: ViewStyle =
    variant === "outlined"
      ? { borderWidth: 1, borderColor: scheme.color.outline }
      : {};

  return {
    row: {
      borderRadius: pill,
      backgroundColor: bg,
      overflow: "hidden",
    },
    primary: {
      minHeight: SPLIT_HEIGHT[size],
      borderTopLeftRadius: pill,
      borderBottomLeftRadius: pill,
      borderTopRightRadius: inner,
      borderBottomRightRadius: inner,
      backgroundColor: bg,
      ...border,
    },
    overflow: {
      minHeight: SPLIT_HEIGHT[size],
      minWidth: SPLIT_OVERFLOW_WIDTH[size],
      borderTopRightRadius: pill,
      borderBottomRightRadius: pill,
      borderTopLeftRadius: inner,
      borderBottomLeftRadius: inner,
      backgroundColor: bg,
      ...border,
    },
    divider: { backgroundColor: scheme.color.outline },
    ink,
  };
}

export function SplitButton({
  label,
  onPress,
  icon,
  actions,
  variant = "filled",
  size = "default",
  menuLabel,
  disabled = false,
  style,
  testID,
}: NativeSplitButtonProps) {
  const scheme = useKernScheme();
  const styles = splitButtonStyles(scheme, variant, size);
  const card = menuStyles(scheme);
  const [open, setOpen] = useState(false);

  const hasOverflow = actions.length > 0;
  const overflowName = menuLabel ?? `${label} more`;

  return (
    <View testID={testID ?? "kern-split-button"} style={style}>
      <View style={[staticStyles.row, styles.row]}>
        <Pressable
          role="button"
          accessibilityRole="button"
          aria-disabled={disabled || undefined}
          accessibilityLabel={label}
          disabled={disabled}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 0 }}
          onPress={() => onPress?.()}
          style={[
            staticStyles.primary,
            styles.primary,
            !hasOverflow && {
              borderTopRightRadius: Number.parseFloat(scheme.shape.full),
              borderBottomRightRadius: Number.parseFloat(scheme.shape.full),
            },
            { opacity: disabled ? DISABLED_CONTENT_OPACITY : 1 },
          ]}
        >
          {({ pressed: isPressed }) => (
            <>
              {icon ? (
                <View accessible={false} importantForAccessibility="no">
                  {icon}
                </View>
              ) : null}
              <Text variant="label" style={{ color: styles.ink }}>
                {label}
              </Text>
              <StateLayer
                ink={styles.ink}
                radius={Number.parseFloat(scheme.shape.full)}
                visible={isPressed && !disabled}
              />
            </>
          )}
        </Pressable>

        {hasOverflow ? (
          <>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[staticStyles.divider, styles.divider]}
            />
            <Pressable
              role="button"
              accessibilityRole="button"
              aria-expanded={open}
              aria-disabled={disabled || undefined}
              accessibilityLabel={overflowName}
              disabled={disabled}
              hitSlop={{ top: 4, bottom: 4, left: 0, right: 4 }}
              onPress={() => setOpen((current) => !current)}
              style={[
                staticStyles.overflow,
                styles.overflow,
                open && {
                  borderRadius: Number.parseFloat(scheme.shape.full),
                },
                { opacity: disabled ? DISABLED_CONTENT_OPACITY : 1 },
              ]}
            >
              {({ pressed: isPressed }) => (
                <>
                  <View
                    accessible={false}
                    importantForAccessibility="no"
                    style={{
                      width: 10,
                      height: 10,
                      borderRightWidth: 2,
                      borderBottomWidth: 2,
                      borderColor: styles.ink,
                      transform: [{ rotate: open ? "225deg" : "45deg" }],
                    }}
                  />
                  <StateLayer
                    ink={styles.ink}
                    radius={Number.parseFloat(scheme.shape.full)}
                    visible={(isPressed || open) && !disabled}
                  />
                </>
              )}
            </Pressable>
          </>
        ) : null}
      </View>

      {hasOverflow ? (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <View style={scrimStyle(scheme)}>
            <View accessibilityRole="menu" style={card.card}>
              {actions.map((action, index) => (
                <View key={action.key}>
                  {action.separated && index > 0 ? (
                    <View
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                      style={[
                        staticStyles.divider,
                        { height: StyleSheet.hairlineWidth, width: "auto" },
                      ]}
                    />
                  ) : null}
                  <Pressable
                    role="menuitem"
                    accessibilityRole="menuitem"
                    aria-disabled={action.disabled || undefined}
                    accessibilityLabel={action.label}
                    disabled={action.disabled}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    onPress={() => {
                      action.onSelect?.();
                      setOpen(false);
                    }}
                    style={[
                      staticStyles.item,
                      {
                        borderRadius: Number.parseFloat(
                          scheme.shape["extra-small"],
                        ),
                        backgroundColor: "transparent",
                        opacity: action.disabled ? DISABLED_CONTENT_OPACITY : 1,
                      },
                    ]}
                  >
                    {({ pressed: isPressed }) => (
                      <>
                        {action.icon ? (
                          <View
                            accessible={false}
                            importantForAccessibility="no"
                          >
                            {action.icon}
                          </View>
                        ) : null}
                        <Text variant="label">{action.label}</Text>
                        <StateLayer
                          ink={scheme.color.onSurface}
                          radius={Number.parseFloat(
                            scheme.shape["extra-small"],
                          )}
                          visible={isPressed && !action.disabled}
                        />
                      </>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "stretch",
  },
  primary: {
    minHeight: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  },
  overflow: {
    minHeight: 40,
    minWidth: 40,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
  },
  item: {
    minHeight: 44,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
});
