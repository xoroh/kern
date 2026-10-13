/**
 * DTCG import (KERN-020) — DTCG 2025.10 document → canonical graph.
 *
 * A validated conversion INTO the authoring graph, not execution of arbitrary
 * external configuration. Semantics preserved on roundtrip: values, aliases
 * and supported extensions. Unsupported content is a TYPED diagnostic, never
 * a silent drop:
 * - valid standard composites outside renderer capabilities (strokeStyle,
 *   border, transition, gradient) are RETAINED in the graph with an explicit
 *   projection note;
 * - unsupported type strings and unsafe pointers are ERRORS;
 * - untrusted input is bounded (nodes, no prototype keys, no URL/file
 *   dereference — `resolvePointer` rejects anything non-local).
 */

import { buildGraph, mergeExtends, type TokenGraph } from "../token-graph";
import { retainedNotes } from "./retained";
import { type DtcgDiagnostic, validateDtcg } from "./validate";

export type ImportDiagnostic = DtcgDiagnostic & { severity: "error" | "note" };

export type ImportResult = {
  graph: TokenGraph;
  /** Errors block use; notes record supported-but-unprojected content. */
  diagnostics: ImportDiagnostic[];
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const MAX_NODES = 20000;

function fail(what: string): never {
  throw new Error(`DTCG import: ${what}`);
}

/**
 * Import a DTCG document into the canonical graph. Validation diagnostics
 * become errors; retained-type notes are appended. Throws only when the root
 * is not an object — everything else is a diagnostic.
 */
export function fromDtcg(doc: unknown): ImportResult {
  if (!isRecord(doc)) fail("root is not an object");
  const record = doc as Record<string, unknown>;
  const errors: ImportDiagnostic[] = validateDtcg(record).map((d) => ({
    ...d,
    severity: "error" as const,
  }));
  if (errors.length > 0)
    return { graph: { nodes: new Map() }, diagnostics: errors };

  // Resolve $extends before walking so the graph sees the merged document —
  // the same precedence the exporter assumes.
  let merged: Record<string, unknown> = { ...record };
  if (record.$extends !== undefined) {
    const ext = record.$extends;
    const bases = (Array.isArray(ext) ? ext : [ext]) as Record<
      string,
      unknown
    >[];
    const { $extends: _drop, ...rest } = merged;
    void _drop;
    // Bases first, the document itself wins: `$extends` supplies defaults,
    // never overrides. Reversing the order would let a base silently rewrite
    // the document that extends it.
    const base = bases.reduce((acc, b) => mergeExtends(acc, b), {});
    merged = mergeExtends(base, rest);
  }

  const graph = buildGraph(merged);
  if (graph.nodes.size > MAX_NODES) {
    return {
      graph: { nodes: new Map() },
      diagnostics: [
        {
          path: "$",
          code: "unsupported",
          detail: `document exceeds ${MAX_NODES} nodes`,
          severity: "error",
        },
      ],
    };
  }

  applyPointerRefs(merged, graph);
  return { graph, diagnostics: retainedNotes(merged) };
}

/**
 * Convert local `$ref` pointers into graph refs. `#/a/b/0/c` becomes the
 * dotted id `a.b.0.c` — the same address space aliases use, so pointers and
 * curly-brace references resolve through one path. Remote pointers never reach
 * here: validation already failed them as errors.
 */
function applyPointerRefs(
  doc: Record<string, unknown>,
  graph: TokenGraph,
): void {
  const walk = (node: Record<string, unknown>, path: string): void => {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      if (!isRecord(value)) continue;
      const childPath = path ? `${path}.${key}` : key;
      if (typeof value.$ref === "string" && !("$value" in value)) {
        const pointer = value.$ref as string;
        const target = pointer
          .replace(/^#\//, "")
          .split("/")
          .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"))
          .join(".");
        const graphNode = graph.nodes.get(childPath);
        if (graphNode) graphNode.ref = target;
        continue;
      }
      walk(value, childPath);
    }
  };
  walk(doc, "");
}
