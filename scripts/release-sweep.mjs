#!/usr/bin/env node
/**
 * release-sweep — the final no-internal-files sweep before any release.
 *
 * WHAT IT CHECKS
 *
 * 1. Repo half: forbidden internal paths present in the checkout —
 *    `.team/`, root scratch dirs, stray tarballs (outside the vendored
 *    `vendor/` tree), superseded planning dirs with real content, and
 *    `.reports/` (lane reports live outside git since the 2026-10-19 Faroeq
 *    rule; whatever is still committed blocks the release until the hygiene
 *    lane moves it).
 * 2. Pack half: for every publishable package, the `bun pm pack --dry-run`
 *    file list must not contain internal files — tests, planning/roadmap/
 *    audit material, agent notes, reports, team files, scratch, or nested
 *    tarballs.
 *
 * Archive (`docs/archive/`) and contributor surfaces (`.agents/skills`,
 * `docs/`, root markdown) are allowlisted with reasons: history is kept
 * deliberately and non-authoritatively, and contributors need the rest.
 * Allowlist hits are printed as notes, never failures.
 *
 * A failure names the exact path. The release does not proceed until the
 * sweep is green — see `docs/releases.md`.
 *
 * Usage: `bun run release-sweep` (needs `bun run build` first: pack
 * lists cover `dist/`, which is gitignored).
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

/** Publishable packages: mirrors the table in `docs/releases.md`. */
const PACKAGES = [
  "packages/kern",
  "packages/kern-tokens",
  "packages/kern-m3",
  "packages/kern-native",
  "packages/kern-icons",
  "packages/kern-contracts",
  "packages/mcp",
  "packages/kern-cli",
];

const failures = [];
const notes = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);
const note = (what) => notes.push(what);

// --- repo half -------------------------------------------------------------
// Only files git sees: tracked plus untracked-but-visible. Ignored build
// output (dist/, node_modules/, caches, generated public/) is not in the
// repo and cannot leak into it.
function repoFiles() {
  const out = [];
  try {
    const tracked = execFileSync("git", ["ls-files"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    out.push(...tracked.split("\n").filter(Boolean));
    const status = execFileSync("git", ["status", "--porcelain"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    for (const line of status.split("\n")) {
      if (line.startsWith("??")) out.push(line.slice(3).trim());
    }
  } catch {
    // Not a git checkout (packed consumer): nothing repo-side to sweep.
    return [];
  }
  return [...new Set(out)];
}

const seen = new Set(repoFiles());
const has = (rel) => seen.has(rel);
const under = (prefix) =>
  [...seen].filter(
    (f) => f === prefix || f.startsWith(`${prefix.replace(/\/$/, "")}/`),
  );

if (has(".team") || under(".team/").length > 0) {
  fail(
    "repo",
    ".team/ lives inside the repo — it is a sibling checkout, move it out",
  );
}
for (const dir of ["scratch", ".scratch", "tmp", ".tmp"]) {
  if (has(dir) || under(`${dir}/`).length > 0) {
    fail("repo", `${dir}/ scratch directory present — remove it`);
  }
}
for (const file of seen) {
  if (/\.t?gz$/.test(file) && !file.startsWith("vendor/")) {
    fail(
      "repo",
      `${file} — stray tarball (only vendor/ tarballs ship by design)`,
    );
  }
}
// Superseded planning dirs: sanctioned README stubs only (see the roadmap's
// Phase 0 log — the stubs are pointers, not plans).
for (const dir of ["docs/planning", "docs/plan"]) {
  for (const file of under(`${dir}/`)) {
    if (file !== `${dir}/README.md`) {
      fail("repo", `${file} — superseded planning content`);
    }
  }
}
{
  const reports = under(".reports/");
  if (reports.length > 0) {
    fail(
      "repo",
      `.reports/ holds ${reports.length} committed file(s) — lane reports live outside git since 2026-10-19; the hygiene lane moves these before release`,
    );
  }
}
if (existsSync(join(ROOT, "docs/archive"))) {
  note(
    "docs/archive/ present and allowlisted — deliberately kept, non-authoritative history (see ARCHIVE_INDEX.md)",
  );
}
note(
  ".agents/skills + docs/ + root markdown allowlisted — contributor surfaces, not internal files",
);

// --- pack half -------------------------------------------------------------
const PACK_FORBIDDEN = [
  [/\.test\.[cm]?[jt]sx?$/, "test file"],
  [/\.rntest\.[jt]sx?$/, "native test file"],
  [/__tests__\//, "test directory"],
  [/\.reports\//, "lane report"],
  [/\.team\//, "team registry"],
  [/(planning|roadmap)/i, "planning material"],
  [/audit/i, "audit material"],
  [/scratch/i, "scratch file"],
  [/\.t?gz$/, "nested tarball"],
];

for (const pkg of PACKAGES) {
  const dir = join(ROOT, pkg);
  let list;
  try {
    const out = execFileSync("bun", ["pm", "pack", "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
    });
    list = out
      .split("\n")
      .filter((l) => l.startsWith("packed "))
      .map((l) => l.replace(/^packed [0-9.]+[KMGTPE]?B /, ""));
  } catch (err) {
    fail(
      pkg,
      `pack dry-run failed — run \`bun run build\` first (${String(err.message).split("\n")[0]})`,
    );
    continue;
  }
  if (list.length === 0) {
    fail(pkg, "pack dry-run listed 0 files");
    continue;
  }
  for (const file of list) {
    for (const [re, label] of PACK_FORBIDDEN) {
      if (re.test(file))
        fail(`pack:${pkg}`, `${file} — ${label} in pack output`);
    }
  }
  const internal = failures.filter((f) => f.startsWith(`pack:${pkg}`)).length;
  if (internal === 0)
    notes.push(`${pkg}: pack output clean (${list.length} files)`);
}

for (const n of notes) console.log(`  note  ${n}`);
if (failures.length > 0) {
  console.error("release-sweep FAILED — internal files found:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  "release-sweep passes: no internal files in the repo or any pack output.",
);
