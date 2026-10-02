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
 * So it tests the artefact instead — but WHICH artefact matters, and getting
 * this wrong made the gate structurally blind to its own subject.
 *
 * This script used to pack with `bun pm pack`, on the reasoning that bun is the
 * tool that rewrites correctly and npm "reproduces the defect instead of
 * proving it absent". That reasoning was backwards. The release is published by
 * `changeset publish` (`bun run release`), and changesets shells out to
 * **`npm publish`** — it is npm that decides what bytes ship. Packing the gate
 * with bun therefore inspected an artefact nobody publishes: bun rewrites
 * `workspace:*` to `0.0.0` on the way in, so the check could never fire, and it
 * reported green through every run while `@xoroh/kern` and `@xoroh/kern-native`
 * shipped a manifest that fails a consumer install with EUNSUPPORTEDPROTOCOL.
 *
 * The gate must therefore pack the way the release packs. With `npm pack`:
 *
 *   `npm pack`   ->  "workspace:*" ships VERBATIM    and is exactly what
 *                        changesets would hand to the registry
 *   `bun pm pack` ->  "workspace:*" becomes "0.0.0"   describes a release
 *                        nobody performs
 *
 * So: pack with npm, and treat any surviving `workspace:` as the blocker it is.
 * Whether the fix is a peerDependency with an explicit range or dropping the
 * entry is a release-semantics decision (K-05, kern-lead) — this gate only
 * reports it.
 *
 * Exit 0 = every packed manifest is installable as npm would ship it.
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

    // Pack with npm: that is the tool `changeset publish` uses to publish, so
    // it is the only packing that reproduces the artefact consumers receive.
    // `npm pack --pack-destination` writes to a directory, keeping every
    // tarball in ONE place for findTarball() below.
    //
    // Wrapped: a gate that dies with a stack trace when the pack command fails is
    // worse than useless, because the operator sees a Node error instead of the
    // publish problem that caused it.
    try {
      execFileSync("npm", ["pack", "--pack-destination", workdir], {
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

    // Tool-independent backstop, per D-035. The per-field check below is scoped
    // to the fields npm actually installs from. Assert the same property once
    // more against the packed manifest's shipped fields as a whole, so the gate
    // states the rule ("a published manifest carries no workspace: specifier in
    // anything a consumer installs") rather than only the consequence of
    // whichever tool happened to pack it.
    //
    // NOT the whole file: npm pack KEEPS devDependencies, and a workspace: spec
    // in devDependencies is harmless — npm strips devDeps from the installed
    // tree, so it never reaches a consumer's resolver. Only the installed
    // fields matter, which is why SHIPPED_FIELDS is the scope. (packages/kern
    // legitimately keeps devDependencies.@xoroh/kern-tokens = "workspace:*".)
    const shippedText = JSON.stringify(
      Object.fromEntries(SHIPPED_FIELDS.map((f) => [f, packed[f] ?? {}])),
    );
    if (shippedText.includes("workspace:")) {
      failures.push(
        `  ${packed.name}  packed manifest carries a workspace: specifier in a shipped field (${rel})`,
      );
    }

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
    "\nPacked with NPM, which is what `changeset publish` uses to publish. npm has\n" +
      "no workspace protocol, so this specifier ships VERBATIM and every consumer\n" +
      "install of the affected package fails with EUNSUPPORTEDPROTOCOL.\n" +
      "\nThe fix is a release-semantics decision (K-05) and belongs to kern-lead:\n" +
      "declare the internal package as a peerDependency with an explicit range, or\n" +
      "remove the entry. Do not silence this gate.",
  );
  process.exit(1);
}

console.log(
  `preflight-publish: ok — ${checked.length} packages packed with npm, no ` +
    `workspace: in any shipped manifest (${checked.join(", ")})`,
);
