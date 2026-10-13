#!/usr/bin/env node
/**
 * check:xoroh-leaks — no private kern paths in migrated trees (KERN-074).
 *
 * Migration CI: after an app switches to artifact imports, the legacy
 * aliases (`kern-start`, `kern-expo`, `kern-react`) and deep relative imports
 * into `libs/kern` must be GONE from that tree. A migrated app that still
 * imports the private source has two design systems and one of them is
 * unversioned — the exact state the migration exists to end.
 *
 * Read-only: lists every offending import with its file. Usage:
 *   node scripts/check-xoroh-leaks.mjs [dir ...]
 *
 * With no args the gate self-checks the kern repo (always green — the repo
 * holds no private imports of itself). Pass explicit parent dirs to track the
 * rollout; the unmigrated parent is EXPECTED to be red until its apps move,
 * so it is never the default. A default that scans the whole unmigrated
 * parent would be red for months and teach everyone the gate is decorative.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const LEAK_RES = [
  /from\s+["'](?:@xoroh\/)?kern-start\//,
  /from\s+["'](?:@xoroh\/)?kern-expo(?:\/|["'])/,
  /from\s+["'](?:@xoroh\/)?kern-react(?:\/|["'])/,
  /from\s+["']\.\.\/(?:\.\/)*libs\/kern\//,
];

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".tanstack",
  ".expo",
]);

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(join(dir, entry.name));
      continue;
    }
    if (/\.(tsx?|mts|cts)$/.test(entry.name)) yield join(dir, entry.name);
  }
}

const targets = process.argv.slice(2);
const dirs = targets.length > 0 ? targets : [ROOT];

let leaks = 0;
for (const dir of dirs) {
  for (const file of walk(dir)) {
    let src;
    try {
      src = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const re of LEAK_RES) {
      const m = src.match(re);
      if (m) {
        leaks += 1;
        console.log(`${file}: private kern import (${m[0].slice(0, 40)}…)`);
        break;
      }
    }
  }
}

if (leaks > 0) {
  console.log(
    `\ncheck:xoroh-leaks: ${leaks} private import(s) — migrated trees must not read private kern source.`,
  );
  process.exit(1);
}
console.log(
  `check:xoroh-leaks: ok — no private kern imports in ${dirs.join(", ")}.`,
);
