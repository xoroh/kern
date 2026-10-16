#!/usr/bin/env node
/**
 * check-publint — stock publint with the ONE sanctioned pre-publish exception.
 *
 * The kern→Axis cutover (migration roadmap Phase 4, owner direction) consumes
 * `@xoroh/axis` through a committed vendored tarball
 * (`file:../../vendor/axis/axis-<axis-sha>.tgz`, lockfile-pinned) until the
 * first release-authorized publish swaps the spec to semver. Stock publint
 * errors on ANY `file:` dependency — correct in general, wrong for this exact
 * sanctioned mechanism (the old "no cross-repo file: deps" rule is superseded
 * for it; roadmap §E Phase 4).
 *
 * This wrapper runs stock publint in the calling package directory and fails
 * on every publint finding EXCEPT the exact sanctioned-spec error below,
 * which is printed as acknowledged rather than hidden:
 *
 *   sanctioned: the "@xoroh/axis" dependency references
 *   "file:…vendor/axis/….tgz" …
 *
 * Anything else — any other file: spec, any other error — fails loudly.
 *
 * Expiry: delete this wrapper and restore stock `publint` in the calling
 * package's `check:publish` script when the spec swaps to semver
 * (`vendor/axis/` is deleted with it; release-checklist item). The
 * release-time backstop is the publish HOLD (owner authorization +
 * npm-publish environment), not this wrapper.
 */
import { execFileSync } from "node:child_process";

const dir = process.cwd();
let output;
try {
  output = execFileSync("bun", ["x", "publint"], {
    cwd: dir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  console.log(output);
  console.log("check-publint: stock publint clean.");
  process.exit(0);
} catch (err) {
  output = (err.stdout ?? "") + (err.stderr ?? "");
}

// Exact-match only: the sanctioned vendored-tarball spec for the Axis
// behavior kernel.
const SANCTIONED =
  /^\d+\. The "@xoroh\/axis" dependency references "file:[^"]*vendor\/axis\/[^"]*\.tgz" that will likely not work when installed by end-users\.$/;

const acknowledged = [];
const remaining = [];
for (const line of output.split("\n")) {
  if (SANCTIONED.test(line.trim())) acknowledged.push(line);
  else remaining.push(line);
}

if (acknowledged.length > 0) {
  console.log(
    "check-publint: acknowledged sanctioned pre-publish file: spec (roadmap Phase 4, expires at the semver swap):",
  );
  for (const line of acknowledged) console.log(`  (sanctioned) ${line.trim()}`);
}

const rest = remaining.join("\n").trim();
// Only ERROR-section numbered items are findings: publint also prints
// "Suggestions:"/"Warnings:" with numbered items that never fail its exit
// code, and treating those as failures would cry wolf. Track the section.
let inErrors = false;
const remainingFindings = [];
for (const line of remaining) {
  const t = line.trim();
  if (/^errors:/i.test(t)) {
    inErrors = true;
    continue;
  }
  if (/^(warnings|suggestions):/i.test(t)) {
    inErrors = false;
    continue;
  }
  if (inErrors && /^\d+\.\s/.test(t)) remainingFindings.push(line);
}
// publint exits nonzero iff it reports findings. Passing here requires the
// failure to be EXACTLY the sanctioned set: at least one acknowledged line,
// an "Errors:" section present (a crash with no findings must not read as
// green), and no remaining error-section finding.
if (
  acknowledged.length === 0 ||
  !/^errors:/gim.test(rest) ||
  remainingFindings.length > 0
) {
  console.error("check-publint FAILED — non-sanctioned publint findings:");
  console.error(output);
  process.exit(1);
}
console.log(output);
console.log(
  "check-publint holds: stock publint reports only the sanctioned pre-publish file: spec.",
);
