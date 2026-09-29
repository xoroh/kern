import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeNavigationMenuItem = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export type NativeNavigationMenuProps = Omit<
  ViewProps,
  "children" | "style"
> & {
  items: NativeNavigationMenuItem[];
  style?: StyleProp<ViewStyle>;
};

export function NavigationMenu({
  items,
  style,
  testID,
  ...props
}: NativeNavigationMenuProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-navigation-menu"}
      style={[{ flexDirection: "row", alignItems: "center", gap: 4 }, style]}
    >
      {items.map((item) => (
        <Pressable
          key={item.label}
          accessibilityRole="link"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: item.active }}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={item.onPress}
          style={{
            minHeight: 40,
            justifyContent: "center",
            paddingHorizontal: 16,
            borderRadius: Number.parseFloat(scheme.shape.full),
            backgroundColor: item.active
              ? scheme.color.surfaceTonal
              : "transparent",
          }}
        >
          <Text variant="label">{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
