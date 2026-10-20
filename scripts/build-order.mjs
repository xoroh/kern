#!/usr/bin/env node
// Topologically sort the buildable workspace packages from their DECLARED
// first-party dependencies, then build each in that order.
//
// Why this exists (D-037): the root `build` script used to hard-code
//
//     primitives -> tokens -> kern -> kern-native -> icons -> mcp
//
// which is a hand-ordered chain — a second source of truth that silently rots
// the moment a package is added, and the only thing masking the install-time
// build race. This reads the SAME declarations `check:layers` enforces, so the
// map in the manifests and the build order cannot drift: add a dependency and
// the order follows.
//
// Edges come from `dependencies` + `devDependencies` on first-party
// (`@xoroh/*`) packages only. A cycle is a hard error, not a silent skip — a
// cyclic workspace cannot be built in any order, and saying so is the only
// useful response.
//
// Exit 0 = every buildable package built, in dependency order.

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FIRST_PARTY = "@xoroh/";

/** name -> { dir, manifest } for every workspace package under packages/ and libs/. */
const packages = new Map();

for (const area of ["packages", "libs"]) {
  const areaDir = resolve(ROOT, area);
  if (!existsSync(areaDir)) continue;
  for (const entry of readdirSync(areaDir, {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const dir = resolve(ROOT, area, entry.name);
    const manifestPath = resolve(dir, "package.json");
    if (!existsSync(manifestPath)) continue;
    packages.set(`${area}/${entry.name}`, {
      dir,
      manifest: JSON.parse(readFileSync(manifestPath, "utf8")),
    });
  }
}

/** Buildable = has a `build` script. A package with none is not an edge target. */
const buildable = new Map();
for (const [dirName, { manifest }] of packages) {
  if (manifest.scripts?.build) buildable.set(manifest.name, dirName);
}

/** Edge set: a buildable package depends on every first-party package it declares. */
const edges = new Map(); // name -> Set of first-party deps (buildable ones)
for (const [name] of buildable) {
  const { manifest } = packages.get(buildable.get(name));
  const declared = {
    ...(manifest.dependencies ?? {}),
    ...(manifest.devDependencies ?? {}),
  };
  const firstParty = new Set();
  for (const dep of Object.keys(declared)) {
    if (!dep.startsWith(FIRST_PARTY)) continue;
    if (buildable.has(dep)) firstParty.add(dep);
  }
  edges.set(name, firstParty);
}

// Kahn's algorithm: topological sort.
const inDegree = new Map();
for (const [name] of buildable) inDegree.set(name, 0);
for (const [, deps] of edges) {
  for (const dep of deps) {
    inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
  }
}

// A dependency must build BEFORE the package that declares it, so in-degree 0
// here means "nobody is waiting on me to build first" — which is the REVERSE
// order (leaves first). Reverse the sort at the end so prerequisites build
// before their consumers.
const reverse = [];
const queue = [];
for (const [name, deg] of inDegree) {
  if (deg === 0) queue.push(name);
}

while (queue.length > 0) {
  const current = queue.shift();
  reverse.push(current);
  for (const dep of edges.get(current) ?? []) {
    const nextDeg = inDegree.get(dep) - 1;
    inDegree.set(dep, nextDeg);
    if (nextDeg === 0) queue.push(dep);
  }
}

if (reverse.length !== buildable.size) {
  const unbuilt = [...buildable.keys()].filter(
    (name) => !reverse.includes(name),
  );
  console.error(
    `Dependency cycle detected among buildable packages: ${unbuilt.join(", ")}`,
  );
  process.exit(1);
}

const order = reverse.reverse();

console.log(`Build order (${order.length} packages): ${order.join(" -> ")}`);

for (const name of order) {
  const dirName = buildable.get(name);
  const { dir } = packages.get(dirName);
  console.log(`\nBuilding ${name} (${dirName})...`);
  const result = spawnSync("bun", ["run", "build"], {
    cwd: dir,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`Build failed for ${name} (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
}
