import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

export function listItemStyles(): {
  row: ViewStyle;
  title: TextStyle;
  supporting: TextStyle;
} {
  return {
    row: {
      minHeight: 56,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
    },
    title: { fontSize: 14, color: tokens.palettes.neutral["800"].srgb },
    supporting: { fontSize: 12, color: tokens.palettes.neutral["600"].srgb },
  };
}

export type NativeListItemProps = Omit<PressableProps, "children"> & {
  title: string;
  supporting?: string;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function ListItem({
  title,
  supporting,
  contentStyle,
  titleStyle,
  testID,
  ...props
}: NativeListItemProps) {
  const styles = listItemStyles();
  return (
    <Pressable
      testID={testID ?? "kern-list-item"}
      style={styles.row}
      {...props}
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
