#!/usr/bin/env node
/**
 * Which of the ungated-but-shipped components actually carry an elevation token?
 *
 * check-m3 resolves a component's resting level by scanning its import closure
 * for `--md-sys-elevation-level<N>`. A row added to KERN_ELEVATION_COMPONENTS whose
 * component emits no such token measures `null` and is counted UNASSERTED — the
 * gate would look greener while asserting nothing.
 *
 * So before adding rows, measure. This prints the real answer per component.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const WEB = join(ROOT, "packages/kern/src/components");

const closureOf = (file, seen = new Set()) => {
  if (seen.has(file)) return seen;
  seen.add(file);
  const full = join(WEB, file);
  if (!existsSync(full)) return seen;
  for (const [, spec] of readFileSync(full, "utf8").matchAll(
    /from\s+"\.\/([^"]+)"/g,
  )) {
    closureOf(spec.endsWith(".ts") ? spec : `${spec}.tsx`, seen);
  }
  return seen;
};

const targets = process.argv.slice(2);
console.log("component            levels in closure        verdict");
console.log("-".repeat(72));
for (const name of targets) {
  const levels = new Set();
  for (const file of closureOf(`${name}.tsx`)) {
    const full = join(WEB, file);
    if (!existsSync(full)) continue;
    for (const [, lvl] of readFileSync(full, "utf8").matchAll(
      /--md-sys-elevation-level(\d)/g,
    )) {
      levels.add(Number(lvl));
    }
  }
  const list = levels.size ? [...levels].sort().join(",") : "—";
  const verdict =
    levels.size === 0
      ? "NO TOKEN — gating this row would assert nothing"
      : levels.size > 1
        ? "straddles rows"
        : `assertable at level ${[...levels][0]}`;
  console.log(`${name.padEnd(20)} ${list.padEnd(24)} ${verdict}`);
}
