import data from "./tokens.json";

/** Reference/system tokens. tokens.json is the canonical data source. */
export const tokens = data;
export type KernTokens = typeof tokens;

// Universal theme engine: resolution, validation, registration, projection
// helpers. Design-system data (presets, policies) registers through it;
// the engine itself carries no design-system tables.
export * from "./resolve";
