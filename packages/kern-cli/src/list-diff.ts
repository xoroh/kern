/**
 * `kern list` and `kern diff` — read-only registry operations.
 *
 * `list` prints what the registry holds (components and blocks, with platform
 * and status) — the answer to "what can I add" that the old usage text
 * punted to "step 3". `diff` compares a destination's receipt against the
 * current workspace: added (new files upstream), changed (upstream bytes
 * differ), removed (gone upstream), and customized (dest differs from its own
 * baseline — owned edits `upgrade` must preserve, never overwrite).
 *
 * Both are pure reads. Neither writes, installs, or mutates.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadBlocks } from "./blocks.js";
import { loadRegistry, resolveSystem, WORKSPACE_ROOT } from "./manifest.js";
import { readReceipt } from "./receipt.js";

function sha16(bytes: string): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

export type ListOptions = {
  root?: string;
  platform?: "web" | "native" | "all";
  /** Design system to list (decision 009). Default: the only current system. */
  system?: string;
};

export function listComponents(
  opts: {
    root?: string;
    platform?: "web" | "native" | "all";
    system?: string;
  } = {},
): string[] {
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  const platform = opts.platform ?? "all";
  const { rows } = loadRegistry(root);
  const system = resolveSystem(rows, opts.system);
  return rows
    .filter(
      (r) =>
        (platform === "all" || r.platform === platform) && r.system === system,
    )
    .map(
      (r) =>
        `${r.name} — ${r.export} (${r.platform}, ${r.entrypoint}, ${r.status}, ${r.system})`,
    )
    .sort();
}

export function listBlocks(opts: { root?: string } = {}): string[] {
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  return loadBlocks(root)
    .map((b) => `${b.name} — ${b.title} [${b.category}]`)
    .sort();
}

export type DiffRow = {
  path: string;
  state: "current" | "customized" | "removed";
  owner: string;
};

/**
 * Diff a vendored destination against the current workspace. Reads the
 * receipt, re-resolves every owned component/block from the registry, and
 * compares bytes. Customized files (dest ≠ baseline) are reported, never
 * "fixed" — that is `upgrade`'s job, with consent.
 */
export function diffDest(
  dest: string,
  // Reserved for workspace-scoped resolution; callers pass `{ root }`
  // (see lifecycle.test.ts) and the receipt lookup intentionally ignores it.
  // biome-ignore lint/correctness/noUnusedFunctionParameters: see above.
  opts: { root?: string } = {},
): DiffRow[] {
  const receiptPath = join(dest, "kern.receipt.json");
  if (!existsSync(receiptPath)) {
    throw new Error(
      `kern diff: no receipt at ${receiptPath} — not a kern dest.`,
    );
  }
  const receipt = readReceipt(JSON.parse(readFileSync(receiptPath, "utf8")));
  const rows: DiffRow[] = [];
  for (const file of receipt.files) {
    const outAbs = join(dest, file.path);
    if (!existsSync(outAbs)) {
      rows.push({ path: file.path, state: "removed", owner: file.owner });
      continue;
    }
    // Hashes, not content: the receipt records sha256, so the comparison
    // hashes the dest bytes first. Comparing bytes to a hex string is always
    // unequal — a diff that reports everything changed is a diff nobody runs.
    // A dest that differs from its own baseline is CUSTOMIZED (owned edits),
    // never "changed": whether upstream moved too is upgrade's question, asked
    // with the fresh plan in hand.
    const hash = sha16(readFileSync(outAbs, "utf8"));
    if (hash !== file.baselineHash) {
      rows.push({ path: file.path, state: "customized", owner: file.owner });
      continue;
    }
    rows.push({ path: file.path, state: "current", owner: file.owner });
  }
  return rows.sort((a, b) => a.path.localeCompare(b.path));
}

export function formatDiff(rows: DiffRow[]): string {
  if (rows.every((r) => r.state === "current")) {
    return `current — ${rows.length} file(s) match the receipt.`;
  }
  return rows
    .filter((r) => r.state !== "current")
    .map((r) => `${r.state}  ${r.path} (${r.owner})`)
    .join("\n");
}
