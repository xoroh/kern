/**
 * Normalized token graph (KERN-018) — typed references over dotted addresses.
 *
 * The graph is the ONE structure both projections read: the DTCG exporter,
 * the CSS/native generators and the validators. A dotted id addresses a node
 * (`palettes.primary.500`, `sys.color.light.primary`); a node is either a
 * VALUE (leaf data) or an ALIAS (a `{path.to.target}` reference another node
 * must resolve). References resolve deterministically with the full chain on
 * every error — a cycle that reports only its endpoint cannot be fixed.
 *
 * Supported reference machinery (all of it tested, none of it assumed):
 * - `{a.b.c}` curly-brace alias chains, including chains through chains.
 * - Group `$type` inheritance: a group's type flows to typeless children.
 * - `$extends` deep merging with whole-token replacement.
 * - Local RFC6901 `$ref` JSON Pointers (`#/a/b`, `~0`/`~1` escaping,
 *   `$value`/composite property/array indexing). Remote URL/file pointers are
 *   REJECTED — local pointer support must never be mistaken for unsafe
 *   dereferencing (a token file is untrusted input until validated).
 */

export type GraphNode = {
  /** Dotted address, e.g. `palettes.primary.500`. */
  id: string;
  /** DTCG type (`color`, `dimension`, …) or Kern kind; undefined until set. */
  type?: string;
  /** Leaf data. Undefined for groups and unresolved aliases. */
  value?: unknown;
  /** Alias target id, when this node is a reference. */
  ref?: string;
  description?: string;
  deprecated?: boolean;
  extensions?: Record<string, unknown>;
};

export type TokenGraph = {
  nodes: Map<string, GraphNode>;
};

export function emptyGraph(): TokenGraph {
  return { nodes: new Map() };
}

function fail(what: string): never {
  throw new Error(`Unresolvable token graph: ${what}`);
}

function isExtensions(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Split a dotted id, honouring nothing — dots are always separators here. */
export function splitId(id: string): string[] {
  if (!id.trim()) fail("an empty id is not an address");
  return id.split(".");
}

/**
 * Resolve an alias chain from `id`. Returns the terminal VALUE node.
 * Throws with the FULL chain on cycles and missing targets: `a -> b -> a`,
 * not just `a`.
 */
export function resolveAlias(graph: TokenGraph, id: string): GraphNode {
  const chain: string[] = [id];
  const first = graph.nodes.get(id);
  if (!first) fail(`missing reference "${id}" (chain: ${chain.join(" -> ")})`);
  let current: GraphNode = first as GraphNode;
  const seen = new Set([id]);
  while (current.ref) {
    const target: string = current.ref;
    if (seen.has(target)) {
      fail(`reference cycle: ${[...chain, target].join(" -> ")}`);
    }
    seen.add(target);
    chain.push(target);
    const next = graph.nodes.get(target);
    if (!next) {
      fail(`missing reference "${target}" (chain: ${chain.join(" -> ")})`);
    }
    current = next as GraphNode;
  }
  return current;
}

/**
 * Resolve a LOCAL RFC6901 JSON Pointer against `doc`.
 * `#/a/b`, `~0` for `~`, `~1` for `/`, numeric segments index arrays.
 * Anything remote (`https:`, `file:`, bare paths) is rejected outright.
 */
export function resolvePointer(doc: unknown, pointer: string): unknown {
  if (!pointer.startsWith("#/") && pointer !== "#") {
    fail(
      `remote or bare pointer "${pointer}" — only local "#/…" pointers resolve`,
    );
  }
  if (pointer === "#") return doc;
  const segments = pointer
    .slice(2)
    .split("/")
    .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
  let current: unknown = doc;
  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        fail(`pointer "${pointer}" indexes outside the array`);
      }
      current = current[index];
      continue;
    }
    if (typeof current !== "object" || current === null) {
      fail(`pointer "${pointer}" walks through a leaf at "${segment}"`);
    }
    if (!(segment in (current as Record<string, unknown>))) {
      fail(`pointer "${pointer}" has no "${segment}"`);
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

/**
 * `$extends` deep merge with whole-token replacement: objects merge
 * recursively, but a LEAF (anything with `$value`, or a non-object) in the
 * extension REPLACES the base wholesale. Merging a leaf field-by-field is how
 * half a color survives an override.
 */
export function mergeExtends(
  base: Record<string, unknown>,
  ext: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(ext)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      fail(`$extends carries a prototype key "${key}"`);
    }
    const existing = out[key];
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof existing === "object" &&
      existing !== null &&
      !Array.isArray(existing) &&
      !("$value" in (value as Record<string, unknown>))
    ) {
      out[key] = mergeExtends(
        existing as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      continue;
    }
    out[key] = value;
  }
  return out;
}

/**
 * Build a graph from a nested authoring/DTCG-style document. Groups become
 * typeless nodes; leaves with `$value` become value nodes (type from `$type`
 * or the inherited group type); string leaves matching `{a.b.c}` become
 * aliases. `$extends` (string or array) merges before walking.
 */
export function buildGraph(
  doc: Record<string, unknown>,
  root = "",
): TokenGraph {
  const graph = emptyGraph();
  const extended = Array.isArray(doc.$extends)
    ? (doc.$extends as Record<string, unknown>[]).reduce(
        (acc, e) => mergeExtends(acc, e),
        { ...doc },
      )
    : typeof doc.$extends === "string"
      ? doc
      : doc;
  walk(graph, extended, root, undefined);
  return graph;
}

function walk(
  graph: TokenGraph,
  node: unknown,
  prefix: string,
  inheritedType: string | undefined,
): void {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    if (prefix) {
      const existing = graph.nodes.get(prefix);
      if (
        existing &&
        existing.value === undefined &&
        existing.ref === undefined
      ) {
        existing.value = node;
      } else {
        graph.nodes.set(prefix, { id: prefix, value: node });
      }
    }
    return;
  }
  const record = node as Record<string, unknown>;
  const type = typeof record.$type === "string" ? record.$type : inheritedType;
  if (prefix) {
    // Groups carry extensions too (elevation levels keep their full CSS and
    // dark shadows here). Dropping them makes the import lossy at exactly the
    // place the exporter was careful — the round trip must preserve what the
    // export wrote.
    const groupNode: GraphNode = { id: prefix, type };
    if (typeof record.$description === "string") {
      groupNode.description = record.$description;
    }
    if (isExtensions(record.$extensions)) {
      groupNode.extensions = record.$extensions;
    }
    graph.nodes.set(prefix, groupNode);
  }
  for (const [key, value] of Object.keys(record)
    .filter(
      (k) =>
        k !== "$type" &&
        k !== "$extends" &&
        k !== "$description" &&
        k !== "$extensions" &&
        k !== "__proto__" &&
        k !== "constructor" &&
        k !== "prototype",
    )
    .map((k) => [k, record[k]] as const)) {
    const id = prefix ? `${prefix}.${key}` : key;
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      "$value" in (value as Record<string, unknown>)
    ) {
      const token = value as Record<string, unknown>;
      const alias =
        typeof token.$value === "string"
          ? aliasTarget(token.$value as string)
          : undefined;
      graph.nodes.set(id, {
        id,
        type: typeof token.$type === "string" ? token.$type : type,
        value: alias ? undefined : token.$value,
        ref: alias,
        description:
          typeof token.$description === "string"
            ? token.$description
            : undefined,
        deprecated: token.$deprecated === true ? true : undefined,
        extensions:
          typeof token.$extensions === "object" && token.$extensions !== null
            ? (token.$extensions as Record<string, unknown>)
            : undefined,
      });
      continue;
    }
    if (typeof value === "string") {
      const alias = aliasTarget(value);
      if (alias) {
        graph.nodes.set(id, { id, type, ref: alias });
        continue;
      }
    }
    walk(graph, value, id, type);
  }
}

/** A whole-string `{dotted.path}` is an alias; anything else is a value. */
export function aliasTarget(value: string): string | undefined {
  const m = /^\{([A-Za-z0-9_.-]+)\}$/.exec(value.trim());
  return m ? m[1] : undefined;
}
