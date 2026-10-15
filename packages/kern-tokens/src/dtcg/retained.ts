/**
 * Retained-type notes (KERN-020) — valid standard composites with no renderer
 * projection are RETAINED in the graph, with an explicit note.
 *
 * `strokeStyle`, `border`, `transition` and `gradient` parse and validate as
 * ordinary DTCG, and a valid import of one must survive the round trip even
 * though no Kern renderer projects it to component styles. Dropping them
 * would make import lossy-silent; failing them would make valid third-party
 * token files unusable. The note is the honest third option.
 */

import type { ImportDiagnostic } from "./import";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Standard composites with no renderer projection — retained, noted. */
export const RETAINED_TYPES = new Set([
  "strokeStyle",
  "border",
  "transition",
  "gradient",
]);

/**
 * Note retained standard composites: walk the SOURCE document (not the
 * graph) so group-inherited types are visible, and record every token whose
 * effective type is retained-but-unprojected.
 */
export function retainedNotes(
  doc: Record<string, unknown>,
): ImportDiagnostic[] {
  const notes: ImportDiagnostic[] = [];
  const walk = (
    node: Record<string, unknown>,
    path: string,
    inherited?: string,
  ): void => {
    const type = typeof node.$type === "string" ? node.$type : inherited;
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      if (!isRecord(value)) continue;
      const childPath = path ? `${path}.${key}` : key;
      if ("$value" in value) {
        const effective =
          typeof value.$type === "string" ? (value.$type as string) : type;
        if (effective && RETAINED_TYPES.has(effective)) {
          notes.push({
            path: childPath,
            code: "unsupported",
            detail: `${effective} is valid DTCG but has no renderer projection; retained in the graph`,
            severity: "note",
          });
        }
        continue;
      }
      walk(value, childPath, type);
    }
  };
  walk(doc, "");
  return notes;
}
