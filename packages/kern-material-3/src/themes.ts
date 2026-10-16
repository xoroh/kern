import brand from "./themes/brand.json";
import compact from "./themes/compact.json";
import demo from "./themes/demo.json";
import material3 from "./themes/material-3.json";
import sharp from "./themes/sharp.json";

/** Copyable named presets, shared by apps, docs, and automation. */
export const themes = {
  "material-3": material3,
  sharp,
  brand,
  compact,
  demo,
} as const;
export type KernThemePresets = typeof themes;
