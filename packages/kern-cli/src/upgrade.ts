/**
 * `kern upgrade` — customization-safe updates (KERN-039/040).
 *
 * The problem `add` refuses to solve: a vendored file the consumer OWNS and
 * has edited, while upstream moved on. Overwriting is shipping someone else's
 * breaking change as their commit; skipping silently is how a dest rots five
 * minors behind while reporting current.
 *
 * The rule: re-plan from the CURRENT registry, compare per file.
 * - dest missing → add it.
 * - dest matches baseline, upstream moved → update it.
 * - dest matches upstream → keep it (idempotent re-run changes nothing).
 * - dest differs from baseline (customized) → KEEP the dest bytes, mark the
 *   row customized, and REPORT it. Owned edits are never overwritten.
 *
 * `--dry-run` (default) prints the plan and writes nothing. `--apply`
 * performs it transactionally: the receipt is rewritten only after every file
 * lands, and a customized file's baseline is NOT moved — the next upgrade
 * still sees the divergence. The receipt's currentHash follows the dest, so
 * `diff` stays honest between upgrades.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type AddOptions, planBlock, planComponent } from "./add.js";
import { type InstallReceipt, readReceipt } from "./receipt.js";

export type UpgradePlan = {
  add: string[];
  update: string[];
  keep: string[];
  customized: string[];
};

export type UpgradeResult = {
  component: string;
  plan: UpgradePlan;
  applied: boolean;
  receipt: string;
};

function sha16(bytes: string): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

function fail(msg: string): never {
  throw new Error(`kern upgrade: ${msg}`);
}

export function upgradeComponent(
  name: string,
  opts: AddOptions & { apply?: boolean } = {},
): UpgradeResult {
  const plan = planComponent(name, opts);
  return upgradeWithPlan(name, "component", plan, opts);
}

export function upgradeBlock(
  name: string,
  opts: AddOptions & { apply?: boolean } = {},
): UpgradeResult {
  const plan = planBlock(name, opts);
  return upgradeWithPlan(name, "block", plan, opts);
}

function upgradeWithPlan(
  name: string,
  kind: "component" | "block",
  plan: {
    files: { out: string; bytes: string }[];
    version: string;
    releaseSet: string;
  },
  opts: AddOptions & { apply?: boolean } = {},
): UpgradeResult {
  const cwd = opts.cwd ?? process.cwd();
  const dest = opts.dest ?? join(cwd, "components", "kern");
  const receiptPath = join(dest, "kern.receipt.json");
  if (!existsSync(receiptPath)) {
    fail(`no receipt at ${receiptPath} — not a kern dest.`);
  }
  const receipt = readReceipt(JSON.parse(readFileSync(receiptPath, "utf8")));
  const owned = receipt.files.filter((f) => f.owner === `${kind}:${name}`);
  if (owned.length === 0) {
    fail(`"${name}" is not vendored here — run \`kern add ${name}\` first.`);
  }

  const decided: UpgradePlan = {
    add: [],
    update: [],
    keep: [],
    customized: [],
  };
  const fresh = new Map(plan.files.map((f) => [f.out, f.bytes]));
  for (const row of owned) {
    const next = fresh.get(row.path);
    if (next === undefined) continue; // upstream dropped it: kept, reported below
    const destAbs = join(dest, row.path);
    const destBytes = existsSync(destAbs)
      ? readFileSync(destAbs, "utf8")
      : null;
    const destHash = destBytes === null ? null : sha16(destBytes);
    const freshHash = sha16(next);
    if (destBytes === null) {
      decided.add.push(row.path);
    } else if (destHash === freshHash) {
      decided.keep.push(row.path);
    } else if (destHash === row.baselineHash) {
      decided.update.push(row.path);
    } else {
      decided.customized.push(row.path);
    }
  }
  // Planned files the receipt never owned are new upstream files.
  for (const out of fresh.keys()) {
    if (!owned.some((r) => r.path === out) && !existsSync(join(dest, out))) {
      decided.add.push(out);
    }
  }

  if (!opts.apply) {
    return {
      component: name,
      plan: decided,
      applied: false,
      receipt: receiptPath,
    };
  }

  // Apply: non-customized changes land, customized files are preserved, and
  // the receipt is rewritten LAST so a crash leaves files without a claim
  // rather than a claim without files.
  const next: InstallReceipt = {
    ...receipt,
    releaseSet: plan.releaseSet,
    files: receipt.files.map((row) => ({ ...row })),
  };
  const byPath = new Map(next.files.map((r) => [r.path, r]));
  for (const path of [...decided.add, ...decided.update]) {
    const bytes = fresh.get(path) as string;
    const outAbs = join(dest, path);
    mkdirSync(dirname(outAbs), { recursive: true });
    writeFileSync(outAbs, bytes);
    const hash = sha16(bytes);
    const row = byPath.get(path);
    if (row) {
      row.baselineHash = hash;
      row.currentHash = hash;
    } else {
      byPath.set(path, {
        path,
        baselineHash: hash,
        currentHash: hash,
        owner: `${kind}:${name}`,
        customized: false,
      });
    }
  }
  for (const path of decided.customized) {
    const row = byPath.get(path);
    if (row) {
      row.currentHash = sha16(readFileSync(join(dest, path), "utf8"));
      row.customized = true;
    }
  }
  next.files = [...byPath.values()];
  next.config = { ...next.config, kern: plan.version };
  writeFileSync(receiptPath, `${JSON.stringify(next, null, 2)}\n`);
  return {
    component: name,
    plan: decided,
    applied: true,
    receipt: receiptPath,
  };
}

export function formatUpgrade(result: UpgradeResult): string {
  const { plan } = result;
  const lines = [
    `${result.component}: ${result.applied ? "upgraded" : "dry run — no writes (pass --apply)"}`,
  ];
  const show = (label: string, paths: string[]) => {
    if (paths.length > 0) lines.push(`  ${label}: ${paths.join(", ")}`);
  };
  show("add", plan.add);
  show("update", plan.update);
  show("keep", plan.keep);
  if (plan.customized.length > 0) {
    lines.push(
      `  customized (preserved, NOT overwritten): ${plan.customized.join(", ")}`,
    );
  }
  return lines.join("\n");
}
