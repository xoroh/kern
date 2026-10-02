import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeTableColumn = {
  key: string;
  title: string;
};

export type NativeTableProps = Omit<ViewProps, "children" | "style"> & {
  columns: NativeTableColumn[];
  rows: Array<Record<string, string>>;
  /**
   * A short summary of what the table holds.
   *
   * Web renders a real `<caption>`, which is semantic: a screen reader announces
   * it as the table's summary. React Native has no caption element, so the
   * substitution is two-part: the text is rendered visibly, AND appended to the
   * table's accessible name. Visible-but-silent would be a caption that exists
   * for sighted users only, which is the failure worth avoiding.
   */
  caption?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Table({
  columns,
  rows,
  caption,
  accessibilityLabel = "Table",
  style,
  testID,
  ...props
}: NativeTableProps) {
  const scheme = useKernScheme();
  // An explicit label names what the table IS; the caption summarises what is IN
  // it. Both are kept, in that order — substituting one for the other would drop
  // information the caller deliberately supplied.
  const label = caption
    ? `${accessibilityLabel}, ${caption}`
    : accessibilityLabel;
  return (
    <View
      {...props}
      testID={testID ?? "kern-table"}
      accessibilityLabel={label}
      style={[
        {
          borderWidth: 1,
          borderColor: scheme.color.outlineVariant,
          borderRadius: Number.parseFloat(scheme.shape.small),
          overflow: "hidden",
        },
        style,
      ]}
    >
      {caption ? (
        <Text
          variant="label"
          style={{
            color: scheme.color.onSurfaceVariant,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          {caption}
        </Text>
      ) : null}
      <View
        accessibilityRole="header"
        style={{
          flexDirection: "row",
          backgroundColor: scheme.color.surfaceTonal,
        }}
      >
        {columns.map((column) => (
          <View
            key={column.key}
            style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {column.title}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row, index) => (
        <View
          key={row[columns[0]?.key ?? ""] ?? index}
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: scheme.color.outlineVariant,
          }}
        >
          {columns.map((column) => (
            <View
              key={column.key}
              style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}
            >
              <Text>{row[column.key] ?? ""}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
