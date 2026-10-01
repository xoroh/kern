import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";
import { Text } from "./text";

export type NativeTab = {
  value: string;
  label: string;
  content?: ReactNode;
};

export function tabsStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  bar: ViewStyle;
  active: ViewStyle;
} {
  return {
    bar: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: scheme.color.outlineVariant,
    },
    active: {
      borderBottomWidth: 3,
      borderBottomColor: scheme.color.primary,
    },
  };
}

export type NativeTabsProps = Omit<ViewProps, "children" | "style"> & {
  tabs: NativeTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  style,
  testID,
  ...props
}: NativeTabsProps) {
  const scheme = useKernScheme();
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue ?? tabs[0]?.value,
    onValueChange,
  );
  const styles = tabsStyles(scheme);
  const active = tabs.find((tab) => tab.value === current) ?? tabs[0];
  return (
    <View {...props} testID={testID ?? "kern-tabs"} style={style}>
      <View accessibilityRole="tablist" style={styles.bar}>
        {tabs.map((tab) => {
          const selected = tab.value === active?.value;
          return (
            <Pressable
              key={tab.value}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              onPress={() => setCurrent(tab.value)}
              style={[
                {
                  minHeight: 48,
                  justifyContent: "center",
                  paddingHorizontal: 16,
                },
                selected ? styles.active : undefined,
              ]}
            >
              <Text
                variant="label"
                style={
                  selected
                    ? { color: scheme.color.primary }
                    : { color: scheme.color.onSurfaceVariant }
                }
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {active?.content ? (
        <View style={{ paddingVertical: 16 }}>{active.content}</View>
      ) : null}
    </View>
  );
}
