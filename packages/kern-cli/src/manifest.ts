/**
 * Manifest loading seam for `kern add`.
 *
 * V1 reads the workspace manifest (`packages/mcp/src/manifest.ts`) with the
 * same documented row shape check-parity uses. That ties the CLI to a
 * checkout — correct for v1 (private, unreleased, dogfooded from the
 * workspace). At publish time this module swaps to a bundled `manifest.json`
 * emitted by `generate:components` (one new output, no shape change); the
 * row type below is the contract that swap must honor. Nothing else in the
 * CLI touches manifest internals.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type ManifestRow = {
  name: string;
  export: string;
  platform: "web" | "native";
  path: string;
  status: "real" | "stub";
};

const HERE = dirname(fileURLToPath(import.meta.url));
/** Workspace root from `packages/kern-cli/src` — v1 only, see above. */
export const WORKSPACE_ROOT = resolve(HERE, "..", "..", "..");

export function loadManifest(root: string = WORKSPACE_ROOT): ManifestRow[] {
  const src = readFileSync(join(root, "packages/mcp/src/manifest.ts"), "utf8");
  const rows = [
    ...src.matchAll(
      /\{\s*name:\s*"([^"]+)",\s*export:\s*"([^"]+)",\s*platform:\s*"(web|native)",\s*path:\s*"([^"]+)",\s*status:\s*"(real|stub)",\s*\}/gs,
    ),
  ].map(([, name, exportName, platform, path, status]) => ({
    name,
    export: exportName,
    platform: platform as "web" | "native",
    path,
    status: status as "real" | "stub",
  }));
  if (rows.length === 0) {
    throw new Error(
      "parsed 0 manifest rows — run `bun run generate:components` from the workspace root.",
    );
  }
  return rows;
}

/** Kern version stamped into receipts — the thing `kern diff` compares against. */
export function kernVersion(root: string = WORKSPACE_ROOT): string {
  const pkg = JSON.parse(
    readFileSync(join(root, "packages/kern/package.json"), "utf8"),
  );
  return pkg.version;
}
