import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import { type ReactNode, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useKernScheme } from "../theme";
import { overlayStyles } from "../utils/overlay-styles";
import { menuStyles } from "./menu";
import { Text } from "./text";

const staticStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  primary: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  overflow: {
    minHeight: 40,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  // The M3 1dp outline between the halves. Without it two visibly separate
  // buttons would read as a button group, which is a different component.
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  item: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
});

/**
 * M3 split button — one action, plus an overflow menu for its siblings. The
 * primary action is the *most likely* one and stays a plain button; the overflow
 * is a second, separate control. M3 is explicit that the two must not be one
 * button with two hit regions: a single element that opens a menu on part of
 * itself can be announced as neither control.
 *
 * What kern owns:
 *
 * - **Two tab stops, two names.** The primary button is named by `label`; the
 *   overflow trigger is named by `menuLabel` (defaulting to `` `${label} more` ``)
 *   and carries `accessibilityState.expanded`, the RN half of
 *   `aria-haspopup` + `aria-expanded`. A split button built as one element is
 *   announced as one button, so the overflow action is unreachable by name.
 * - **Geometry that reads as one control** — the primary carries the full
 *   `corner-full` on its leading side, the overflow the trailing side, and the
 *   hairline divider between them is the M3 1dp `outline`.
 * - **The primary action does not open the menu.** Pressing it fires `onClick`
 *   and leaves the overflow closed; that separation is the entire reason the
 *   component exists.
 * - **Selecting an overflow action dismisses the menu**, so the host never has
 *   to close it and cannot forget to.
 * - **Disabled** disables both halves, because a split button whose overflow is
 *   live while its primary is dead is a trap.
 */
export type NativeSplitButtonAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  separated?: boolean;
  onSelect?: () => void;
};

export type NativeSplitButtonProps = {
  /** Primary action. Also the primary button's accessible name. */
  label: string;
  onClick?: () => void;
  /** Icon inside the primary button, hidden from assistive tech. */
  icon?: ReactNode;
  /** Overflow actions. An empty list renders no overflow half. */
  actions: NativeSplitButtonAction[];
  /** Accessible name of the overflow trigger. */
  menuLabel?: string;
  disabled?: boolean;
  style?: object;
  testID?: string;
};

export function splitButtonStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  row: object;
  primary: object;
  overflow: object;
  divider: object;
} {
  return {
    row: {
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.primary,
      overflow: "hidden",
    },
    // Leading half carries the pill on its left, trailing half on its right:
    // two halves of one pill, not two pills.
    primary: {
      borderTopLeftRadius: Number.parseFloat(scheme.shape.full),
      borderBottomLeftRadius: Number.parseFloat(scheme.shape.full),
    },
    overflow: {
      borderTopRightRadius: Number.parseFloat(scheme.shape.full),
      borderBottomRightRadius: Number.parseFloat(scheme.shape.full),
    },
    divider: { backgroundColor: scheme.color.outline },
  };
}

export function SplitButton({
  label,
  onClick,
  icon,
  actions,
  menuLabel,
  disabled = false,
  style,
  testID,
}: NativeSplitButtonProps) {
  const scheme = useKernScheme();
  const styles = splitButtonStyles(scheme);
  const card = menuStyles(scheme);
  const [open, setOpen] = useState(false);
  const overflowName = menuLabel ?? `${label} more`;
  const hasOverflow = actions.length > 0;

  return (
    <View>
      <View
        testID={testID ?? "kern-split-button"}
        style={[staticStyles.row, styles.row, style]}
        accessibilityState={{ disabled: disabled || undefined }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: disabled || undefined }}
          disabled={disabled}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => {
            // Deliberately does not touch `open`: the primary must not open the
            // menu. That separation is the component's whole reason to exist.
            onClick?.();
          }}
          style={({ pressed }) => [
            staticStyles.primary,
            styles.primary,
            { opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
          ]}
        >
          <View
            accessible={false}
            importantForAccessibility="no"
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {icon}
          </View>
          <Text variant="label" style={{ color: scheme.color.onPrimary }}>
            {label}
          </Text>
        </Pressable>

        {hasOverflow ? (
          <>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[staticStyles.divider, styles.divider]}
            />
            <Pressable
              testID="kern-split-button-overflow"
              accessibilityRole="button"
              accessibilityLabel={overflowName}
              accessibilityState={{
                expanded: open,
                disabled: disabled || undefined,
              }}
              disabled={disabled}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => setOpen(!open)}
              style={({ pressed }) => [
                staticStyles.overflow,
                styles.overflow,
                { opacity: disabled ? 0.5 : pressed || open ? 0.9 : 1 },
              ]}
            >
              {/* The chevron is decoration: the half's accessible name comes
                  from `overflowName`, so announcing it too would double it. */}
              <View
                accessible={false}
                importantForAccessibility="no"
                style={{
                  width: 10,
                  height: 10,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: scheme.color.onPrimary,
                  transform: [{ rotate: "45deg" }],
                }}
              />
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
          <View style={overlayStyles.scrim}>
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
                    accessibilityRole="menuitem"
                    accessibilityLabel={action.label}
                    accessibilityState={{ disabled: action.disabled }}
                    disabled={action.disabled}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    onPress={() => {
                      action.onSelect?.();
                      // Select-then-dismiss: the host never has to close it, and
                      // cannot forget to.
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      staticStyles.item,
                      {
                        borderRadius: Number.parseFloat(
                          scheme.shape["extra-small"],
                        ),
                        backgroundColor: pressed
                          ? scheme.color.surfaceContainerHighest
                          : "transparent",
                        opacity: action.disabled ? 0.5 : 1,
                      },
                    ]}
                  >
                    <Text variant="label">{action.label}</Text>
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
