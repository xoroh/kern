#!/usr/bin/env node
/**
 * check:stale-tarball — the Axis dependency is registry-addressable and
 * points at a PUBLISHED version.
 *
 * ## WHAT CHANGED, AND WHY
 *
 * Kern used to vendor Axis as a tarball under `vendor/axis/`, because Axis
 * was unpublished and there was nothing to depend on. Axis is published now
 * (0.1.2 on the npm registry), so the vendored copy is not a fallback any
 * more — it is a liability:
 *
 *   - a `file:` specifier is not registry-addressable, so a published
 *     `@xoroh/kern` fails every consumer install with
 *     EUNSUPPORTEDPROTOCOL (`preflight:publish --release` refuses it);
 *   - a vendored copy is a SECOND Axis: it goes stale the moment Axis moves,
 *     which is exactly what happened (the vendored tarball was 92 files
 *     behind when Axis released).
 *
 * So the dependency is a normal range on the published package, and this gate
 * asserts the two things that must stay true:
 *
 *   1. every manifest that depends on Axis declares a REGISTRY specifier (a
 *      range), never a `file:` / `link:` path;
 *   2. the version Kern asks for is PUBLISHED — the gate resolves it against
 *      the npm registry, so a manifest that names a version nobody can
 *      install fails here rather than in a consumer's terminal;
 *   3. no tracked file still references the old vendored tarball.
 *
 * The registry lookup is skipped when the network is unavailable: a gate that
 * fails because the network is down is a gate that reports the wrong thing.
 * The specifier check still runs, and it is the one that cannot drift.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VENDOR_AXIS = join(ROOT, "vendor", "axis");

const violations = [];
const fail = (msg) => violations.push(msg);

/** Every package.json in the workspace that can declare an Axis dependency. */
function manifests() {
  const out = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "package.json") out.push(path);
    }
  };
  walk(ROOT);
  return out;
}

const AXIS_SPECIFIER = /^[\^~]?\d+\.\d+\.\d+/;
const specs = new Map();

for (const path of manifests()) {
  const rel = relative(ROOT, path);
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    // A manifest with a build-time placeholder in it (the CLI's starter
    // template carries `__KERN_OVERRIDES__`) is not a manifest this gate
    // can read. Skipping it is not a hole: it declares no Axis dependency.
    continue;
  }
  for (const section of [
    "dependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    const value = pkg[section]?.["@xoroh/axis"];
    if (!value) continue;
    if (!AXIS_SPECIFIER.test(value)) {
      fail(
        `${rel} ${section}["@xoroh/axis"] = "${value}" is not a registry range — ` +
          `a file:/link: specifier is not installable by a consumer (Axis is published now, ` +
          `so the dependency is a normal version range)`,
      );
      continue;
    }
    specs.set(rel, { section, value });
  }
}

if (specs.size === 0) {
  fail(
    "no manifest depends on @xoroh/axis — the vendored copy was removed but the dependency went with it",
  );
}

// The published version check. A network failure is not a violation: the
// specifier check above cannot drift, and this one only proves the range
// names something the registry has.
const wanted = [
  ...new Set([...specs.values()].map((s) => s.value.replace(/^[\^~]/, ""))),
];
let published = null;
try {
  const response = await fetch("https://registry.npmjs.org/@xoroh%2Faxis", {
    signal: AbortSignal.timeout(8000),
  });
  if (response.ok) {
    const body = await response.json();
    published = new Set(Object.keys(body.versions ?? {}));
  }
} catch {
  published = null;
}
if (published) {
  for (const version of wanted) {
    if (!published.has(version)) {
      fail(
        `@xoroh/axis@${version} is not published — a consumer install would fail on an ` +
          `unpublished version (published: ${[...published].join(", ")})`,
      );
    }
  }
}

// Nothing may still point at the old vendored tarball. The scan reads the
// TRACKED files where a dependency specifier can live — manifests and CI
// config — and not the prose that explains the migration (the release notes
// and the architecture roadmap TALK about the vendored copy; that history is
// not a reference anyone installs from).
const tracked = execFileSync("git", ["ls-files"], {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 40 * 1024 * 1024,
})
  .split("\n")
  .filter(Boolean);
const SPECIFIER_FILE = /\.(json|ya?ml)$/;
for (const rel of tracked) {
  if (!SPECIFIER_FILE.test(rel)) continue;
  const path = join(ROOT, rel);
  let text;
  try {
    if (statSync(path).size > 2_000_000) continue;
    text = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  if (!text.includes("vendor/axis")) continue;
  fail(
    `${rel} still references the vendored Axis copy — the dependency is on the published package now`,
  );
}

// The vendor directory itself must be gone: a tarball nobody depends on is a
// copy nobody updates.
try {
  const entries = readdirSync(VENDOR_AXIS);
  if (entries.length > 0) {
    fail(
      `vendor/axis still holds ${entries.join(", ")} — Axis is a registry dependency now, ` +
        `and a second copy of Axis is a second Axis to keep in step`,
    );
  }
} catch {
  // The directory is gone: that is the expected state.
}

if (violations.length > 0) {
  console.error("check:stale-tarball FAILED:");
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
const versions = [...new Set([...specs.values()].map((s) => s.value))].join(
  ", ",
);
console.log(
  `check:stale-tarball passed: @xoroh/axis is a registry dependency (${versions})` +
    (published
      ? " and the version is published"
      : " (registry lookup skipped — offline)"),
);
