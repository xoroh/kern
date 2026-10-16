/**
 * `@xoroh/kern-material-3` — Material Design 3 as a Kern design system.
 *
 * Everything M3-specific lives here: role tables and presets, the contrast
 * policy and pair builders, seed-theme generation, feedback spec and
 * expressive shapes. The universal engine (`@xoroh/kern-tokens`) knows none
 * of it — importing this module registers the M3 preset tables, policy and
 * overrides with the resolver (side effect, documented here and nowhere
 * hidden: consumers that resolve M3 themes import this package).
 */

export * from "./expressive-shapes";
export * from "./feedback";
export * from "./kern-elevation";
export * from "./kern-roles";
export * from "./material-3";
export * from "./seed-theme";
export { type KernThemePresets, themes } from "./themes";
