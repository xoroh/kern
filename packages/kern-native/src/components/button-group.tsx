import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export type NativeButtonGroupProps = Omit<ViewProps, "style"> & {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
  /**
   * M3 Expressive group variant. `connected` (default) joins the buttons
   * into one control — the expressive successor to the segmented button:
   * inner corners square to 8dp (corner-small) while outer ends keep their
   * pill shape, separated by a 2dp gap. `standard` spaces the buttons as
   * individuals with an 8dp gap.
   */
  variant?: "standard" | "connected";
  style?: StyleProp<ViewStyle>;
};

const staticStyles = StyleSheet.create({
  connectedHorizontal: {
    flexDirection: "row",
    gap: 0,
  },
  connectedVertical: {
    flexDirection: "column",
    gap: 0,
  },
  standardHorizontal: {
    flexDirection: "row",
    gap: 8,
  },
  standardVertical: {
    flexDirection: "column",
    gap: 8,
  },
});

const INNER_CORNER_DP = 8;

/** Lays out Button children as one joined row or column. */
export function ButtonGroup({
  children,
  orientation = "horizontal",
  variant = "connected",
  style,
  testID,
  ...props
}: NativeButtonGroupProps) {
  const horizontal = orientation === "horizontal";
  const connected = variant === "connected";
  const items = Children.toArray(children);

  const joinedChildren =
    connected && items.length > 1
      ? items.map((child, idx) => {
          if (
            !isValidElement<{
              style?:
                | StyleProp<ViewStyle>
                | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
            }>(child)
          ) {
            return child;
          }
          const isFirst = idx === 0;
          const isLast = idx === items.length - 1;
          const cornerOverride: ViewStyle = horizontal
            ? {
                ...(isFirst
                  ? {
                      borderTopRightRadius: INNER_CORNER_DP,
                      borderBottomRightRadius: INNER_CORNER_DP,
                    }
                  : isLast
                    ? {
                        borderTopLeftRadius: INNER_CORNER_DP,
                        borderBottomLeftRadius: INNER_CORNER_DP,
                      }
                    : {
                        borderRadius: INNER_CORNER_DP,
                      }),
              }
            : {
                ...(isFirst
                  ? {
                      borderBottomLeftRadius: INNER_CORNER_DP,
                      borderBottomRightRadius: INNER_CORNER_DP,
                    }
                  : isLast
                    ? {
                        borderTopLeftRadius: INNER_CORNER_DP,
                        borderTopRightRadius: INNER_CORNER_DP,
                      }
                    : {
                        borderRadius: INNER_CORNER_DP,
                      }),
              };
          const prevStyle = child.props.style;
          return cloneElement(child, {
            style:
              typeof prevStyle === "function"
                ? (state: { pressed: boolean }) => [
                    prevStyle(state),
                    cornerOverride,
                  ]
                : [prevStyle, cornerOverride],
          });
        })
      : children;

  return (
    <View
      {...props}
      testID={testID ?? "kern-button-group"}
      role="group"
      accessibilityRole="none"
      style={[
        horizontal
          ? connected
            ? staticStyles.connectedHorizontal
            : staticStyles.standardHorizontal
          : connected
            ? staticStyles.connectedVertical
            : staticStyles.standardVertical,
        style,
      ]}
    >
      {joinedChildren}
    </View>
  );
}
