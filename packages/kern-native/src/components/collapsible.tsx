import { useControllableState } from "@xoroh/axis";
import type { ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeCollapsibleProps = Omit<ViewProps, "children" | "style"> & {
  title: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function Collapsible({
  title,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  style,
  testID,
  ...props
}: NativeCollapsibleProps) {
  const scheme = useKernScheme();
  const [open, setOpen] = useControllableState(
    openProp,
    defaultOpen,
    (next) => {
      onOpenChange?.(next);
    },
  );
  const isOpen = open ?? false;
  return (
    <View {...props} testID={testID ?? "kern-collapsible"} style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: isOpen }}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onPress={() => setOpen((previous) => !previous)}
        style={{ minHeight: 48, justifyContent: "center" }}
      >
        <Text variant="label">{title}</Text>
      </Pressable>
      {isOpen ? (
        <View
          style={{
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: scheme.color.outlineVariant,
          }}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}
