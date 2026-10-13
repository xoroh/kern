/**
 * Manifest loading seam for `kern add`.
 *
 * TWO sources, one row shape. In a checkout the workspace manifest
 * (`packages/mcp/src/manifest.ts`) is read — it is the live registry every
 * gate checks. In a packed install there IS no checkout, so the bundled
 * `src/registry.json` (emitted by `generate:components` alongside the
 * manifest, same rows plus version and release set) is read instead. The row
 * type below is the contract both sources honor; a packed CLI that silently
 * read a different shape would install a different graph than the docs
 * describe.
 *
 * `KERN_WORKSPACE` forces the workspace source (dogfooding the live tree).
 * Otherwise: workspace file when it exists, bundled payload when it does not.
 * There is no third source and no silent empty registry — zero rows is a
 * throw, not an empty install plan.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type ManifestRow = {
  name: string;
  export: string;
  platform: "web" | "native";
  /** The package subpath that publishes this export: "." or "./start". */
  entrypoint: string;
  path: string;
  status: "real" | "stub";
};

export type Registry = {
  /** Kern package version the rows were generated from. */
  version: string;
  /** Content-pinned compatible set: `kern@<version>+<rows>.<hash16>`. */
  releaseSet: string;
  rows: ManifestRow[];
};

const HERE = dirname(fileURLToPath(import.meta.url));
/** Workspace root from `packages/kern-cli/src` — checkout layout only. */
export const WORKSPACE_ROOT = resolve(HERE, "..", "..", "..");

const ROW_RE =
  /\{\s*name:\s*"([^"]+)",\s*export:\s*"([^"]+)",\s*platform:\s*"(web|native)",\s*entrypoint:\s*"([^"]+)",\s*path:\s*"([^"]+)",\s*status:\s*"(real|stub)",\s*\}/gs;

function parseManifestSource(src: string): ManifestRow[] {
  return [...src.matchAll(ROW_RE)].map(
    ([, name, exportName, platform, entrypoint, path, status]) => ({
      name,
      export: exportName,
      platform: platform as "web" | "native",
      entrypoint,
      path,
      status: status as "real" | "stub",
    }),
  );
}

function releaseSetFor(version: string, rows: ManifestRow[]): string {
  const hash = createHash("sha256")
    .update(rows.map((r) => `${r.platform}/${r.name}=${r.export}`).join("\n"))
    .digest("hex")
    .slice(0, 16);
  return `kern@${version}+${rows.length}.${hash}`;
}

/** Bundled payload path — lives next to source AND dist (see files list). */
function bundledPath(): string {
  return join(HERE, "registry.json");
}

/**
 * Directory holding the files a packed install reads when there is no
 * checkout: registry.json, blocks.json, tokens-snapshot/. Always resolvable
 * from the running module — source layout and dist layout alike — so packed
 * and workspace modes never disagree about where the payload lives.
 */
export function payloadDir(): string {
  return HERE;
}

export function loadRegistry(root?: string): Registry {
  const forced = process.env.KERN_WORKSPACE as string | undefined;
  const workspace = root ?? forced ?? WORKSPACE_ROOT;
  const manifestTs = join(workspace, "packages/mcp/src/manifest.ts");
  if (existsSync(manifestTs)) {
    const rows = parseManifestSource(readFileSync(manifestTs, "utf8"));
    if (rows.length === 0) {
      throw new Error(
        "parsed 0 manifest rows — run `bun run generate:components` from the workspace root.",
      );
    }
    const version = kernVersion(workspace);
    return { version, releaseSet: releaseSetFor(version, rows), rows };
  }
  // Packed install: no checkout, read the payload emitted at build time.
  const bundled = bundledPath();
  if (!existsSync(bundled)) {
    throw new Error(
      "no workspace manifest and no bundled registry.json — reinstall @xoroh/kern-cli.",
    );
  }
  const payload = JSON.parse(readFileSync(bundled, "utf8")) as Registry;
  if (
    !payload.version ||
    !Array.isArray(payload.rows) ||
    payload.rows.length === 0
  ) {
    throw new Error("bundled registry.json is empty or malformed.");
  }
  return payload;
}

/** @deprecated Use loadRegistry().rows — kept for the v1 call sites. */
export function loadManifest(root?: string): ManifestRow[] {
  return loadRegistry(root).rows;
}

/** Kern version stamped into receipts — the thing `kern diff` compares against. */
export function kernVersion(root?: string): string {
  const forced = process.env.KERN_WORKSPACE as string | undefined;
  const workspace = root ?? forced ?? WORKSPACE_ROOT;
  const manifest = join(workspace, "packages/kern/package.json");
  if (existsSync(manifest)) {
    return (JSON.parse(readFileSync(manifest, "utf8")) as { version: string })
      .version;
  }
  const bundled = bundledPath();
  if (existsSync(bundled)) {
    return (JSON.parse(readFileSync(bundled, "utf8")) as Registry).version;
  }
  throw new Error("cannot determine kern version — no checkout, no bundle.");
}
