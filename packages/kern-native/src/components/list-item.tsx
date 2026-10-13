import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

export function listItemStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
  selected = false,
): {
  row: ViewStyle;
  title: TextStyle;
  supporting: TextStyle;
} {
  return {
    row: {
      minHeight: 56,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: Number.parseFloat(tokens.spacing["space-150"]),
      // M3 selected list item: secondary-container fill, 16dp corners.
      ...(selected
        ? {
            backgroundColor: scheme.color.secondaryContainer,
            borderRadius: 16,
          }
        : null),
    },
    title: {
      fontSize: 14,
      color: selected ? scheme.color.onSecondaryContainer : scheme.color.onSurface,
    },
    supporting: { fontSize: 12, color: scheme.color.onSurfaceVariant },
  };
}

export type NativeListItemProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityRole" | "accessibilityLabel"
> & {
  title: string;
  supporting?: string;
  onPress?: PressableProps["onPress"];
  accessibilityLabel?: string;
  accessibilityRole?: PressableProps["accessibilityRole"];
  /**
   * M3 selected state: secondary-container fill with 16dp corners, ink
   * on-secondary-container.
   */
  selected?: boolean;
  style?: PressableProps["style"];
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function ListItem({
  title,
  supporting,
  contentStyle,
  titleStyle,
  testID,
  onPress,
  disabled,
  selected = false,
  accessibilityLabel,
  accessibilityRole,
  style,
  ...props
}: NativeListItemProps) {
  const { scheme } = useKernTheme();
  const styles = listItemStyles(scheme, selected);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-list-item"}
      accessibilityRole={accessibilityRole ?? (onPress ? "button" : "none")}
      accessibilityLabel={
        accessibilityLabel ?? [title, supporting].filter(Boolean).join(", ")
      }
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && !disabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <View style={[{ flex: 1 }, contentStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {supporting ? (
          <Text style={styles.supporting}>{supporting}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
