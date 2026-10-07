#!/usr/bin/env node
/**
 * check:stale-refs — a CONFIG entry naming a path that no longer exists is a
 * dead rule, and a dead rule is worse than no rule because it reads as coverage.
 *
 * ## WHY THIS EXISTS
 *
 * The 0020 sweep found 9 references to the deleted
 * `packages/mcp/src/component-sources.ts` where a `.md`-scoped grep had found 4.
 * Two were config that named the deleted file:
 *
 *   - a `biome.json` override disabling format/lint/assist for it
 *   - a `git diff --exit-code -- …` entry in ci.yml, which I MEASURED exits 0
 *     when the path is missing
 *
 * Both sat in files a reviewer reads as "the things that are checked". The
 * ci.yml one is the sharper failure: it is on a line that looks like it proves a
 * generated artifact is current, and it proved nothing.
 *
 * WHY NOT A GREP
 *
 * A text grep cannot tell a path from prose about a path. The same string
 * appears in a live rule, in a comment explaining that the rule was removed,
 * and in release-note history — and only the first is a defect. Worse, each
 * config format has DIFFERENT path semantics, so one regex cannot be right for
 * all of them:
 *
 *   biome.json      `includes` is a GLOB. A routeTree pattern legitimately
 *                   matches nothing today (the file is gitignored) and is not a
 *                   defect; `packages/mcp/src/component-sources.ts` matches
 *                   nothing and IS dead.
 *   CODEOWNERS      gitignore-style patterns, plus a bare `*` meaning
 *                   "everything", plus last-match-wins. A bare `*` is not a
 *                   path at all.
 *   ci.yml          paths appear inside `run:` shell text, as arguments to
 *                   `git diff --exit-code --`. Only THAT flag takes pathspecs;
 *                   a path mentioned in `bun run foo` is a script name.
 *
 * So each surface is parsed by its OWN reader and resolved by its OWN matcher,
 * and each carries an explicit exemption with a reason. A gate that guesses
 * wrong here reports the whole repo as broken and is switched off within a day.
 *
 * ## WHAT IT DELIBERATELY DOES NOT COVER
 *
 * Prose. A `.md` file or a comment saying "deleted in 24f7810" is HISTORY and is
 * correct as written; rewriting it would be the same error in the other
 * direction. This gate reads config that ASSERTS something about the tree.
 *
 * Usage: `bun run check:stale-refs`
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { matchesPath } from "./lib/codeowners.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const violations = [];
const checked = [];

/**
 * Every TRACKED path, POSIX-separated. From `git ls-files`, not a filesystem
 * walk: a rule can legitimately name an UNTRACKED-but-present path
 * (`routeTree.gen.ts` is gitignored on purpose), and node_modules/dist would
 * drown the signal.
 */
const tracked = new Set(
  execFileSync("git", ["ls-files"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\n")
    .filter(Boolean),
);

/** Does this path exist on disk? Tracked or not — a rule may name ignored output. */
const onDisk = (rel) => existsSync(join(ROOT, rel));

/**
 * Every path on disk worth matching a config glob against — tracked files PLUS
 * present-but-ignored ones.
 *
 * The second set is not optional. `biome.json` has a live override for
 * `routeTree.gen.ts`, which `apps/site/.gitignore` deliberately excludes from
 * git because `tsr generate` rewrites it on every typecheck. Matching tracked
 * files only reported that live override as dead — the first run of this gate
 * did exactly that, and the file was on disk the whole time. A rule that names
 * an ignored-but-generated path is one of the most common legitimate cases there
 * is.
 *
 * The walk skips `node_modules`, `.git` and `dist`: thousands of files that no
 * config rule targets, and reading them would make the gate slow enough to be
 * skipped.
 */
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".tanstack"]);
function walkDisk(dir, prefix = "") {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walkDisk(join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out;
}
const onDiskPaths = new Set(walkDisk(ROOT));

// --------------------------------------------------------------- glob -> RegExp
/**
 * Translate a gitignore/biome-style glob to a RegExp.
 *
 * Supports the forms this repo actually uses, and NOTHING more:
 *   `**`      any number of path segments
 *   `*`       any characters within one segment
 *   `?`       one character within a segment
 * A trailing `/` means "directory and everything under it", which is how
 * CODEOWNERS and biome both read it.
 */
function globToRegExp(glob) {
  const isDir = glob.endsWith("/");
  const body = isDir ? glob.slice(0, -1) : glob;
  let re = "";
  for (let i = 0; i < body.length; i += 1) {
    const c = body[i];
    if (c === "*") {
      if (body[i + 1] === "*") {
        // `**/` collapses to "any depth including none"
        if (body[i + 2] === "/") {
          re += "(?:[^/]+/)*";
          i += 2;
        } else {
          re += ".*";
          i += 1;
        }
      } else {
        re += "[^/]*";
      }
      continue;
    }
    if (c === "?") {
      re += "[^/]";
      continue;
    }
    re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  // A directory pattern owns its contents; a file pattern matches only itself.
  return new RegExp(`^${re}${isDir ? "/" : ""}.*$`);
}

/**
 * Does this glob match ANY path in the repo — tracked or merely present?
 *
 * Both sets are consulted because each alone produces a false verdict in a
 * different direction: tracked-only calls a live gitignored-file rule dead, and
 * disk-only would let a rule survive because some untracked build artifact
 * happens to sit at that path today.
 */
const matchesSomething = (glob) => {
  const re = globToRegExp(glob);
  for (const path of tracked) if (re.test(path)) return true;
  for (const path of onDiskPaths) if (re.test(path)) return true;
  return false;
};

const report = (surface, entry, reason) => {
  violations.push(`${surface}: ${entry} — ${reason}`);
};

// ------------------------------------------------------- 1. biome.json overrides
/**
 * `overrides[].includes` is a glob list. An override whose globs match NOTHING
 * in the tree is dead configuration: it can never apply, to anything, ever.
 */
function checkBiome() {
  const rel = "biome.json";
  const cfg = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
  const overrides = cfg.overrides ?? [];
  let live = 0;
  for (const override of overrides) {
    for (const glob of override.includes ?? []) {
      if (!matchesSomething(glob)) {
        report(
          rel,
          `overrides[].includes "${glob}"`,
          "matches no file in the repo, tracked or present. This override can " +
            "never apply to anything, including a future file of that name. " +
            "Delete it, or fix the path.",
        );
      } else {
        live += 1;
      }
    }
  }
  checked.push(`${rel}: ${overrides.length} override(s), ${live} live glob(s)`);
  return live;
}

// ------------------------------------------------------- 2. CODEOWNERS patterns
/**
 * CODEOWNERS uses GitHub semantics (see scripts/lib/codeowners.mjs): a leading
 * `/` anchors at the repo root; a bare name matches at any depth; a trailing
 * `/` owns a directory and its contents. `*` alone is the catch-all and is NOT
 * a path — matching nothing is its job, so it is exempt by name.
 *
 * Comments are prose (including documented deletions) and are skipped.
 */
function checkCodeowners() {
  const rel = ".github/CODEOWNERS";
  if (!onDisk(rel)) {
    report(rel, "(file)", "referenced by this gate but does not exist");
    return 0;
  }
  const lines = readFileSync(join(ROOT, rel), "utf8").split("\n");
  let live = 0;
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    // Comments are HISTORY here — the file documents deleted paths in them on
    // purpose. Only real rules are checked.
    if (!line || line.startsWith("#")) return;
    const pattern = line.split(/\s+/)[0];
    // `*` is the catch-all. It is supposed to match everything, including
    // nothing, so its matching nothing is not a defect.
    if (pattern === "*") return;
    // CODEOWNERS patterns use GitHub semantics (leading `/` = root-only;
    // bare names match any depth). Do NOT reuse the biome glob matcher.
    const hits =
      [...tracked].some((p) => matchesPath(pattern, p)) ||
      [...onDiskPaths].some((p) => matchesPath(pattern, p));
    if (!hits) {
      report(
        `${rel}:${idx + 1}`,
        `pattern "${pattern}"`,
        "matches no file in the repo, tracked or present. A CODEOWNERS rule " +
          "that matches nothing never fires, so it routes reviews nowhere " +
          "while appearing to route them. GitHub ignores dead rules silently.",
      );
    } else {
      live += 1;
    }
  });
  checked.push(`${rel}: ${live} live rule(s)`);
  return live;
}

// ------------------------------------------------- 3. ci.yml git-diff pathspecs
/**
 * `git diff --exit-code -- <paths>` is the ONLY construct here whose arguments
 * are pathspecs. Parsed by walking the YAML for `run:` blocks and reading the
 * argv after that flag, so a path mentioned in `bun run check:x` is never
 * mistaken for a pathspec.
 *
 * Measured: `git diff --exit-code -- <missing>` exits 0. So a missing path here
 * is not an error, it is INVISIBILITY — the line reads as proof and proves
 * nothing. That is the defect this reports.
 */
function checkWorkflows() {
  const dir = join(ROOT, ".github", "workflows");
  if (!existsSync(dir)) {
    report(".github/workflows", "(directory)", "does not exist");
    return 0;
  }
  let live = 0;
  let total = 0;
  for (const file of readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))) {
    const rel = `.github/workflows/${file}`;
    const wf = parseYaml(readFileSync(join(dir, file), "utf8"));
    // Walk every `run:` string anywhere in the tree, including matrix jobs.
    const runs = [];
    const collect = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(collect);
      for (const [k, v] of Object.entries(node)) {
        if (k === "run" && typeof v === "string") runs.push(v);
        else collect(v);
      }
    };
    collect(wf);
    for (const run of runs) {
      // Tokenise on shell separators, then find `--` and read what follows.
      for (const segment of run.split(/[\n;]+/)) {
        const argv = segment.trim().split(/\s+/).filter(Boolean);
        const dd = argv.indexOf("diff");
        if (dd === -1) continue;
        const ddEnd = argv.indexOf("--exit-code", dd);
        if (ddEnd === -1) continue;
        const sep = argv.indexOf("--", ddEnd);
        if (sep === -1) continue;
        for (const path of argv.slice(sep + 1)) {
          if (path.startsWith("-")) continue;
          total += 1;
          // A pathspec can name a DIRECTORY; git then diffs everything under
          // it. Both forms are live if they resolve.
          if (onDisk(path)) {
            live += 1;
          } else {
            report(
              rel,
              `"${path}" in git diff --exit-code`,
              "does not exist. MEASURED: `git diff --exit-code -- <missing>` " +
                "exits 0, so this entry neither fails nor verifies anything — it " +
                "reads as proof of a generated artifact being current while " +
                "proving nothing.",
            );
          }
        }
      }
    }
  }
  checked.push(
    `.github/workflows: ${live}/${total} git-diff pathspec(s) resolve`,
  );
  return live;
}

// ---------------------------------------------------- 4. package.json script paths
/**
 * A `scripts` entry pointing at a file that does not exist fails loudly on
 * `bun run`, so this is a lesser defect than the three above — but a script
 * whose command names a moved script is still a dead entry.
 */
function checkPackageScripts() {
  const rel = "package.json";
  const pkg = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
  let live = 0;
  for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
    if (typeof cmd !== "string") continue;
    for (const m of cmd.matchAll(
      /(?:^|[\s&|])([\w./-]+\.(?:mjs|cjs|js|ts))/g,
    )) {
      const script = m[1];
      if (script.startsWith("node ") || script.includes("/")) {
        if (onDisk(script)) live += 1;
        else {
          report(
            rel,
            `scripts["${name}"] -> "${script}"`,
            "does not exist. `bun run` would fail on it, but a script entry " +
              "naming a moved file is a dead rule until someone runs it.",
          );
        }
      }
    }
  }
  checked.push(`${rel}: ${live} script path(s) resolve`);
  return live;
}

// ------------------------------------------------------------------- run them
const surfaces = [
  ["biome.json", checkBiome],
  [".github/CODEOWNERS", checkCodeowners],
  [".github/workflows", checkWorkflows],
  ["package.json", checkPackageScripts],
];

for (const [, fn] of surfaces) fn();

console.log(
  "check:stale-refs — config entries that name paths that no longer exist",
);
for (const line of checked) console.log(`  ${line}`);

if (violations.length) {
  console.error(
    `\ncheck:stale-refs FAILED — ${violations.length} dead rule(s):`,
  );
  for (const v of violations) console.error(`  - ${v}`);
  console.error(
    "\n  A dead rule is worse than no rule: it reads as coverage. Remove the\n" +
      "  entry, repoint it, or — if it documents a deletion on purpose — move\n" +
      "  the mention into a comment, which this gate does not read.",
  );
  process.exit(1);
}

console.log(
  "\nno dead rules: every path-bearing config entry resolves to something that " +
    "exists. Prose and comments are not read, so documented history stays correct.",
);
