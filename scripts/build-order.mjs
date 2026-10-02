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

/** name -> { dir, manifest } for every workspace package under packages/. */
const packages = new Map();

for (const entry of readdirSync(resolve(ROOT, "packages"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;
  const dir = resolve(ROOT, "packages", entry.name);
  const manifestPath = resolve(dir, "package.json");
  if (!existsSync(manifestPath)) continue;
  packages.set(entry.name, {
    dir,
    manifest: JSON.parse(readFileSync(manifestPath, "utf8")),
  });
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
  const deps = new Set();
  for (const dep of Object.keys(declared)) {
    if (!dep.startsWith(FIRST_PARTY)) continue;
    // Only packages that actually build constrain our order.
    if (buildable.has(dep)) deps.add(dep);
  }
  edges.set(name, deps);
}

// Kahn's algorithm. `buildable` is insertion-ordered, so a package with no
// unmet deps keeps a stable, deterministic position.
const ordered = [];
const remaining = new Map(edges);

while (remaining.size > 0) {
  const ready = [];
  for (const [name, deps] of remaining) {
    let blocked = false;
    for (const dep of deps) {
      // A dep that has not been emitted yet blocks us — unless it was filtered
      // out because it is not buildable (already handled above).
      if (remaining.has(dep)) {
        blocked = true;
        break;
      }
    }
    if (!blocked) ready.push(name);
  }

  if (ready.length === 0) {
    const cycle = [...remaining.keys()].sort().join(", ");
    process.stderr.write(
      `\nbuild-order: FAILED — dependency cycle among buildable packages:\n  ${cycle}\n\n` +
        `Build order is derived from declared @xoroh/* dependencies, so a cycle\n` +
        `means the manifests are mutually dependent and no build order exists.\n\n`,
    );
    process.exit(1);
  }

  for (const name of ready) {
    ordered.push(name);
    remaining.delete(name);
  }
}

if (process.argv.includes("--print")) {
  for (const name of ordered) process.stdout.write(`${name}\n`);
  process.exit(0);
}

process.stdout.write(
  `build-order: ${ordered.length} buildable package(s), derived from declared deps:\n` +
    ordered.map((n) => `  ${n}`).join("\n") +
    "\n\n",
);

let failed = null;
for (const name of ordered) {
  const dir = packages.get(buildable.get(name)).dir;
  process.stdout.write(`\n--- build: ${name} ---\n`);
  // node:child_process, not the `Bun` global: this script is invoked as
  // `node scripts/build-order.mjs`, where `Bun` is undefined and referencing it
  // throws. (Same trap as scripts/build-lock.mjs — see 520e94d.)
  const result = spawnSync("bun", ["run", "build"], {
    cwd: dir,
    stdio: "inherit",
  });
  if (result.exitCode !== 0) {
    failed = name;
    break;
  }
}

if (failed) {
  process.stderr.write(
    `\nbuild-order: FAILED — ${failed} exited non-zero. Its own output above is the cause.\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `\nbuild-order: ok — ${ordered.length} package(s) built in dependency order.\n`,
);
