#!/usr/bin/env node
/**
 * check:layers — the D-034 package map, asserted mechanically.
 *
 * ## Why this exists
 *
 * The package map (`.team/reports/P2d-package-structure-ruling.md`) was, until
 * this gate, a table a human maintained. That is exactly the kind of claim that
 * drifts: the P2c primitives study said `useControllableState` had 18 consumers
 * when it had 21, and the parity counts were hand-adjusted twice before the gate
 * forced the real number. A structure nobody enforces is a structure that is
 * eventually wrong and still looks right.
 *
 * ## What it asserts
 *
 * The layering is `primitives -> tokens -> renderers`:
 *
 *   primitives  un-styled behaviour kernel. Knows NOTHING.
 *   tokens      token engine + M3 conformance. Knows NOTHING (no React, no DOM).
 *   renderers   kern (web), kern-native (RN). Know tokens. Never each other.
 *
 * Two rules, because both have been violated in this repo before:
 *
 *   1. A layer may only depend on layers BELOW it. `tokens` depending on
 *      `renderers` is what folding tokens into core would have produced.
 *   2. No renderer-to-renderer edge, in either direction. `kern-native`
 *      importing `@xoroh/kern` would pull react-dom and Base UI into a React
 *      Native bundle and invert ADR 002.
 *
 * ## What it deliberately does NOT do
 *
 * It reads `package.json`, not the import graph. That is the right granularity
 * for a *package* map: the question here is which package may know about which,
 * and a declared dependency is the honest answer to that. Whether a given FILE
 * crosses a boundary inside a package is `check:primitives`' job, and that gate
 * walks the import graph because a per-file grep provably passes a file whose
 * transitive import crosses the line.
 *
 * Both dev and runtime dependencies are read. A boundary held only because a
 * package forgot to declare something is not held.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { builtinModules } from "node:module";
import { join } from "node:path";
import ts from "typescript";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PKGS = join(ROOT, "packages");

/**
 * RANK is the layering. Lower may be depended on by higher.
 * 0 = knows nothing, 2 = renderer (depends on 0 and 1).
 */
const LAYERS = {
  "@xoroh/kern-primitives": {
    rank: 0,
    blurb: "un-styled behaviour kernel",
  },
  "@xoroh/kern-tokens": { rank: 0, blurb: "token engine + M3 conformance" },
  "@xoroh/kern-icons": { rank: 0, blurb: "standalone icon set" },
  "@xoroh/kern": { rank: 2, blurb: "web renderer" },
  "@xoroh/kern-native": { rank: 2, blurb: "React Native renderer" },
};

/** Tooling: no layering constraint. It reads the registry; it is not part of it. */
const TOOLING = new Set(["@xoroh/kern-mcp", "@xoroh/cli"]);

/** Both renderers. An edge between any two of these inverts ADR 002. */
const RENDERERS = new Set(["@xoroh/kern", "@xoroh/kern-native"]);

function declaredXorohDeps(dir) {
  const pj = join(dir, "package.json");
  if (!existsSync(pj)) return { name: null, deps: [], dir };
  const pkg = JSON.parse(readFileSync(pj, "utf8"));
  const all = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
  return {
    name: pkg.name ?? null,
    deps: Object.keys(all).filter((d) => d.startsWith("@xoroh/")),
    dir,
  };
}

const found = [];
for (const entry of readdirSync(PKGS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = join(PKGS, entry.name);
  const info = declaredXorohDeps(dir);
  if (info.name) found.push(info);
}

const violations = [];

// --- D-038: every bare import must resolve to a DECLARED dependency ---------
// The `types[]` rule above reads what a tsconfig ASKS for. This reads what the
// source IMPORTS — the axe-core class, where a test imports a package nobody
// declares. It typechecks in a warm workspace (hoisted node_modules happens to
// hold it) and fails on a cold install, which is how that defect shipped.
//
// Scoped deliberately to reduce false positives, because a gate that cries wolf
// gets ignored:
//   * bare specifiers only — a relative `./x` is not a dependency
//   * builtins and `node:` are exempt
//   * a SUBPATH resolves to its package (`react/jsx-runtime` -> `react`), the
//     same rule the types[] check uses; demanding `@types/react/jsx-runtime`
//     would be nonsense
//   * type-only imports count: they are still a dependency

/** `@scope/name/sub/path` -> `@scope/name`; `name/sub` -> `name` */
function packageNameOf(id) {
  const parts = id.split("/");
  return id.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

for (const entry of readdirSync(join(ROOT, "packages"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;
  const dir = join(ROOT, "packages", entry.name);
  const manifestPath = join(dir, "package.json");
  if (!existsSync(manifestPath)) continue;
  const pkg = JSON.parse(readFileSync(manifestPath, "utf8"));

  const declared = new Set(
    [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
    ].map((d) => d.toLowerCase()),
  );

  const undeclared = new Map();
  const srcDir = join(dir, "src");
  if (!existsSync(srcDir)) continue;

  const walk = (d, depth = 0) => {
    if (depth > 6) return;
    let files;
    try {
      files = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const f of files) {
      if (f.name === "node_modules" || f.name === "dist") continue;
      const full = join(d, f.name);
      if (f.isDirectory()) {
        walk(full, depth + 1);
        continue;
      }
      if (!/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(f.name)) continue;
      // Parse rather than regex. The AST sees only real module specifiers, so a
      // comment saying `... from "x"` cannot invent an import. This gate's
      // value depends entirely on not crying wolf: a false positive here gets
      // the whole gate ignored, which is worse than having no gate.
      const text = readFileSync(full, "utf8");
      let sf;
      try {
        sf = ts.createSourceFile(
          full,
          text,
          ts.ScriptTarget.Latest,
          /* setParentNodes */ false,
        );
      } catch {
        continue; // unreadable here; typecheck reports it properly
      }

      const specs = new Set();
      const addSpec = (node) => {
        if (node && ts.isStringLiteralLike(node)) specs.add(node.text);
      };
      const visit = (node) => {
        // import x from "p" / export x from "p" / import "p"
        if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
          addSpec(node.moduleSpecifier);
        }
        // import("p") and require("p") -- both resolve at runtime
        if (
          ts.isCallExpression(node) &&
          node.arguments.length === 1 &&
          (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
            (ts.isIdentifier(node.expression) &&
              node.expression.text === "require"))
        ) {
          addSpec(node.arguments[0]);
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);

      for (const spec of specs) {
        if (
          spec.startsWith(".") ||
          spec.startsWith("/") ||
          spec.startsWith("#")
        )
          continue;
        if (spec.startsWith("node:") || spec.startsWith("bun:")) continue;
        if (builtinModules.includes(spec)) continue;
        // A package importing itself is a test convenience, not a dependency.
        if (spec === pkg.name) continue;
        // Repo-internal aliases, not packages: the parity contract lives at the
        // repo root and is reached through a path alias on purpose (ADR 002 --
        // neither renderer imports the other to read it).
        if (spec.startsWith("@kern-parity/")) continue;
        const pkgName = packageNameOf(spec).toLowerCase();
        if (declared.has(pkgName)) continue;
        if (!undeclared.has(pkgName)) undeclared.set(pkgName, full);
      }
    }
  };
  walk(srcDir);

  for (const [name, file] of undeclared) {
    violations.push(
      `${pkg.name}: imports "${name}" but no dependency declares it (first seen in ${file.replace(`${ROOT}/`, "")})`,
    );
  }
}

// --- D-037: the build graph must be acyclic, and must COVER every buildable -----
// Build order is derived from these same declarations, so a cycle here is a
// cycle in the build. The orchestrator would catch it too, but as a build
// failure; this reports it as a gate failure, before anything is built.
const XOROH_SCOPE = /^@xoroh\//;

/** @type {Map<string, Set<string>>} */
const graph = new Map();
const buildablePkgs = new Set(); // package NAMES only

for (const entry of readdirSync(join(ROOT, "packages"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;
  const dir = join(ROOT, "packages", entry.name);
  const manifestPath = join(dir, "package.json");
  if (!existsSync(manifestPath)) continue;
  const pkg = JSON.parse(readFileSync(manifestPath, "utf8"));
  const name = pkg.name;
  if (!name) continue;
  const edges = new Set();
  for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
    for (const dep of Object.keys(pkg[field] ?? {})) {
      if (XOROH_SCOPE.test(dep)) edges.add(dep);
    }
  }
  graph.set(name, edges);
  if (pkg.scripts?.build) buildablePkgs.add(name);
}

if (graph.size) {
  // Kahn's algorithm. Anything left with a non-zero in-degree after the sweep
  // is on, or downstream of, a cycle.
  const indegree = new Map([...graph].map(([n, e]) => [n, e.size]));
  const queue = [...indegree].filter(([, d]) => d === 0).map(([n]) => n);
  const order = [];
  while (queue.length) {
    const n = queue.shift();
    order.push(n);
    for (const [m, edges] of graph) {
      if (edges.has(n)) {
        indegree.set(m, indegree.get(m) - 1);
        if (indegree.get(m) === 0) queue.push(m);
      }
    }
  }

  if (order.length !== graph.size) {
    const stuck = [...indegree]
      .filter(([n]) => !order.includes(n))
      .map(([n]) => n)
      .sort();
    violations.push(
      `package graph contains a CYCLE among: ${stuck.join(", ")} — build order cannot be derived`,
    );
  }

  // Every buildable package must be reachable in the derived order, or it will
  // silently never be built.
  const missing = [...buildablePkgs.keys()].filter((n) => !order.includes(n));
  if (missing.length) {
    violations.push(
      `buildable package(s) absent from the derived build order: ${missing.sort().join(", ")}`,
    );
  }
}

// --- D-036: every tsconfig `types[]` entry must be a DECLARED dependency -------
// A `types` entry is a dependency declaration living in the wrong file. It
// typechecks in a warm workspace (where the hoisted node_modules happens to hold
// it) and fails on a cold install, which is how `packages/mcp`'s `bun-types`
// surfaced — and it was the SECOND instance of this family, after kern's.
//
// Both spellings count as declared: the package itself (`bun-types`) and its
// DefinitelyTyped alias (`node` -> `@types/node`).
const TSCONFIG_ROOTS = ["packages", "apps"];
for (const area of TSCONFIG_ROOTS) {
  const areaDir = join(ROOT, area);
  if (!existsSync(areaDir)) continue;
  for (const entry of readdirSync(areaDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(areaDir, entry.name);
    const tsconfigPath = join(dir, "tsconfig.json");
    if (!existsSync(tsconfigPath)) continue;

    let types = [];
    try {
      // TypeScript's OWN config parser, not a hand-rolled JSONC strip. A regex
      // stripper is wrong here in a way that only shows up in other people's
      // files: a path mapping like `"./src/*"` contains `/*` inside a string, so
      // naive block-comment removal eats from there to the next `*/` and
      // corrupts the document. That made this gate report a bogus violation on
      // apps/site. Reuse the canonical parser instead of re-implementing it.
      const raw = readFileSync(tsconfigPath, "utf8");
      const parsed = ts.parseConfigFileTextToJson(tsconfigPath, raw);
      if (parsed.error) {
        violations.push(
          `${entry.name}: tsconfig.json does not parse (${ts.flattenDiagnosticMessageText(parsed.error.messageText, " ")})`,
        );
        continue;
      }
      types = parsed.config?.compilerOptions?.types ?? [];
    } catch {
      violations.push(`${entry.name}: tsconfig.json is not parseable as JSONC`);
      continue;
    }
    if (!Array.isArray(types) || types.length === 0) continue;

    const manifestPath = join(dir, "package.json");
    if (!existsSync(manifestPath)) {
      violations.push(
        `${entry.name}: tsconfig types[] requires ${types.join(", ")} but has no package.json to declare them`,
      );
      continue;
    }
    const pkg = JSON.parse(readFileSync(manifestPath, "utf8"));
    const declared = new Set(
      [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.devDependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
      ].map((d) => d.toLowerCase()),
    );
    for (const t of types) {
      // A `types` entry may be a SUBPATH (`vite/client`), not a package name.
      // Resolve it to the PACKAGE that must supply it: the first segment, or
      // the first two when scoped. Then allow either the package itself or its
      // DefinitelyTyped alias -- `node` is satisfied by `@types/node`, while
      // `vite/client` is satisfied by `vite`. Treating the whole entry as a
      // package name made the gate demand `@types/vite/client`, which is not a
      // thing, and would have flagged a correct manifest.
      const parts = t.split("/");
      const pkgName = (
        t.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
      ).toLowerCase();
      const candidates = new Set([pkgName, `@types/${pkgName}`]);
      if (![...candidates].some((c) => declared.has(c))) {
        violations.push(
          `${entry.name}: tsconfig types[] requires "${t}" but no dependency declares ${pkgName} (looked for ${[...candidates].join(" or ")})`,
        );
      }
    }
  }
}

for (const { name, deps } of found) {
  if (TOOLING.has(name)) continue;
  const self = LAYERS[name];
  if (!self) {
    violations.push(
      `${name} is a package with no declared layer. Add it to LAYERS (or to ` +
        `TOOLING if it is not part of the map) — an unclassified package is ` +
        `exactly how the map rots.`,
    );
    continue;
  }

  for (const dep of deps) {
    if (dep === name) continue;

    // Rule 2: no renderer-to-renderer edge, either direction.
    if (RENDERERS.has(name) && RENDERERS.has(dep)) {
      violations.push(
        `${name} depends on ${dep}. Both are renderers: an edge between them ` +
          `pulls one renderer's platform into the other and inverts ADR 002. ` +
          `Anything genuinely shared belongs in kern-tokens or ` +
          `kern-primitives, which sit below both.`,
      );
      continue;
    }

    const target = LAYERS[dep];
    if (!target) {
      violations.push(
        `${name} depends on ${dep}, which is not a declared layer. If ${dep} ` +
          `is tooling, it should not be a runtime dependency of a layer.`,
      );
      continue;
    }

    // Rule 1: only downward edges.
    if (target.rank > self.rank) {
      violations.push(
        `${name} (layer ${self.rank}, ${self.blurb}) depends on ${dep} ` +
          `(layer ${target.rank}, ${target.blurb}). A layer may only depend ` +
          `on layers BELOW it.`,
      );
    }
    if (target.rank === self.rank && RENDERERS.has(dep) === false) {
      // Two rank-0 packages depending on each other is a cycle risk.
      violations.push(
        `${name} and ${dep} are both layer ${self.rank} and depend on each ` +
          `other. Same-layer edges are how cycles form.`,
      );
    }
  }
}

console.log(
  "check:layers — D-034 package map (primitives -> tokens -> renderers)",
);
for (const [name, meta] of Object.entries(LAYERS)) {
  const present = found.some((f) => f.name === name);
  const mark = present ? "" : "  (not created yet)";
  console.log(`  layer ${meta.rank}  ${name.padEnd(26)} ${meta.blurb}${mark}`);
}
const tooling = found.filter((f) => TOOLING.has(f.name)).map((f) => f.name);
if (tooling.length) console.log(`  tooling  ${tooling.join(", ")}`);

if (violations.length) {
  console.error(`\ncheck:layers FAILED — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log(
  "\npackage layering holds: no upward edges, no renderer-to-renderer edge,\n every tsconfig types[] entry is a declared dependency,\n every bare import resolves to a declared dependency,\n and the build graph is acyclic and covers every buildable package",
);
