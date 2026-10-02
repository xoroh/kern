#!/usr/bin/env node
/**
 * check-commit-intent — list what a commit is about to include, and refuse
 * paths outside the author's declared intent.
 *
 * ## WHY THIS EXISTS
 *
 * Commit `890b5d1` is a gate commit ("fix(gate): check:generated:census…")
 * whose message and report described ONLY gate work. Its diff also carried
 * **794 lines of site-se's feature work** — `families.ts` (195, NEW),
 * `component-gallery.tsx` (236, NEW), and 363 modified lines across
 * `routes/components/*`. Neither the message nor
 * `.team/reports/kern-lead-0020.md` mentioned them; the report actually called
 * them "site-se's in-flight files… Not mine; not touched" while its own commit
 * had created them.
 *
 * Nothing was wrong with the work. What was wrong is that a reader — or an
 * auditor — cannot tell whose it is, because the commit's own claim contradicted
 * its own diff. The counter-rule already covers commands; this is its
 * commit-side twin, applied at WRITE time rather than in review.
 *
 * ## HOW IT DECIDES
 *
 * Two modes, both of which PRINT what is staged:
 *
 *   no `KERN_COMMIT_INTENT`  -> LIST everything, flag cross-lane risk, exit 0.
 *     Cannot judge intent it was never told, and a hook that refuses every
 *     commit because nobody set an env var is a hook that gets uninstalled.
 *
 *   `KERN_COMMIT_INTENT` set -> anything staged that matches no declared
 *     pattern is UNEXPECTED, and any unexpected path is a REFUSAL (exit 1)
 *     naming each one and its CODEOWNERS owner.
 *
 * Ownership comes from `.github/CODEOWNERS`, parsed with last-match-wins, so
 * the message can say WHOSE work is being swallowed rather than just listing a
 * path. That is the information the 890b5d1 author lacked.
 *
 * Usage (the pre-commit hook calls this):
 *   KERN_COMMIT_INTENT="scripts/** package.json" git commit -m …
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const git = (args) =>
  execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

/** Staged paths (added/copied/modified/renamed), i.e. what the commit includes. */
const staged = git(["diff", "--cached", "--name-only", "--diff-filter=ACMR"])
  .split("\n")
  .filter(Boolean);

const intentRaw = process.env.KERN_COMMIT_INTENT ?? "";
const intent = intentRaw
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

// ---------------------------------------------------------------- CODEOWNERS
/**
 * Parse CODEOWNERS into ordered `[pattern, owner[]]` pairs. Last match wins,
 * which is GitHub's own rule, so the owner reported is the EFFECTIVE one.
 * Comments and blank lines are skipped — this file documents dead paths in
 * comments on purpose, and a comment is not a rule.
 */
function parseCodeowners() {
  const rel = ".github/CODEOWNERS";
  if (!existsSync(join(ROOT, rel))) return [];
  const rules = [];
  readFileSync(join(ROOT, rel), "utf8")
    .split("\n")
    .forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      const parts = line.split(/\s+/);
      rules.push({
        pattern: parts[0],
        owners: parts.slice(1),
        line: idx + 1,
        catchAll: parts[0] === "*",
      });
    });
  return rules;
}

const CODEOWNERS = parseCodeowners();

/** gitignore-style glob -> RegExp. Same translation the stale-refs gate uses. */
function globToRegExp(glob) {
  const isDir = glob.endsWith("/");
  const body = isDir ? glob.slice(0, -1) : glob;
  let re = "";
  for (let i = 0; i < body.length; i += 1) {
    const c = body[i];
    if (c === "*") {
      if (body[i + 1] === "*") {
        if (body[i + 2] === "/") {
          re += "(?:[^/]+/)*";
          i += 2;
        } else {
          re += ".*";
          i += 1;
        }
      } else re += "[^/]*";
      continue;
    }
    if (c === "?") {
      re += "[^/]";
      continue;
    }
    re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}${isDir ? "/" : ""}.*$`);
}

/** The EFFECTIVE owner of a path, by last-match-wins. */
function ownerOf(path) {
  let owner = null;
  for (const rule of CODEOWNERS) {
    if (rule.catchAll) {
      owner = rule.owners;
      continue;
    }
    if (globToRegExp(rule.pattern).test(path)) owner = rule.owners;
  }
  return owner;
}

const ownerLabel = (path) => {
  const o = ownerOf(path);
  return o?.length ? o.join(" ") : "(default)";
};

// ------------------------------------------------------------------- report
if (staged.length === 0) {
  console.log("check-commit-intent: nothing staged; nothing to include.");
  process.exit(0);
}

const unexpected =
  intent.length === 0
    ? []
    : staged.filter((p) => !intent.some((g) => globToRegExp(g).test(p)));

console.log(
  `check-commit-intent: ${staged.length} path(s) staged, ${unexpected.length} unexpected`,
);
for (const p of staged) {
  const mark = unexpected.includes(p) ? "UNEXPECTED" : "ok        ";
  console.log(`  ${mark}  ${p}  — ${ownerLabel(p)}`);
}

if (intent.length === 0) {
  const owners = new Set(staged.map(ownerLabel));
  console.log(
    "\n  No KERN_COMMIT_INTENT set, so nothing can be judged UNEXPECTED.\n" +
      "  Stage explicitly and declare the scope to make this gate bite:\n" +
      '    KERN_COMMIT_INTENT="scripts/** package.json" git commit -m …\n' +
      `  Distinct owners among the staged paths: ${owners.size}` +
      (owners.size > 1
        ? "\n  >1 owner staged — confirm every one of these is yours before committing."
        : ""),
  );
  process.exit(0);
}

if (unexpected.length > 0) {
  console.error(
    `\ncheck-commit-intent REFUSED — ${unexpected.length} staged path(s) match no ` +
      `declared intent.\n` +
      `  declared intent: ${intent.join("  ")}\n` +
      `  unexpected:\n` +
      unexpected.map((p) => `    ${p}  — ${ownerLabel(p)}`).join("\n") +
      `\n  A commit that swallows another lane's work is invisible in the message\n` +
      `  and unattributable in review. That is what 890b5d1 did with 794 lines\n` +
      `  of site-se's feature work.\n` +
      `  Fix: unstage the foreign paths (git restore --staged <path>), or widen\n` +
      `  the declared intent if they ARE yours.`,
  );
  process.exit(1);
}

console.log(
  `\n  every staged path matches the declared intent (${intent.join(", ")}).`,
);
