import { STATE_LAYER_OPACITIES } from "@xoroh/kern-tokens";
import { View, type ViewStyle } from "react-native";

/**
 * M3 pressed state layer for React Native — the single shared helper.
 *
 * Material 3 never dims a control to signal press. The press is a state
 * LAYER: an overlay in the content (on-) color at the pressed state-layer
 * opacity, clipped to the container shape. The opacity is read from the
 * DTCG `states.press-opacity` token (`STATE_LAYER_OPACITIES.press`, 10%),
 * never hardcoded, so a token change moves every control at once.
 *
 * Container contract (call-site responsibility): the `Pressable` hosting a
 * `StateLayer` keeps `overflow: "hidden"` plus the same `borderRadius` the
 * layer is given, or the layer escapes the container shape. The layer
 * itself is `pointerEvents="none"` and hidden from assistive tech — it is
 * paint, not content.
 *
 * Driven only by the pressed state the host `Pressable` exposes (the
 * `style`/`children` render-prop `pressed`): no new pressed logic lives
 * here or in Kern.
 */

/** M3 disabled content wash — DTCG `states.disabled-opacity` (38%). */
export const DISABLED_CONTENT_OPACITY = STATE_LAYER_OPACITIES.disabled;

/**
 * Append an alpha channel to a 6-digit hex color (`#RRGGBB` → `#RRGGBBAA`).
 * Non-hex colors pass through untouched.
 */
export function withAlpha(color: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const byte = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${byte}`;
  }
  return color;
}

/** The pressed wash color for an ink: content color at press opacity. */
export function stateLayerColor(ink: string): string {
  return withAlpha(ink, STATE_LAYER_OPACITIES.press);
}

/**
 * Absolute-fill overlay style for an ink at press opacity, clipped to
 * `radius`. Spread onto a `View` with `pointerEvents="none"` — or render
 * {@link StateLayer}, which does exactly that.
 */
export function stateLayerStyle(ink: string, radius = 0): ViewStyle {
  return {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: stateLayerColor(ink),
    borderRadius: radius,
  };
}

export type StateLayerProps = {
  /** Content (on-) color the wash is drawn in. */
  ink: string;
  /** Must match the container's `borderRadius` (container clips it). */
  radius?: number;
  /** The host `Pressable`'s pressed state — nothing else. */
  visible: boolean;
  testID?: string;
};

/** Paint-only pressed wash. Returns null when not pressed. */
export function StateLayer({ ink, radius = 0, visible, testID }: StateLayerProps) {
  if (!visible) return null;
  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={stateLayerStyle(ink, radius)}
    />
  );
}
