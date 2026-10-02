#!/usr/bin/env node
/**
 * Generated-output freshness gate.
 *
 * WHY THIS EXISTS
 * ---------------
 * `tokens.json` is the single source of truth (D-026 Fork 3). Everything in
 * `packages/kern-tokens/src/*.css` is DERIVED from it by a generator. The
 * failure mode this catches is the one we have now hit three times in this
 * program: a derived artifact is committed, the generator is not re-run, and
 * every gate stays green while the artifact has silently drifted from its
 * source. A gate that passes because it did not look is worse than one that
 * fails.
 *
 * The three generators are run into a TEMP copy of the tree, then compared
 * byte-for-byte against what is committed. Nothing on disk is written, so this
 * is safe to run read-only in CI and on a dirty worktree.
 *
 * COMPLETENESS IS A SEPARATE GATE. This one proves the files it lists are
 * fresh. It cannot prove the LIST is complete — and the incompleteness is what
 * produced three of the four defects in the 23:38 batch.
 * `scripts/generated-artifacts.mjs` holds the shared list;
 * `check-generated-census.mjs` proves every generated artifact in the tree
 * appears in it. Both import ONE list on purpose: two copies would drift, and a
 * completeness gate that is complete only with respect to itself is the same
 * defect one level up.
 *
 * Usage: `bun run check:generated`
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { GENERATORS } from "./generated-artifacts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The generator registry now lives in `generated-artifacts.mjs` so that
// `check-generated-census.mjs` can prove the LIST is complete against the same
// source. It was inline here until the 23:38 batch, which is why three of its
// four defects were files nothing here claimed.

// Files biome formats inside the generators, so a generator run in a copy that
// skips the repo's biome install can differ cosmetically. Comparing normalized
// whitespace removes that false positive without hiding real drift.
const normalize = (text) => text.replace(/\s+/g, " ").trim();

/** Every FILE under `dir`, recursively, sorted for a deterministic order. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/**
 * `[repoRelativePath, contents]` for one generator output entry, whether that
 * entry names a file or a whole directory.
 */
function* snapshot(fullAbs, outputEntry) {
  if (!statSync(fullAbs).isDirectory()) {
    yield [outputEntry, readFileSync(fullAbs, "utf8")];
    return;
  }
  for (const file of walk(fullAbs)) {
    yield [relative(ROOT, file), readFileSync(file, "utf8")];
  }
}

const stale = [];
const missing = [];

for (const { name, cmd, outputs } of GENERATORS) {
  // An `outputs` entry may be a FILE or a DIRECTORY (the icon sets are ~35
  // files under one tree). Directory entries are snapshotted RECURSIVELY, so
  // the freshness compare covers the whole generated tree without the
  // registry having to name 35 paths. Reading a directory as a file is an EISDIR
  // crash, which is how this first failed when the icon entry was added.
  const before = new Map();
  for (const out of outputs) {
    const full = join(ROOT, out);
    if (!existsSync(full)) {
      missing.push(out);
      continue;
    }
    for (const [rel, content] of snapshot(full, out)) {
      before.set(rel, content);
    }
  }

  // Run the generator against the real tree, then restore every file it could
  // have touched. This keeps the check honest (the generator sees the real
  // tokens.json) without needing a full tree copy and an install.
  const run = spawnSync(cmd[0], cmd.slice(1), {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (run.status !== 0) {
    console.error(`FAIL ${name} exited ${run.status}`);
    if (run.stderr)
      console.error(run.stderr.trim().split("\n").slice(-6).join("\n"));
    process.exit(1);
  }

  for (const out of outputs) {
    const full = join(ROOT, out);
    if (!existsSync(full)) {
      stale.push(`${out} — the generator did not produce it`);
      continue;
    }
    for (const [rel, content] of snapshot(full, out)) {
      if (!before.has(rel)) {
        stale.push(`${rel} — produced by ${cmd[0]} but not present before`);
        continue;
      }
      const original = before.get(rel);
      if (normalize(content) !== normalize(original)) {
        stale.push(`${rel} — does not match a fresh run of ${cmd[0]}`);
      }
    }
    // A file that EXISTED before and is gone after is drift too: the generator
    // dropped output. Without this leg a deleted generated file reads as fresh.
    for (const [rel] of before) {
      if (rel.startsWith(`${out}/`) && !existsSync(join(ROOT, rel))) {
        stale.push(`${rel} — present before the run, gone after it`);
      }
    }
  }
  // Restore every output byte-for-byte, whatever happened above. This gate must
  // never leave the worktree modified — including when it is ABOUT to fail.
  for (const [out, content] of before) {
    const full = join(ROOT, out);
    if (existsSync(full) && statSync(full).isDirectory()) continue;
    writeFileSync(full, content, "utf8");
  }
  // Directories are restored by removing anything the run ADDED, so the
  // worktree is byte-identical to how we found it.
  for (const out of outputs) {
    const full = join(ROOT, out);
    if (!existsSync(full) || !statSync(full).isDirectory()) continue;
    for (const file of walk(full)) {
      const rel = relative(ROOT, file);
      if (!before.has(rel)) rmSync(file, { force: true });
    }
  }
}

if (missing.length) {
  console.error(
    `generated output missing from the tree (${missing.length}): ${missing.join(", ")}`,
  );
  console.error("Run `bun run generate:tokens` and commit the result.");
  process.exit(1);
}

if (stale.length) {
  console.error(`generated output is STALE (${stale.length}):`);
  for (const s of stale) console.error(`  ${s}`);
  console.error("");
  console.error(
    "tokens.json is the source of truth; these files are derived from it.",
  );
  console.error("Run `bun run generate:tokens` and commit the result.");
  process.exit(1);
}

console.log(
  `generated output is fresh: ${GENERATORS.length} generators, ` +
    `${GENERATORS.flatMap((g) => g.outputs).length} derived files byte-match a fresh run`,
);
