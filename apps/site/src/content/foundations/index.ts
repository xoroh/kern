/**
 * Foundations barrel — one specifier for the styles routes.
 *
 * The split (one module per topic + shared `tokens.ts` prelude) is the same
 * model as `content/web` and `content/mobile`: topics stay independently
 * readable, and no route reaches past this barrel into a topic file.
 */
export * from "./color";
export * from "./color-usage";
export * from "./elevation";
export * from "./motion";
export * from "./shape";
export * from "./spacing";
export * from "./states";
export * from "./tokens";
export * from "./typography";
