/**
 * `@xoroh/kern-m3` — Material Design 3 as a Kern design system.
 *
 * Everything M3-specific lives here: role tables and presets, the contrast
 * policy and pair builders, seed-theme generation, feedback spec and
 * expressive shapes. The universal engine (`@xoroh/kern-tokens`) knows none
 * of it. Importing this package registers NOTHING with the universal theme
 * resolver (decision 010): no system is the implicit global default. M3
 * resolves only when the application calls `registerM3()` — one explicit
 * call at entry, never an import side effect.
 */

export * from "./expressive-shapes";
export * from "./feedback";
export * from "./kern-elevation";
export * from "./kern-roles";
export * from "./material-3";
export * from "./seed-theme";
export { type KernThemePresets, themes } from "./themes";
