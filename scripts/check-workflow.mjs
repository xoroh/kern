#!/usr/bin/env node
/**
 * check:workflow -- CI must actually invoke the gates we believe it does.
 *
 * WHY THIS EXISTS
 *
 * `ci.yml` carried two `run:` keys under one step. A YAML map key is unique, so
 * only the last survived and `check:parity` -- the gate this programme is built
 * around -- was silently NOT running in CI. It was wired, named, documented, and
 * green in every local run. Nothing was red, because nothing had failed.
 *
 * A duplicate key is a SYNTACTIC problem that most YAML loaders either tolerate
 * (last wins) or ignore, so a plain parse cannot see it. This gate therefore
 * parses twice: once strictly (which surfaces duplicate keys as a parse error or
 * as a `uniqueKeys: false` parse) and once for structure.
 *
 * It then checks the thing that actually matters, which is stronger than
 * well-formedness: EVERY gate in the repo's scripts must be invoked by CI, or
 * explicitly excused. A gate nobody wired is the same defect as a gate wired but
 * dropped by a duplicate key -- it is dark, and darkness is silent.
 *
 * Parsed with `yaml`, not a regex. Hand-rolled YAML is how a gate ends up
 * confidently reporting on a file it never really read.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, parseDocument } from "yaml";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WF_DIR = join(ROOT, ".github", "workflows");

const violations = [];

/** `--dump` prints CI's exact invocations (with working-directory) and exits. */
const DUMP = process.argv.includes("--dump");

/** Gates a workflow may legitimately NOT run, with the reason. */
const NOT_IN_CI = new Map([
  // Per-package publish dry-runs are driven by the per-package matrix jobs,
  // which invoke them through `bun run check:publish`, not by name.
  ["check:publish", "invoked by the per-package publish matrix"],
]);

// --- 1. duplicate map keys, per workflow file ---------------------------------
const workflows = readdirSync(WF_DIR).filter((f) => /\.ya?ml$/.test(f));
const invoked = new Set();

for (const file of workflows) {
  const raw = readFileSync(join(WF_DIR, file), "utf8");

  // `uniqueKeys` defaults to true, so a strict parse FAILS on a duplicate rather
  // than silently taking the last. That is precisely the failure we are hunting.
  const doc = parseDocument(raw, { uniqueKeys: true });
  if (doc.errors.length) {
    for (const err of doc.errors) {
      violations.push(
        `${file}: ${err.message} (line ${err.linePos?.[0]?.line ?? "?"}). ` +
          `A DUPLICATE MAP KEY is how check:parity was dropped from CI: the last ` +
          `value silently wins.`,
      );
    }
    continue;
  }

  const wf = parse(raw);

  // Walk every `run:` in every job, including matrix jobs.
  const collect = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(collect);
    for (const [key, value] of Object.entries(node)) {
      if (key === "run" && typeof value === "string") {
        // ANCHORED (F3). Unanchored, this matched `bun run X` inside a COMMENT
        // or an echoed string -- so a `run:` block that only MENTIONS a gate in
        // prose counted as invoking it, and a genuinely dark gate could be talked
        // into looking lit by a line of explanation.
        //
        // The anchor is line-start OR a shell separator (`&&`, `||`, `;`). Line
        // start alone is too strict: a legitimate `echo x && bun run check:x`
        // would be reported as DARK, which is its own kind of lie. A `#` comment
        // line matches neither, which is the case that matters.
        for (const m of value.matchAll(/(?:^|[;&|]\s*)bun run ([\w:-]+)/gm)) {
          invoked.add(m[1]);
        }
      } else collect(value);
    }
  };
  collect(wf);

  // `--dump` emits the exact invocations, with their working-directory, so the
  // execution proof can run them where CI runs them. A proof harness that runs
  // everything at the repo root produces false failures for every
  // working-directory-scoped script, and a proof that cries wolf is not a proof.
  if (DUMP) {
    const steps = [];
    for (const [job, def] of Object.entries(wf.jobs ?? {})) {
      for (const step of def.steps ?? []) {
        if (typeof step.run === "string") {
          steps.push({
            job,
            name: step.name ?? "?",
            run: step.run,
            wd: step["working-directory"] ?? null,
          });
        }
      }
    }
    console.log(JSON.stringify(steps, null, 1));
    process.exit(0);
  }
}

// --- 2. every check script in package.json must be invoked --------------------
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const gates = Object.keys(pkg.scripts ?? {}).filter((s) =>
  s.startsWith("check:"),
);

const dark = gates.filter((g) => !invoked.has(g) && !NOT_IN_CI.has(g));
for (const g of dark) {
  violations.push(
    `${g} is defined in package.json but NO workflow invokes it. A gate nobody ` +
      `wired is DARK, and a dark gate is indistinguishable from a gate that does ` +
      `not exist.`,
  );
}

// --- 2b. a GATE FILE no workflow step reaches ---------------------------------
// The leg above only sees gates that are `check:*` SCRIPTS. A gate written as a
// standalone `scripts/check-foo.mjs` with no package.json entry passes it
// entirely — which is precisely how `check-elevation-parity` went dark: the file
// existed, was correct, and nothing ran it.
//
// Two distinct failures, both dark:
//   - a `check-*.mjs` file no package.json script POINTS AT -> nobody can even
//     `bun run` it
//   - a `check-*.mjs` file no workflow step reaches        -> it exists and is
//     correct and nothing runs it
//
// Scanned by FILENAME off the real directory, so a gate added under any name is
// caught by the pattern rather than by remembering to update a list.
//
// The script that owns a file is READ from package.json, not guessed from the
// filename. Guessing is wrong here and was wrong on the first attempt of this
// leg: the repo does not spell it `check-<name>.mjs` -> `check:<name>`.
// `check-dist-exports.mjs` is `check:dist`, `check-dist-types.mjs` is
// `check:dist:types`, `check-generated-freshness.mjs` is `check:generated`. A
// name-derived rule reported three wired, working gates as dark — a gate that
// cries wolf is not a gate, it is noise that trains people to ignore it.
//
// So: parse each script's COMMAND for a `scripts/<file>` reference. That is the
// real link, and it is a real parse of a real field rather than a heuristic.
const SCRIPT_DIR = join(ROOT, "scripts");
const GATE_FILE = /^check-[\w-]+\.mjs$/;
const gateFiles = existsSync(SCRIPT_DIR)
  ? readdirSync(SCRIPT_DIR)
      .filter((f) => GATE_FILE.test(f))
      .sort()
  : [];

// file -> the package.json script names whose command runs it.
const scriptsByFile = new Map();
for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
  if (typeof cmd !== "string") continue;
  for (const [, ref] of cmd.matchAll(/scripts\/([\w.-]+\.mjs)/g)) {
    if (!scriptsByFile.has(ref)) scriptsByFile.set(ref, []);
    scriptsByFile.get(ref).push(name);
  }
}

for (const file of gateFiles) {
  const owners = scriptsByFile.get(file) ?? [];
  if (owners.length === 0) {
    violations.push(
      `scripts/${file} is a gate file and NO package.json script runs it. A gate ` +
        `nobody can \`bun run\` is dark in the same way as one CI never calls — ` +
        `add the script entry.`,
    );
    continue;
  }
  // Excused counts as reachable: `check:publish` is in NOT_IN_CI because the
  // per-package matrix invokes it, and that is a legitimate wiring.
  const reachable = owners.filter((s) => invoked.has(s) || NOT_IN_CI.has(s));
  if (reachable.length === 0) {
    violations.push(
      `scripts/${file} is run by ${owners.map((s) => `\`${s}\``).join(", ")} but ` +
        `NO workflow invokes ${reachable.length === 0 ? "any of them" : "them"}. ` +
        `The package.json leg cannot see this: a gate whose script is never ` +
        `wired into CI passes it silently, which is how check-elevation-parity ` +
        `went dark.`,
    );
  }
}

// --- 3. the gates this programme depends on, called out by name ---------------
// These have each caught a real defect, so their absence is worth a distinct
// message rather than a generic one in the list above.
const LOAD_BEARING = [
  "check:parity",
  "check:primitives",
  "check:layers",
  "check:consumption",
  "check:pack",
  "check:workflow",
];
for (const g of LOAD_BEARING) {
  if (!invoked.has(g) && !dark.includes(g) && !NOT_IN_CI.has(g)) {
    violations.push(`load-bearing gate ${g} is not invoked by any workflow.`);
  }
}

if (violations.length) {
  console.error("workflow wiring contract FAILED:\n");
  for (const v of violations) console.error(`  - ${v}`);
  console.error(
    `\n  ${workflows.length} workflow file(s) parsed · ` +
      `${gates.length} gate(s) in package.json (${dark.length} dark) · ` +
      `${gateFiles.length} gate file(s) in scripts/`,
  );
  process.exit(1);
}

console.log(
  `workflow wiring contract passes: ${workflows.length} workflow file(s) parse ` +
    `with no duplicate keys, all ${gates.length} check gates are invoked by CI ` +
    `(${NOT_IN_CI.size} excused), and all ${gateFiles.length} scripts/check-*.mjs ` +
    `gate files are reachable from both package.json and a workflow. No gate is dark.`,
);
