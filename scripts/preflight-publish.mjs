#!/usr/bin/env node
/**
 * preflight-publish — assert the PUBLISHED ARTEFACT is installable.
 *
 * ## What this checks, and why not the source manifest
 *
 * This used to read each package's `package.json` on disk and fail if `workspace:`
 * appeared in a shipped dependency field. That asserts a DECLARATION CONVENTION,
 * not a property of what we publish, and it was wrong in a way that cost a real
 * ruling: it forbade `workspace:*` in `dependencies`, which is the exact
 * declaration D-034 requires (internal packages are real dependencies so the
 * build order derives from the graph) — and it was RED on the tree D-034
 * produced.
 *
 * So it tests the artefact instead. Measured on this repo, with real tarballs:
 *
 *   `bun pm pack`  ->  "workspace:*" becomes "0.0.0"    correct: `workspace:*`
 *                        means exactly this version
 *   `npm pack`     ->  "workspace:*" ships VERBATIM    npm has no workspace
 *                        protocol, so a consumer installing this tarball dies
 *                        with EUNSUPPORTEDPROTOCOL
 *
 * Therefore `workspace:*` is FINE to declare, and the only variable that matters
 * is which tool packs the release. This script packs with bun — the tool that
 * rewrites correctly — and fails if any `workspace:` survives into a tarball. If
 * someone releases with npm or yarn instead, the gate goes red before publish
 * rather than after a broken install report.
 *
 * Exit 0 = every packed manifest is installable.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

/**
 * `@xoroh/kern/start` is a SUBPATH export of `@xoroh/kern` (D-034), not its own
 * package, so it has no entry here. The stale `packages/kern/src/start/
 * package.json` path that once sat in this list threw ENOENT and failed the
 * whole publish gate on a file that never existed.
 */
const MANIFESTS = [
  "packages/kern-primitives",
  "packages/kern",
  "packages/kern-tokens",
  "packages/kern-native",
  "packages/kern-icons",
  "packages/mcp",
];

/** `workspace:` is legal in devDependencies — npm strips those from the tarball. */
const SHIPPED_FIELDS = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
];

/**
 * Exact match on `<flat-name>-<version>.tgz`.
 *
 * NOT `startsWith(flat)`: bun names the tarball `xoroh-kern-0.0.0.tgz`, and
 * `xoroh-kern-primitives-0.0.0.tgz`.startsWith("xoroh-kern") is TRUE — so a
 * prefix match silently returned the primitives tarball while reading the kern
 * manifest, and the script reported a confusing JSON error instead of the real
 * problem. Every pack goes to ONE directory, so the versions must match too.
 */
function findTarball(dir, name, version) {
  const flat = name.replace("@", "").replace("/", "-");
  const hit = readdirSync(dir).find((f) => f === `${flat}-${version}.tgz`);
  if (!hit) throw new Error(`no tarball ${flat}-${version}.tgz in ${dir}`);
  return join(dir, hit);
}

const failures = [];
const checked = [];
const workdir = mkdtempSync(join(tmpdir(), "kern-preflight-"));

try {
  for (const rel of MANIFESTS) {
    const dir = resolve(ROOT, rel);
    const source = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    if (source.private === true) continue;

    // Pack with the tool that rewrites the workspace protocol correctly. Packing
    // with npm here would defeat the check: npm reproduces the defect instead of
    // proving it absent.
    //
    // Wrapped: a gate that dies with a stack trace when the pack command fails is
    // worse than useless, because the operator sees a Node error instead of the
    // publish problem that caused it.
    try {
      execFileSync("bun", ["pm", "pack", "--destination", workdir], {
        cwd: dir,
        stdio: "ignore",
      });
    } catch (err) {
      throw new Error(
        `preflight-publish: could not pack ${source.name} (${rel}). ` +
          `A pack failure is itself a publish blocker — fix it before releasing. ` +
          `Cause: ${err.status ?? err.message}`,
      );
    }

    // execFileSync returns the OUTPUT ITSELF when `encoding` is set — it is not
    // an object with a `.stdout`. Destructuring `{ stdout }` here silently
    // yielded undefined and the JSON.parse error pointed at the parse rather
    // than at the destructuring.
    const stdout = execFileSync(
      "tar",
      [
        "-xzOf",
        findTarball(workdir, source.name, source.version),
        "package/package.json",
      ],
      { encoding: "utf8" },
    );
    const packed = JSON.parse(stdout);

    for (const field of SHIPPED_FIELDS) {
      for (const [name, range] of Object.entries(packed[field] ?? {})) {
        if (typeof range === "string" && range.startsWith("workspace:")) {
          failures.push(
            `  ${packed.name}  ${field}.${name} = "${range}"  survived packing (${rel})`,
          );
        }
      }
    }
    checked.push(packed.name);
  }
} finally {
  rmSync(workdir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(
    "preflight-publish: FAILED — a workspace: specifier reached a published manifest\n",
  );
  for (const line of failures) console.error(line);
  console.error(
    "\nThe tarball was packed with BUN, which rewrites workspace: to an exact\n" +
      "version. Reaching here means the pack did not go through bun, so the\n" +
      "manifest would ship verbatim and every consumer install would fail with\n" +
      "EUNSUPPORTEDPROTOCOL. Release with `bun pm publish`.\n" +
      "\nDo NOT 'fix' this by moving internal packages to peerDependencies. That\n" +
      "inverts the D-034 layering and invites a consumer to substitute a different\n" +
      "token engine. The declaration is correct; the tool is the variable.",
  );
  process.exit(1);
}

console.log(
  `preflight-publish: ok — ${checked.length} packages packed with bun, no ` +
    `workspace: in any shipped manifest (${checked.join(", ")})`,
);
