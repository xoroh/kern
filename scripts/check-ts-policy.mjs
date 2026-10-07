#!/usr/bin/env node
/**
 * check:ts-policy — one TypeScript version across the whole workspace.
 *
 * ## Why this exists
 *
 * The repo pinned `typescript@5.9.3` in every package while `apps/site`
 * floated on `^6.0.2` and `apps/mobile` on `~6.0.3`. Two majors in one
 * workspace means two different type-checkers can disagree about the same
 * source: a construct one accepts the other rejects, and `tsc --noEmit`
 * going green locally proves nothing about the other major. A policy nobody
 * enforces is a preference, and preferences drift — which is exactly how the
 * two 6.x pins landed while every package said 5.9.3.
 *
 * ## What it asserts
 *
 * Every workspace manifest (`package.json`, `packages/*`, `apps/*`) that
 * declares `typescript` — in dependencies or devDependencies — must declare
 * EXACTLY the root's pinned version. No ranges, no tildes, no second major.
 * The root `package.json` is the single source of truth; this gate reads the
 * pin from there rather than hard-coding it, so bumping the policy is one
 * edit plus the lockfile, not a gate edit.
 *
 * ## What it deliberately does NOT do
 *
 * It does not check the INSTALLED version, only the declared one. The
 * lockfile resolves what runs; the manifest declares what is allowed. Both
 * matter, but the manifest is where the second major enters, so that is
 * where the gate stands.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(join(fileURLToPath(import.meta.url), "..", ".."));

const readManifest = (dir) => {
  try {
    return JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8"));
  } catch {
    return null;
  }
};

const root = readManifest("");
const pin = root?.devDependencies?.typescript ?? root?.dependencies?.typescript;
if (!pin) {
  console.error(
    "check:ts-policy FAILED — root package.json declares no typescript version.\n" +
      "  The root pin is the policy; without it there is nothing to enforce.",
  );
  process.exit(1);
}

const dirs = [""];
for (const area of ["packages", "apps"]) {
  let entries;
  try {
    entries = readdirSync(join(ROOT, area), { withFileTypes: true });
  } catch {
    continue;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) dirs.push(`${area}/${entry.name}`);
  }
}

const violations = [];
for (const dir of dirs.sort()) {
  const manifest = dir === "" ? root : readManifest(dir);
  if (!manifest) continue;
  const declared =
    manifest.devDependencies?.typescript ??
    manifest.dependencies?.typescript ??
    null;
  if (declared === null) continue;
  if (declared !== pin) {
    violations.push(
      `${dir === "" ? "(root)" : dir}: typescript is ${JSON.stringify(declared)}, policy is ${JSON.stringify(pin)}. ` +
        "Pin it exactly — a range admits a second major, and two majors in one workspace means two type-checkers that can disagree.",
    );
  }
}

if (violations.length > 0) {
  console.error(`check:ts-policy FAILED — ${violations.length} violation(s):`);
  for (const violation of violations) console.error(`  - ${violation}`);
  process.exit(1);
}

console.log(`check:ts-policy passes — every manifest pins typescript ${pin}.`);
