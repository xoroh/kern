import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ViewStyle } from "react-native";

/**
 * M3 bottom-sheet surface tokens — `surfaceContainerLow`, XL top corners.
 *
 * ## Why this file exists separately from `sheet-surface.tsx`
 *
 * `SheetSurface` is the first candidate for extraction into the primitives layer,
 * and that layer's gate forbids importing `kern-tokens`. This function does
 * exactly that — it reads the resolved scheme and the spacing ramp — so leaving
 * it in the same module as `SheetSurface` would have put a theme-coupled export
 * inside the first extraction step and the gate would have failed on arrival
 * instead of proving the boundary.
 *
 * ## Why it is NOT in `utils/overlay-styles.ts`
 *
 * That was the first attempt and it does not work. `overlay-styles.ts` holds
 * `overlayStyles`, the static scrim geometry shared by eleven components
 * (dialog, menu, select, drawer, sheet, menubar, …), so it cannot be moved
 * without touching all of them — and `SheetSurface` imports `overlayStyles`, so
 * placing this function there made the theme dependency **transitive**:
 * `sheet-surface` → `overlay-styles` → `kern-tokens`. `SheetSurface`'s own source
 * would have been clean and its dependency graph would still have crossed the
 * gate.
 *
 * This file is a leaf with exactly one importer, so the dependency is direct and
 * the gate can see it. A `check:primitives` gate must therefore walk the import
 * graph, not grep one file — the single-file version of that check passes here,
 * which is why it is called out rather than discovered later.
 */
export function bottomSheetSurface(
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  return {
    backgroundColor: scheme.color.surfaceContainerLow,
    borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
    borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
    paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
    paddingBottom: Number.parseFloat(tokens.spacing["space-400"]),
    paddingTop: Number.parseFloat(tokens.spacing["space-100"]),
    maxHeight: "50%",
  };
}
