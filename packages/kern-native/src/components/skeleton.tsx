import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

export type NativeSkeletonProps = Omit<ViewProps, "children" | "style"> & {
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ style, testID, ...props }: NativeSkeletonProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-skeleton"}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
          backgroundColor: scheme.color.surfaceTonal,
        },
        style,
      ]}
    />
  );
}
