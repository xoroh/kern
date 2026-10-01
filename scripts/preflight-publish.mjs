#!/usr/bin/env node
// K-05 preflight — run before any publish, fails fast on packaging defects that
// publint/attw cannot see (they lint the manifest, not the packed tarball).
//
// Currently gates the one known hard blocker: npm does NOT rewrite the
// `workspace:` protocol on pack (only pnpm/yarn do). A `workspace:*` spec in
// `dependencies` therefore ships verbatim inside the tarball and every
// consumer install dies with EUNSUPPORTEDPROTOCOL. Proof:
//   npm pack <pkg> && npm i <pkg>.tgz
//   -> npm error code EUNSUPPORTEDPROTOCOL  Unsupported URL Type "workspace:"
//
// Exit 0 = safe to hand to `changeset publish`.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const MANIFESTS = [
  "packages/kern/package.json",
  "packages/kern-tokens/package.json",
  "packages/kern-native/package.json",
  "packages/kern-icons/package.json",
  "packages/kern/src/start/package.json",
  "packages/mcp/package.json",
];

// `workspace:` is legal in devDependencies (npm strips devDeps from the
// tarball) and in the workspace root's own apps/*.
const SHIPPED_FIELDS = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
];

const failures = [];

for (const rel of MANIFESTS) {
  const manifest = JSON.parse(await readFile(resolve(ROOT, rel), "utf8"));
  if (manifest.private === true) continue;

  for (const field of SHIPPED_FIELDS) {
    for (const [name, range] of Object.entries(manifest[field] ?? {})) {
      if (typeof range !== "string" || !range.startsWith("workspace:"))
        continue;
      failures.push(
        `  ${manifest.name}  ${field}.${name} = "${range}"  (${rel})`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(
    "preflight-publish: FAILED — workspace: protocol would ship to npm\n",
  );
  for (const line of failures) console.error(line);
  console.error(
    "\nnpm only rewrites workspace: specs for pnpm/yarn. Fix: drop the entry\n" +
      "from `dependencies` and declare it as a peerDependency with an explicit\n" +
      "range (or `*` for a 0.x first release), keeping workspace:* only in\n" +
      "devDependencies for local resolution.",
  );
  process.exit(1);
}

console.log(
  `preflight-publish: ok — ${MANIFESTS.length} manifests, no workspace: in shipped fields`,
);
