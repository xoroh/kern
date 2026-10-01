import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-theme";
import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { overlayStyles } from "../utils/overlay-styles";
import {
  NavigationBarItem,
  type NavigationDestination,
} from "./navigation-bar";
import { Text } from "./text";

/**
 * M3 navigation drawer (modal variant). Same destinations as
 * {@link NavigationBar}; M3 only forbids both being visible at once, which
 * the host owns. Width follows the M3 360dp spec, capped at 80% so tablets
 * and foldables keep the detail pane visible.
 */

export const SECTION_DRAWER_WIDTH = 360;

export function drawerStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  drawer: ViewStyle;
  header: ViewStyle;
  body: ViewStyle;
} {
  return {
    drawer: {
      width: SECTION_DRAWER_WIDTH,
      maxWidth: "80%",
      flex: 1,
      backgroundColor: scheme.color.surfaceContainerLow,
      paddingTop: Number.parseFloat(tokens.spacing["4"]),
    },
    header: {
      paddingHorizontal: Number.parseFloat(tokens.spacing["4"]),
      paddingBottom: Number.parseFloat(tokens.spacing["4"]),
      gap: Number.parseFloat(tokens.spacing["1"]),
    },
    body: {
      paddingHorizontal: Number.parseFloat(tokens.spacing["3"]),
      gap: Number.parseFloat(tokens.spacing["0"]),
    },
  };
}

export type NativeNavigationDrawerProps = {
  open: boolean;
  destinations: NavigationDestination[];
  value: string;
  onValueChange: (key: string) => void;
  onDismiss?: () => void;
  /** Headline + supporting line above the destination list. */
  title?: string;
  subtitle?: string;
  /** Slot under the list (account row, app switcher, sign-out). */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function NavigationDrawer({
  open,
  destinations,
  value,
  onValueChange,
  onDismiss,
  title,
  subtitle,
  footer,
  style,
  testID,
}: NativeNavigationDrawerProps) {
  const { scheme } = useKernTheme();
  const styles = drawerStyles(scheme);
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={onDismiss}
    >
      <View style={overlayStyles.scrim}>
        <Pressable
          accessibilityLabel="Dismiss navigation drawer"
          onPress={onDismiss}
          style={{ flex: 1 }}
        />
        <View
          testID={testID ?? "kern-navigation-drawer"}
          style={[styles.drawer, style]}
        >
          {title || subtitle ? (
            <View style={styles.header}>
              {title ? (
                <Text variant="title" numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text
                  variant="label"
                  style={{ color: scheme.color.onSurfaceVariant }}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}
          <ScrollView contentContainerStyle={styles.body}>
            {destinations.map((destination) => (
              <NavigationBarItem
                key={destination.key}
                label={destination.label}
                icon={destination.icon}
                badge={destination.badge}
                disabled={destination.disabled}
                selected={destination.key === value}
                onPress={() => {
                  onValueChange(destination.key);
                  onDismiss?.();
                }}
              />
            ))}
          </ScrollView>
          {footer}
        </View>
      </View>
    </Modal>
  );
}
