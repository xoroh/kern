#!/usr/bin/env node
// Assert that a package's dist actually CONTAINS type declarations, at the point
// where a consumer is about to read them.
//
// Why this exists, separately from check-dist-exports:
//   check-dist-exports runs in CI and the publish chain. This runs in the DEV
//   path — the site's typecheck and check:snippets both point `paths` straight
//   at `node_modules/@xoroh/kern/dist/index.d.ts`. A torn dist (JS emitted by
//   `tsup --clean`, types never written because the build was killed or
//   interrupted) fails those commands with a confusing "Could not find a
//   declaration file for module '@xoroh/kern'" — and NOTHING in that path
//   consults the gate, so it fails silently until someone reads the output.
//
// tsup builds in place: it wipes dist/ then rewrites it, so for the ~10s of a
// DTS run a concurrent consumer can observe a partial dist. This makes that
// window fail with a named diagnosis instead of a missing-file error.
//
// Exit 0 = every package the caller depends on has type declarations.

import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Package name -> the declaration file a consumer's `paths` mapping points at.
const CONSUMED = [
  ["@xoroh/kern", "packages/kern/dist/index.d.ts"],
  ["@xoroh/kern-native", "packages/kern-native/dist/index.d.ts"],
  ["@xoroh/kern-icons", "packages/kern-icons/dist/index.d.ts"],
  ["@xoroh/kern-tokens", "packages/kern-tokens/dist/index.d.ts"],
  // D-034 moved this to the `./start` subpath of @xoroh/kern. The old
  // packages/kern-start/dist path no longer exists.
  ["@xoroh/kern/start", "packages/kern/dist/start/index.d.ts"],
];

const missing = [];

for (const [name, rel] of CONSUMED) {
  try {
    await access(resolve(ROOT, rel));
  } catch {
    missing.push({ name, rel });
  }
}

if (missing.length > 0) {
  process.stderr.write(
    `\ncheck-dist-types: FAILED — ${missing.length} package(s) have no type declarations.\n` +
      `A consumer reading these will fail with "Could not find a declaration file".\n` +
      `This means a build was interrupted or is running concurrently: tsup wipes\n` +
      `dist/ first, so a partial dist is normal WHILE a build runs and broken\n` +
      `AFTER one ends. Wait for concurrent builds to finish, then rebuild:\n` +
      `    bun run build\n\n`,
  );
  for (const { name, rel } of missing) {
    process.stderr.write(`  ${name.padEnd(22)} ${rel}  (missing)\n`);
  }
  process.stderr.write("\n");
  process.exit(1);
}

process.stdout.write(
  `check-dist-types: ok — ${CONSUMED.length} consumed package(s) have type declarations\n`,
);
