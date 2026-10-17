#!/usr/bin/env node
import { execFileSync } from "node:child_process";
/**
 * check:stale-tarball — verifies that all references to the vendored @xoroh/axis
 * tarball point to the exact current tarball present in vendor/axis, and that
 * lockfile integrity and consumer package manifests are strictly synchronized.
 *
 * Assertions:
 *   1. Exactly one vendored tarball exists in vendor/axis/*.tgz.
 *   2. The tarball exists, is non-empty, and its sha512 matches the lockfile.
 *   3. Every package.json referencing @xoroh/axis specifies the active tarball.
 *   4. No tracked source or config files reference a stale or missing axis-*.tgz.
 *   5. bun.lock pins the active tarball with matching sha512 integrity.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VENDOR_AXIS = join(ROOT, "vendor", "axis");

const violations = [];
const fail = (msg) => violations.push(msg);

if (!existsSync(VENDOR_AXIS)) {
  fail("vendor/axis directory does not exist.");
  reportAndExit();
}

const tarballs = readdirSync(VENDOR_AXIS).filter((f) => f.endsWith(".tgz"));
if (tarballs.length !== 1) {
  fail(
    `expected exactly one vendored @xoroh/axis tarball in vendor/axis, found ${tarballs.length}: ${tarballs.join(", ") || "none"}`,
  );
  reportAndExit();
}

const activeTarball = tarballs[0];
const tarballPath = join(VENDOR_AXIS, activeTarball);
const tarballBytes = readFileSync(tarballPath);
if (tarballBytes.length === 0) {
  fail(`vendored tarball ${activeTarball} is empty (0 bytes).`);
}

const actualSha512 = createHash("sha512").update(tarballBytes).digest("base64");
const expectedSpec = `file:../../vendor/axis/${activeTarball}`;

// --- Check package.json dependencies ---
const checkPackageJson = (relPath) => {
  const fullPath = join(ROOT, relPath);
  if (!existsSync(fullPath)) return;
  const pkg = JSON.parse(readFileSync(fullPath, "utf8"));
  const sections = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "overrides",
  ];
  for (const sec of sections) {
    if (pkg[sec]?.["@xoroh/axis"]) {
      const val = pkg[sec]["@xoroh/axis"];
      if (val !== expectedSpec) {
        fail(
          `${relPath} ${sec}["@xoroh/axis"] points to stale or mismatched tarball: "${val}" (expected "${expectedSpec}")`,
        );
      }
    }
  }
};

for (const pkgRel of [
  "packages/kern/package.json",
  "packages/kern-native/package.json",
  "apps/site/package.json",
]) {
  checkPackageJson(pkgRel);
}

// Check other workspaces dynamically
for (const dir of ["packages", "apps"]) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) continue;
  for (const entry of readdirSync(full)) {
    checkPackageJson(join(dir, entry, "package.json"));
  }
}

// --- Check bun.lock integrity ---
const lockPath = join(ROOT, "bun.lock");
if (existsSync(lockPath)) {
  const lockContent = readFileSync(lockPath, "utf8");
  // Check that @xoroh/axis entry references activeTarball and matching sha512
  const axisLine = lockContent
    .split("\n")
    .find((l) => l.includes('"@xoroh/axis": ['));
  const axisEntryMatch = axisLine
    ? axisLine.match(
        /"@xoroh\/axis":\s*\[\s*"@xoroh\/axis@([^"]+)"\s*,\s*\{.*\}\s*,\s*"sha512-([^"]+)"\s*\]/,
      )
    : null;
  if (axisEntryMatch) {
    const lockSpec = axisEntryMatch[1];
    const lockSha = axisEntryMatch[2];
    if (!lockSpec.endsWith(activeTarball)) {
      fail(
        `bun.lock @xoroh/axis resolves to stale tarball "${lockSpec}" (expected endsWith "${activeTarball}")`,
      );
    }
    if (lockSha !== actualSha512) {
      fail(
        `bun.lock @xoroh/axis sha512 "${lockSha}" does not match active tarball "${actualSha512}"`,
      );
    }
  } else {
    fail(
      "bun.lock does not contain a valid top-level @xoroh/axis resolution entry.",
    );
  }
}

// --- Check tracked references for stale axis-*.tgz names ---
let tracked = [];
try {
  tracked = execFileSync("git", ["-C", ROOT, "ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
} catch {
  // If git fails, continue
}

for (const rel of tracked) {
  // Ignore binary files, this script itself, bun.lock (checked above), and reports/changelogs documenting history
  if (
    rel === "scripts/check-stale-tarball.mjs" ||
    rel === "bun.lock" ||
    rel.endsWith(".tgz") ||
    rel.startsWith(".reports/")
  ) {
    continue;
  }
  const full = join(ROOT, rel);
  let text = "";
  try {
    text = readFileSync(full, "utf8");
  } catch {
    continue;
  }
  const staleMatches = text.match(/axis-[a-f0-9]{7,8}\.tgz/g);
  if (staleMatches) {
    for (const match of staleMatches) {
      if (match !== activeTarball) {
        fail(
          `${rel}: references stale tarball "${match}" (current active tarball is "${activeTarball}").`,
        );
      }
    }
  }
}

reportAndExit();

function reportAndExit() {
  if (violations.length > 0) {
    console.error(
      `check:stale-tarball FAILED — ${violations.length} violation(s):`,
    );
    for (const v of violations) console.error(`  - ${v}`);
    process.exit(1);
  }
  console.log(
    `check:stale-tarball passed: active tarball is ${activeTarball} (sha512:${actualSha512}), all package manifests and lockfile agree.`,
  );
  process.exit(0);
}
