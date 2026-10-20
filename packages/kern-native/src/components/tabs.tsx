import {
  TabsList as AxisTabsList,
  TabsPanel as AxisTabsPanel,
  TabsRoot as AxisTabsRoot,
  TabsTrigger as AxisTabsTrigger,
  type TabsListProps,
  type TabsPanelProps,
  type TabsRootProps,
  type TabsTriggerProps,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { type ReactNode, useState } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeTab = {
  value: string;
  label: string;
  content?: ReactNode;
};

export function tabsStyles(scheme: ResolvedTheme = defaultScheme()): {
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

export {
  AxisTabsList as TabsList,
  AxisTabsPanel as TabsPanel,
  AxisTabsRoot as TabsRoot,
  AxisTabsTrigger as TabsTrigger,
  type TabsListProps,
  type TabsPanelProps,
  type TabsRootProps,
  type TabsTriggerProps,
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
  const styles = tabsStyles(scheme);
  const [activeRaw, setActiveRaw] = useState(defaultValue ?? tabs[0]?.value);
  const active = value !== undefined ? value : activeRaw;

  return (
    <AxisTabsRoot
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={(val) => {
        setActiveRaw(val);
        onValueChange?.(val);
      }}
      testID={testID ?? "kern-tabs"}
      style={style}
      {...props}
    >
      <AxisTabsList style={styles.bar}>
        {tabs.map((tab) => {
          const selected = tab.value === active;
          return (
            <AxisTabsTrigger
              key={tab.value}
              value={tab.value}
              aria-label={tab.label}
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
            </AxisTabsTrigger>
          );
        })}
      </AxisTabsList>
      {tabs.map((tab) =>
        tab.content ? (
          <AxisTabsPanel
            key={tab.value}
            value={tab.value}
            style={{ paddingVertical: 16 }}
          >
            {tab.content}
          </AxisTabsPanel>
        ) : null,
      )}
    </AxisTabsRoot>
  );
}

Tabs.Root = AxisTabsRoot;
Tabs.List = AxisTabsList;
Tabs.Trigger = AxisTabsTrigger;
Tabs.Panel = AxisTabsPanel;
