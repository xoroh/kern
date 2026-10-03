/**
 * Maturity resolution for the site's state chips (D-038).
 *
 * The DATA comes from `@xoroh/kern-mcp/maturity` — the single generated
 * source of truth, imported directly. An earlier revision kept a second
 * generated copy in `src/generated/` (`33ea5ab`); two generators for one
 * artefact already drifted once, so the copy was deleted and this module
 * imports instead. What lives here is only RESOLUTION logic: how a page
 * derives the state it may assert from the exports it owns.
 */
import {
  MATURITY,
  MATURITY_BY_STATE,
  type MaturityRow,
  type MaturityState,
} from "@xoroh/kern-mcp/maturity";

export type { MaturityRow, MaturityState };
export { MATURITY, MATURITY_BY_STATE };

const BY_EXPORT = new Map<string, MaturityRow>();
const BY_EXPORT_PLATFORM = new Map<string, MaturityRow>();
for (const row of MATURITY) {
  BY_EXPORT.set(row.export, row);
  BY_EXPORT_PLATFORM.set(`${row.export}::${row.platform}`, row);
}

/** Maturity of a single export on a single renderer. */
export function maturityForExport(
  exportName: string,
  platform: "web" | "native",
): MaturityRow | undefined {
  return (
    BY_EXPORT_PLATFORM.get(`${exportName}::${platform}`) ??
    BY_EXPORT.get(exportName)
  );
}

/**
 * The maturity a page may assert, given the exports it owns.
 *
 * Asserts a state only when EVERY owned export agrees — a page spanning a
 * Preview part and a Stable part has no single honest state, so it gets none
 * rather than a majority vote that would be a claim nothing backs.
 * Returns undefined when the source knows none of the names, so a stale page
 * renders no chip instead of inventing one.
 */
export function maturityForExports(
  exportNames: readonly string[],
  platform: "web" | "native",
): { state: MaturityState; version: string } | undefined {
  const rowsFor = exportNames
    .map((n) => maturityForExport(n, platform))
    .filter((r): r is MaturityRow => r !== undefined);
  if (rowsFor.length === 0) return undefined;
  const states = new Set(rowsFor.map((r) => r.state));
  const versions = new Set(rowsFor.map((r) => r.version));
  if (states.size !== 1 || versions.size !== 1) return undefined;
  return { state: rowsFor[0].state, version: rowsFor[0].version };
}
