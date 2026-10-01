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

export function menuGroupStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
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

/** The same groups as {@link MenuScreen}, hosted in a sheet. */
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
    <View
      testID={testID ?? "kern-menu-sheet"}
      style={[
        {
          backgroundColor: scheme.color.surfaceContainerLow,
          borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
          borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
          paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
          maxHeight: "80%",
        },
        style,
      ]}
    >
      <SheetHandle />
      <View
        style={{ paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]) }}
      >
        <Text variant="title">{title}</Text>
      </View>
      <ScrollView>
        <MenuGroupList groups={groups} />
      </ScrollView>
    </View>
  );
}

export type AppsSheetProps = {
  open: boolean;
  title: string;
  /** Slot-driven like the web app menus — hosts supply their own tiles. */
  children?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** App switcher surface. Kern ships no brand marks — apps bring their own. */
export function AppsSheet({
  open,
  title,
  children,
  onDismiss,
  style,
  testID,
}: AppsSheetProps) {
  const scheme = useKernScheme();
  if (!open) return null;
  return (
    <View
      testID={testID ?? "kern-apps-sheet"}
      style={[
        {
          backgroundColor: scheme.color.surfaceContainer,
          borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
          borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
          padding: Number.parseFloat(tokens.spacing["space-200"]),
          gap: Number.parseFloat(tokens.spacing["space-150"]),
        },
        style,
      ]}
    >
      <Text variant="title">{title}</Text>
      {children}
    </View>
  );
}

export type CreateSheetAction = {
  key: string;
  label: string;
  supporting?: string;
  icon?: ReactNode;
  onPress?: () => void;
};

export type CreateSheetProps = {
  open: boolean;
  title: string;
  actions: CreateSheetAction[];
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * "Create" sheet: a grid of creation intents. M3 puts the primary intent in
 * the first cell at double emphasis — here, the first row.
 */
export function CreateSheet({
  open,
  title,
  actions,
  onDismiss,
  style,
  testID,
}: CreateSheetProps) {
  const scheme = useKernScheme();
  if (!open) return null;
  return (
    <View
      testID={testID ?? "kern-create-sheet"}
      style={[
        {
          backgroundColor: scheme.color.surfaceContainerHigh,
          borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
          borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
          padding: Number.parseFloat(tokens.spacing["space-200"]),
          gap: Number.parseFloat(tokens.spacing["space-150"]),
        },
        style,
      ]}
    >
      <Text variant="title">{title}</Text>
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
        {onDismiss ? (
          <NavigationBarItem
            label="Close"
            accessibilityLabel={`Close ${title}`}
            onPress={onDismiss}
          />
        ) : null}
      </View>
    </View>
  );
}
