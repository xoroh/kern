import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { DISABLED_CONTENT_OPACITY } from "./state-layer";
import { Text } from "./text";

export type NativeToolbarAction = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export type NativeToolbarColor = "standard" | "vibrant";
export type NativeToolbarOrientation = "horizontal" | "vertical";
export type NativeToolbarLayout = "floating" | "docked";

export function toolbarStyles(
  scheme: ResolvedTheme = defaultScheme(),
  options?: {
    color?: NativeToolbarColor;
    orientation?: NativeToolbarOrientation;
    layout?: NativeToolbarLayout;
  },
): ViewStyle {
  const vibrant = options?.color === "vibrant";
  const vertical = options?.orientation === "vertical";
  const docked = options?.layout === "docked";
  return {
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    gap: 4,
    // M3 default height is 64dp on both attachments.
    minHeight: 64,
    // Floating is the detached pill at level3; docked is the square
    // edge-attached bar with 16dp side padding (no elevation token ships
    // for the attached bar, so it carries none).
    borderRadius: docked ? 0 : Number.parseFloat(scheme.shape.full),
    backgroundColor: vibrant
      ? scheme.color.primaryContainer
      : scheme.color.surfaceTonal,
    paddingHorizontal: docked ? 16 : 8,
    paddingVertical: vertical ? 8 : 0,
    ...(docked
      ? null
      : {
          elevation: 6,
          shadowColor: scheme.color.scrim,
          shadowOpacity: 0.3,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
        }),
  };
}

export type NativeToolbarProps = Omit<ViewProps, "children" | "style"> & {
  actions: NativeToolbarAction[];
  accessibilityLabel?: string;
  /**
   * M3 color style: `standard`, or `vibrant` (primary-container fill) for
   * greater emphasis.
   */
  color?: NativeToolbarColor;
  /** M3 floating toolbar layout: horizontal row or vertical column. */
  orientation?: NativeToolbarOrientation;
  /**
   * M3 toolbar attachment. `floating` (default) is the detached pill;
   * `docked` is the square edge-attached bar replacing the bottom app bar.
   */
  layout?: NativeToolbarLayout;
  style?: StyleProp<ViewStyle>;
};

export function Toolbar({
  actions,
  accessibilityLabel = "Toolbar",
  color = "standard",
  orientation = "horizontal",
  layout = "floating",
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
      style={[toolbarStyles(scheme, { color, orientation, layout }), style]}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          aria-disabled={action.disabled}
          disabled={action.disabled}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={action.onPress}
          style={{
            minHeight: 40,
            minWidth: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Number.parseFloat(scheme.shape.full),
            opacity: action.disabled ? DISABLED_CONTENT_OPACITY : 1,
          }}
        >
          <Text variant="label">{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
