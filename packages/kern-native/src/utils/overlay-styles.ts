import { StyleSheet } from "react-native";

/**
 * Shared static presentation for Modal-based overlays. Hoisted with
 * `StyleSheet.create` so every dialog, sheet, menu, and select reuses one
 * registered style instead of allocating per render. Cards stay per
 * component because radius, width, and padding differ.
 */
export const overlayStyles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  bottomScrim: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
});
