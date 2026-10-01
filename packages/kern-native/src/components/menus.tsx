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
import { useKernScheme } from "../theme";
import { NavigationBarItem } from "./navigation-bar";
import { SheetSurface } from "./sheet-surface";
import { SheetHandle } from "./sheets";
import { Text } from "./text";

/**
 * M3 menu system for screens. A menu is a list of actions grouped under
 * headings, presented either inline (`MenuScreen`) or in a sheet
 * (`MenuSheet`) — the same data both ways, so a host can move an action from
 * a screen into a sheet without rewriting it.
 */

export type MenuAction = {
  /** Stable identity for tests and analytics; not shown. */
  key: string;
  label: string;
  supporting?: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onPress?: () => void;
};

export type MenuGroup = {
  /** Group heading. Omit for an ungrouped list. */
  heading?: string;
  actions: MenuAction[];
};

/**
 * Menu group styles. Layout and spacing only — the group heading's COLOUR is
 * applied by the caller (`MenuGroupList` uses `scheme.color.primary`), because
 * this function is public API and its `scheme` parameter is retained for
 * signature compatibility. It is prefixed `_` to say so plainly: the styles
 * themselves are scheme-independent by design, not by oversight.
 */
export function menuGroupStyles(
  _scheme: ResolvedTheme = resolveThemeDetails(),
): {
  heading: ViewStyle;
  action: ViewStyle;
} {
  return {
    heading: {
      paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
      paddingTop: Number.parseFloat(tokens.spacing["space-200"]),
      paddingBottom: Number.parseFloat(tokens.spacing["space-100"]),
    },
    action: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: Number.parseFloat(tokens.spacing["space-150"]),
      paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
    },
  };
}

/** Renders one group; shared by {@link MenuScreen} and {@link MenuSheet}. */
export function MenuGroupList({
  groups,
  testID,
}: {
  groups: MenuGroup[];
  testID?: string;
}) {
  const scheme = useKernScheme();
  const styles = menuGroupStyles(scheme);
  return (
    <View
      testID={testID}
      style={{ gap: Number.parseFloat(tokens.spacing["space-50"]) }}
    >
      {groups.map((group, groupIndex) => (
        <View key={group.heading ?? `group-${groupIndex}`}>
          {group.heading ? (
            <View style={styles.heading}>
              <Text variant="label" style={{ color: scheme.color.primary }}>
                {group.heading}
              </Text>
            </View>
          ) : null}
          {group.actions.map((action) => (
            <Pressable
              key={action.key}
              accessibilityRole="menuitem"
              accessibilityLabel={action.label}
              accessibilityState={{ disabled: Boolean(action.disabled) }}
              disabled={action.disabled}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.action,
                {
                  opacity: action.disabled ? 0.38 : pressed ? 0.82 : 1,
                },
              ]}
            >
              {action.icon}
              <View style={{ flex: 1 }}>
                <RNText
                  style={{
                    fontSize: 15,
                    color: action.destructive
                      ? scheme.color.error
                      : scheme.color.onSurface,
                  }}
                >
                  {action.label}
                </RNText>
                {action.supporting ? (
                  <RNText
                    style={{
                      fontSize: 12,
                      color: scheme.color.onSurfaceVariant,
                    }}
                  >
                    {action.supporting}
                  </RNText>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

export type MenuScreenProps = {
  groups: MenuGroup[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Inline menu screen — a settings-style page of grouped actions. */
export function MenuScreen({ groups, style, testID }: MenuScreenProps) {
  const scheme = useKernScheme();
  return (
    <ScrollView
      testID={testID ?? "kern-menu-screen"}
      style={[{ flex: 1, backgroundColor: scheme.color.surface }, style]}
      contentContainerStyle={{
        paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
      }}
    >
      <MenuGroupList groups={groups} />
    </ScrollView>
  );
}

export type MenuSheetProps = {
  open: boolean;
  title: string;
  groups: MenuGroup[];
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * The same groups as {@link MenuScreen}, hosted in a sheet.
 *
 * P2b-2: previously a bare `<View>` with NO `Modal`, no scrim and no
 * dismissal path, while declaring an `onDismiss` prop that it destructured
 * and never used — identical to the `AppsSheet` defect. It now hosts through
 * the shared `SheetSurface`, so scrim press and hardware back both dismiss.
 */
export function MenuSheet({
  open,
  title,
  groups,
  onDismiss,
  style,
  testID,
}: MenuSheetProps) {
  const scheme = useKernScheme();
  if (!open) return null;
  return (
    <SheetSurface
      open={open}
      title={title}
      onDismiss={onDismiss}
      testID={testID ?? "kern-menu-sheet"}
      handle={<SheetHandle />}
      surface={{
        backgroundColor: scheme.color.surfaceContainerLow,
        borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
        borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
        paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
        maxHeight: "80%",
      }}
      style={style}
    >
      <View
        style={{
          paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
        }}
      >
        <Text variant="title">{title}</Text>
      </View>
      <ScrollView>
        <MenuGroupList groups={groups} />
      </ScrollView>
    </SheetSurface>
  );
}

/** One row in an {@link ActionSheet} list. */
export type CreateSheetAction = {
  key: string;
  label: string;
  supporting?: string;
  icon?: ReactNode;
  onPress?: () => void;
};

/**
 * ActionSheet — the one sheet for "a titled surface with a dismiss path and
 * a body". P2b-2 MERGE: this replaces `AppsSheet` and `CreateSheet`, which
 * were the same component written twice (`children` vs `actions`) and both
 * rendered a bare `<View>` with NO `Modal`, NO scrim and NO dismissal path.
 *
 * `AppsSheet` additionally destructured `onDismiss` and never used it — a
 * caller passing it got a sheet that could not be closed. `CreateSheet` used
 * it only for a `Close` row, so the two were not even consistent with each
 * other. Both now host through the shared `SheetSurface`, which wires scrim
 * press AND hardware back to `onDismiss`.
 *
 * Supply `children` to own the body (app switcher tiles), `actions` to get
 * the standard M3 action list, or neither for a plain titled surface.
 */
export type ActionSheetProps = {
  open: boolean;
  title: string;
  /** Slot-driven body. Hosts supply their own tiles. */
  children?: ReactNode;
  /** Standard action list. Ignored when `children` is supplied. */
  actions?: CreateSheetAction[];
  /** Wired to scrim press and hardware back. */
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** App switcher + "create" surface: one component, one dismissal contract. */
export function ActionSheet({
  open,
  title,
  children,
  actions,
  onDismiss,
  style,
  testID,
}: ActionSheetProps) {
  const scheme = useKernScheme();
  if (!open) return null;
  return (
    <SheetSurface
      open={open}
      title={title}
      onDismiss={onDismiss}
      testID={testID ?? "kern-action-sheet"}
      handle={<SheetHandle />}
      surface={{
        backgroundColor: scheme.color.surfaceContainerHigh,
        borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
        borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
        padding: Number.parseFloat(tokens.spacing["space-200"]),
        gap: Number.parseFloat(tokens.spacing["space-150"]),
      }}
      style={style}
    >
      <Text variant="title">{title}</Text>
      {children ??
        (actions ? (
          <View style={{ gap: Number.parseFloat(tokens.spacing["space-100"]) }}>
            {actions.map((action) => (
              <NavigationBarItem
                key={action.key}
                label={action.label}
                icon={action.icon}
                accessibilityLabel={
                  action.supporting
                    ? `${action.label}, ${action.supporting}`
                    : action.label
                }
                onPress={action.onPress}
              />
            ))}
          </View>
        ) : null)}
    </SheetSurface>
  );
}
