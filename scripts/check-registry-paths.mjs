#!/usr/bin/env node
/**
 * check-registry-paths — every manifest path resolves to a vendored-copyable file.
 *
 * WHY
 *
 * The registry manifest is no longer docs-only: `kern add` resolves component
 * names to `path` and copies the file. A manifest entry whose path does not
 * resolve is an installer that 404s at runtime — the registry becomes a
 * promise the CLI cannot keep. This gate makes the promise load-bearing
 * BEFORE the CLI ships (dual-delivery sequencing step 1).
 *
 * WHAT IT ASSERTS
 *
 * Every `status: "real"` row: web paths resolve under `packages/kern`,
 * native paths under `packages/kern-native`, and the target exists and is a
 * regular file (not a directory, not a dangling symlink). Stub rows are
 * skipped — a stub is "not shipped", and the CLI must refuse stubs rather
 * than resolve them (that refusal is Mode 1's job, tested there).
 *
 * Parsing follows check-parity's established pattern for this generated file
 * (documented row regex + zero-rows guard), not a second parser.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const src = readFileSync(join(ROOT, "packages/mcp/src/manifest.ts"), "utf8");
const rows = [
  ...src.matchAll(
    /\{\s*name:\s*"([^"]+)",\s*export:\s*"([^"]+)",\s*platform:\s*"(web|native)",\s*path:\s*"([^"]+)",\s*status:\s*"(real|stub)",\s*\}/gs,
  ),
].map(([, name, exportName, platform, path, status]) => ({
  name,
  exportName,
  platform,
  path,
  status,
}));

if (rows.length === 0) {
  console.error(
    "check-registry-paths FAILED — parsed 0 rows from the generated registry.\n" +
      "Run `bun run generate:components` first; the registry is generated, do not hand-edit.",
  );
  process.exit(1);
}

const PKG = { web: "packages/kern", native: "packages/kern-native" };
const failures = [];
let checked = 0;
for (const row of rows) {
  if (row.status !== "real") continue; // stubs are refused by the CLI, not resolved here
  checked += 1;
  const abs = join(ROOT, PKG[row.platform], row.path);
  if (!existsSync(abs)) {
    failures.push(
      `${row.platform}/${row.name}: "${row.path}" does not exist under ${PKG[row.platform]}.`,
    );
    continue;
  }
  if (!statSync(abs).isFile()) {
    failures.push(
      `${row.platform}/${row.name}: "${row.path}" is not a regular file — the installer copies files.`,
    );
  }
}

if (failures.length) {
  console.error("check-registry-paths FAILED:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check-registry-paths passes: ${checked} real manifest paths all resolve to regular files.`,
);
