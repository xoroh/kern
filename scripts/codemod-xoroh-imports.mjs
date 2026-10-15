#!/usr/bin/env node
/**
 * Codemod: private kern imports → public OSS imports (KERN-065).
 *
 * Maps the three legacy aliases to their public targets:
 *   kern-start/*  → @xoroh/kern + @xoroh/kern/start (web)
 *   kern-expo/*   → @xoroh/kern-native (native)
 *   kern-react/*  → @xoroh/kern (shared web APIs; reviewed per file)
 *
 * DRY-RUN BY DEFAULT: prints the per-file rewrites and exits 0 without
 * touching anything. `--apply` performs them. This codemod renames MODULES,
 * not symbols: `KernButton` → `Button` prop/callback differences are reviewed
 * per callsite (see docs/planning/XOROH_MIGRATION.md §Concrete import/API
 * mapping), never renamed blindly. A codemod that renames semantics
 * is how a migration compiles and misbehaves.
 *
 * Never touches node_modules, dist, or build output. Parent edits still need
 * their own authorization per run — this script being safe does not authorize
 * running it on the parent.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.argv.includes("--root")
  ? process.argv[process.argv.indexOf("--root") + 1]
  : process.cwd();
const APPLY = process.argv.includes("--apply");

const RULES = [
  {
    from: /from\s+["']@xoroh\/kern-start\/react["']/g,
    to: 'from "@xoroh/kern"',
    note: "@xoroh/kern-start/react → @xoroh/kern",
  },
  {
    from: /from\s+["']@xoroh\/kern-start\/([^"']+)["']/g,
    to: 'from "@xoroh/kern/start"',
    note: "@xoroh/kern-start/* → @xoroh/kern/start (composition tier)",
  },
  {
    from: /from\s+["']@xoroh\/kern-expo\/([^"']+)["']/g,
    to: 'from "@xoroh/kern-native"',
    note: "@xoroh/kern-expo/* → @xoroh/kern-native",
  },
  {
    from: /from\s+["']@xoroh\/kern-expo["']/g,
    to: 'from "@xoroh/kern-native"',
    note: "@xoroh/kern-expo → @xoroh/kern-native (barrel)",
  },
  {
    from: /from\s+["']@xoroh\/kern-react\/([^"']+)["']/g,
    to: 'from "@xoroh/kern"',
    note: "@xoroh/kern-react/* → @xoroh/kern (REVIEW: shared API, verify per file)",
  },
  {
    from: /from\s+["']@xoroh\/kern-react["']/g,
    to: 'from "@xoroh/kern"',
    note: "@xoroh/kern-react → @xoroh/kern (REVIEW: shared API, verify per file)",
  },
  {
    from: /from\s+["']kern-start\/react["']/g,
    to: 'from "@xoroh/kern"',
    note: "kern-start/react → @xoroh/kern",
  },
  {
    from: /from\s+["']kern-start\/([^"']+)["']/g,
    to: 'from "@xoroh/kern/start"',
    note: "kern-start/* → @xoroh/kern/start (composition tier)",
  },
  {
    from: /from\s+["']kern-expo\/([^"']+)["']/g,
    to: 'from "@xoroh/kern-native"',
    note: "kern-expo/* → @xoroh/kern-native",
  },
  {
    from: /from\s+["']kern-react\/([^"']+)["']/g,
    to: 'from "@xoroh/kern"',
    note: "kern-react/* → @xoroh/kern (REVIEW: shared API, verify per file)",
  },
];

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  ".tanstack",
  "build",
]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(join(dir, entry.name));
      continue;
    }
    if (/\.(tsx?|mts|cts)$/.test(entry.name)) yield join(dir, entry.name);
  }
}

let files = 0;
let rewrites = 0;
const needsReview = [];
for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  let next = src;
  const applied = [];
  for (const rule of RULES) {
    rule.from.lastIndex = 0;
    if (rule.from.test(next)) {
      rule.from.lastIndex = 0;
      next = next.replace(rule.from, rule.to);
      applied.push(rule.note);
    }
  }
  if (next !== src) {
    files += 1;
    rewrites += applied.length;
    console.log(`${relative(ROOT, file)}: ${applied.join("; ")}`);
    if (applied.some((a) => a.includes("REVIEW"))) {
      needsReview.push(relative(ROOT, file));
    }
    if (APPLY) writeFileSync(file, next);
  }
}

console.log(
  `\ncodemod: ${files} file(s), ${rewrites} rewrite(s)${APPLY ? " APPLIED" : " (dry run — pass --apply to write)"}.`,
);
if (needsReview.length > 0) {
  console.log(
    `REVIEW REQUIRED (${needsReview.length} file(s) hit kern-react rules):\n` +
      needsReview.map((f) => `  ${f}`).join("\n"),
  );
}
