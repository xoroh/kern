/**
 * `@xoroh/kern-contracts` — versioned platform-free metadata vocabulary.
 *
 * Why this package exists (ADR-P02): both renderers, the token/theme
 * validation, the CLI, the MCP server and the registry generator need ONE
 * versioned metadata shape. `parity/contract.ts` is repo-owned test data, not
 * a published contract; placing the schema in primitives would violate its
 * behavioral focus; MCP-only ownership would make runtime consumers depend on
 * tooling.
 *
 * PURE by construction: types, schema data and validators only. No React, no
 * DOM, no React Native, no CSS, no test runner, no UI implementation. Anything
 * that would need one of those lives elsewhere and is rejected in review.
 */

export * from "./block";
export * from "./component";
export * from "./icon";
export * from "./install";
export * from "./provider";
export * from "./version";
export { CONTRACT_SCHEMA_VERSION } from "./version";
