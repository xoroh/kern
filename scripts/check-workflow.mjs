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

import { readdirSync, readFileSync } from "node:fs";
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
      `${gates.length} gate(s) in package.json · ${dark.length} dark`,
  );
  process.exit(1);
}

console.log(
  `workflow wiring contract passes: ${workflows.length} workflow file(s) parse ` +
    `with no duplicate keys, and all ${gates.length} check gates are invoked by ` +
    `CI (${NOT_IN_CI.size} excused). No gate is dark.`,
);
