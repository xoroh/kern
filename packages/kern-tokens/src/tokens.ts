import brand from "./themes/brand.json";
import compact from "./themes/compact.json";
import demo from "./themes/demo.json";
import kern from "./themes/kern.json";
import sharp from "./themes/sharp.json";
import data from "./tokens.json";

/** Reference/system tokens. tokens.json is the canonical data source. */
export const tokens = data;
export type KernTokens = typeof tokens;

/** Copyable named presets, shared by apps, docs, and automation. */
export const themes = { kern, sharp, brand, compact, demo } as const;
export type KernThemePresets = typeof themes;

// Pure resolver is safe to import from web and native code.
export * from "./resolve";
