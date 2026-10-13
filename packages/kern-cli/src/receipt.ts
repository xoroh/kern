/**
 * Install receipts v2 (KERN-038) — evidence, not decoration.
 *
 * V1 (`{kern, mode, components: {name: {files}}, blocks}`) recorded WHAT was
 * vendored but not whether the destination has since drifted: no baseline vs
 * current hashes, no owners, no release set, no config. `kern diff` and
 * `kern upgrade` compared against it anyway, which is how an upgrade could
 * overwrite owned code while reporting success.
 *
 * V2 follows the contracts receipt schema exactly
 * (`@xoroh/kern-contracts` `InstallReceipt`): releaseSet, mode, per-file
 * baseline/current hashes with owners and customized flags, assets, licenses
 * and config. V1 receipts CONVERT on read (same bytes, richer shape) — an old
 * dest is not stranded, and a corrupt one fails naming the file.
 */

import { defineReceipt, type InstallReceipt } from "@xoroh/kern-contracts";

export type { InstallReceipt };

type V1Receipt = {
  kern?: string;
  mode?: string;
  components?: Record<string, { files: Record<string, string> }>;
  blocks?: Record<string, { files: Record<string, string> }>;
};

function fail(what: string): never {
  throw new Error(`receipt: ${what}`);
}

/** Read any receipt (v1 converts, v2 validates, garbage fails). */
export function readReceipt(raw: unknown): InstallReceipt {
  if (typeof raw !== "object" || raw === null) fail("not an object");
  const doc = raw as Record<string, unknown>;
  // A schemaVersion that is present but unrecognized is a version error, not
  // a v1 document: falling through to the v1 converter would report "no
  // files" about a document that is simply newer than this CLI.
  if (doc.schemaVersion !== undefined && doc.schemaVersion !== "2") {
    fail(`schemaVersion is ${String(doc.schemaVersion)}`);
  }
  if (doc.schemaVersion === "2") return defineReceipt(doc as InstallReceipt);
  return convertV1(doc as V1Receipt);
}

/** V1 → v2: every v1 file becomes a v2 row owned by its component. */
export function convertV1(prev: V1Receipt): InstallReceipt {
  const files: InstallReceipt["files"] = [];
  const groups: Array<
    [string, Record<string, { files: Record<string, string> }> | undefined]
  > = [
    ["components", prev.components],
    ["blocks", prev.blocks],
  ];
  for (const [group, entries] of groups) {
    for (const [name, entry] of Object.entries(entries ?? {})) {
      // Singular owners — the same `component:<name>` / `block:<name>` the
      // installer writes today. A plural owner would fork the receipt history
      // into two namespaces for one thing.
      const owner = `${group === "components" ? "component" : "block"}:${name}`;
      for (const [path, hash] of Object.entries(entry.files ?? {})) {
        files.push({
          path,
          baselineHash: hash,
          currentHash: hash,
          owner,
          customized: false,
        });
      }
    }
  }
  if (files.length === 0) {
    // A scaffold receipt legitimately owns no files yet — emptiness is a
    // state, not corruption. What would be corrupt is a receipt with neither
    // files nor a version to pin.
    if (prev.kern === undefined) fail("v1 receipt has no files and no version");
  }
  return defineReceipt({
    schemaVersion: "2",
    releaseSet: `kern@${prev.kern ?? "0.0.0"}+unknown`,
    mode: prev.mode === "self-contained" ? "source-snapshot" : "source-hybrid",
    files,
    assets: [],
    licenses: [],
    config: { kern: prev.kern ?? "0.0.0" },
  });
}

/** A dest file is customized when it no longer matches its baseline. */
export function customized(row: InstallReceipt["files"][number]): boolean {
  return row.baselineHash !== row.currentHash || row.customized;
}
