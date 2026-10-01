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
import { join } from "node:path";

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
  "\npackage layering holds: no upward edges, no renderer-to-renderer edge",
);
