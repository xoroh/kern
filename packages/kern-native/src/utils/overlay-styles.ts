import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { ViewStyle } from "react-native";

/**
 * Shared scrim geometry for Modal-based overlays. The COLOR is the M3
 * `scheme.color.scrim` token (N10: the old `rgba(0, 0, 0, 0.3)` literal is
 * gone) — so these are functions of the scheme, not a static registered
 * style. Geometry is shared; radius/padding stay per component.
 */

const scrimGeometry: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

const bottomScrimGeometry: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
};

/** Centred-modal scrim: geometry + scheme scrim. */
export function scrimStyle(scheme: ResolvedTheme): ViewStyle {
  return { ...scrimGeometry, backgroundColor: scheme.color.scrim };
}

/** Bottom-sheet scrim: geometry + scheme scrim. */
export function bottomScrimStyle(scheme: ResolvedTheme): ViewStyle {
  return { ...bottomScrimGeometry, backgroundColor: scheme.color.scrim };
}
