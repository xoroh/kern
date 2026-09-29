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
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Table({
  columns,
  rows,
  accessibilityLabel = "Table",
  style,
  testID,
  ...props
}: NativeTableProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-table"}
      accessibilityLabel={accessibilityLabel}
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
