import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeToolbarAction = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function toolbarStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  return {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 56,
    borderRadius: Number.parseFloat(scheme.shape.full),
    backgroundColor: scheme.color.surfaceTonal,
    paddingHorizontal: 8,
  };
}

export type NativeToolbarProps = Omit<ViewProps, "children" | "style"> & {
  actions: NativeToolbarAction[];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Toolbar({
  actions,
  accessibilityLabel = "Toolbar",
  style,
  testID,
  ...props
}: NativeToolbarProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-toolbar"}
      accessibilityRole="toolbar"
      accessibilityLabel={accessibilityLabel}
      style={[toolbarStyles(scheme), style]}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          accessibilityState={{ disabled: action.disabled }}
          disabled={action.disabled}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={action.onPress}
          style={{
            minHeight: 40,
            minWidth: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Number.parseFloat(scheme.shape.full),
            opacity: action.disabled ? 0.5 : 1,
          }}
        >
          <Text variant="label">{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
