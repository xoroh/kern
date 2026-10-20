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
  /** Design system this row belongs to (decision 009 — "kern-m3" today). */
  system: string;
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

/**
 * Decision 009: the only current design system. CLI `add`/`list` and the MCP
 * tools default to it; the registry (generated, single source) carries the
 * system on every row, and `resolveSystem` below refuses anything it does
 * not carry. A second system lands as registry rows first — this default
 * does not move until the product says M3 is no longer first.
 */
export const DEFAULT_SYSTEM = "kern-m3";

/** Systems the registry actually carries, in first-seen order. */
export function knownSystems(rows: Pick<ManifestRow, "system">[]): string[] {
  return [...new Set(rows.map((r) => r.system))];
}

/**
 * Resolve the requested system against what the registry carries. Returns
 * the default when nothing was requested; throws naming the known systems
 * otherwise — an install from a system the registry never heard of would
 * vendor nothing while reporting success.
 */
export function resolveSystem(
  rows: Pick<ManifestRow, "system">[],
  requested?: string,
): string {
  const known = knownSystems(rows);
  const system = requested ?? DEFAULT_SYSTEM;
  if (!known.includes(system)) {
    throw new Error(
      `unknown system "${system}" — registry knows: ${known.join(", ")}.`,
    );
  }
  return system;
}

const ROW_RE =
  /\{\s*name:\s*"([^"]+)",\s*export:\s*"([^"]+)",\s*platform:\s*"(web|native)",\s*system:\s*"([^"]+)",\s*entrypoint:\s*"([^"]+)",\s*path:\s*"([^"]+)",\s*status:\s*"(real|stub)",\s*\}/gs;

function parseManifestSource(src: string): ManifestRow[] {
  return [...src.matchAll(ROW_RE)].map(
    ([, name, exportName, platform, system, entrypoint, path, status]) => ({
      name,
      export: exportName,
      platform: platform as "web" | "native",
      system,
      entrypoint,
      path,
      status: status as "real" | "stub",
    }),
  );
}

function releaseSetFor(version: string, rows: ManifestRow[]): string {
  const hash = createHash("sha256")
    .update(
      rows
        .map((r) => `${r.system}/${r.platform}/${r.name}=${r.export}`)
        .join("\n"),
    )
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
  if (payload.rows.some((r) => typeof r.system !== "string" || !r.system)) {
    throw new Error(
      "bundled registry.json predates the system column (decision 009) — run `bun run generate:components` and repack.",
    );
  }
  return payload;
}

/**
 * The @xoroh/axis RANGE the library depends on.
 *
 * Axis is published, so a scaffolded app pins the same range the library
 * uses rather than a vendored copy of it. Read from the library's own
 * manifest so the two can never drift: a scaffold that pinned a different
 * Axis than the library would resolve a different Axis than the code it
 * was written against.
 */
export function axisVersion(root?: string): string {
  const forced = process.env.KERN_WORKSPACE as string | undefined;
  const workspace = root ?? forced ?? WORKSPACE_ROOT;
  const manifest = join(workspace, "packages/kern/package.json");
  if (existsSync(manifest)) {
    const pkg = JSON.parse(readFileSync(manifest, "utf8")) as {
      dependencies?: Record<string, string>;
    };
    const spec = pkg.dependencies?.["@xoroh/axis"];
    if (spec) return spec;
  }
  throw new Error(
    "cannot determine the @xoroh/axis range — no checkout to read it from.",
  );
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
