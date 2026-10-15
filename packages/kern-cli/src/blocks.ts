/**
 * Block manifest seam for `kern add <block>`.
 *
 * A BLOCK is a composed section living in `apps/site/src/blocks/` with a
 * manifest row (name, category, files, registryDependencies, npm
 * dependencies). Unlike a component row (one file + relative closure), a
 * block is a SMALL LIST of self-contained files: the root plus declared
 * siblings, each free of relative imports (enforced by `check-blocks`), so
 * the vendor step copies the declared files and nothing else — there is no
 * closure to walk. npm peers come from the manifest's `dependencies`,
 * not from import scanning: the manifest is the contract a consumer reads,
 * and `check-blocks` proves source and manifest agree.
 *
 * Same placement rule as `manifest.ts` (v1 reads the workspace; publish time
 * swaps to a bundled copy with no shape change).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WORKSPACE_ROOT } from "./manifest.js";

const HERE = dirname(fileURLToPath(import.meta.url));

export type BlockCategory = "Auth" | "Settings" | "Dashboard" | "Sidebar";

export type BlockRow = {
  name: string;
  title: string;
  category: BlockCategory;
  description: string;
  /** Root source file, relative to `apps/site/src/blocks/`. */
  file: string;
  /** Sibling files installed alongside the root. */
  files: string[];
  /** Kern barrel exports the block renders (informational + gate-checked). */
  registryDependencies: string[];
  /** npm packages the block imports. */
  dependencies: string[];
  /** Bundled file bytes (packed installs only; workspace reads disk). */
  contents?: Record<string, string>;
};

/** Where block sources live inside the workspace (v1 layout). */
export function blocksDir(root: string = WORKSPACE_ROOT): string {
  return join(root, "apps", "site", "src", "blocks");
}

/**
 * Parse `apps/site/src/blocks/manifest.ts` into rows.
 *
 * Text parsing, like `loadRegistry`: the manifest is a typed TS source of
 * truth both the site and the CLI read, and a shared runtime import would
 * couple the CLI to the site's bundler. The row type above is the contract.
 */
export function loadBlocks(root: string = WORKSPACE_ROOT): BlockRow[] {
  // Packed install: no checkout, read the payload emitted at build time.
  const bundled = join(HERE, "blocks.json");
  const manifestTs = join(blocksDir(root), "manifest.ts");
  if (!existsSync(manifestTs)) {
    if (!existsSync(bundled)) {
      throw new Error(
        "no workspace blocks and no bundled blocks.json — reinstall @xoroh/kern-cli.",
      );
    }
    const rows = JSON.parse(readFileSync(bundled, "utf8")) as BlockRow[];
    if (rows.length === 0) throw new Error("bundled blocks.json is empty.");
    return rows;
  }
  const src = readFileSync(manifestTs, "utf8");
  const chunks = src.split(/^\s*\{/m).slice(1);
  const rows: BlockRow[] = [];
  for (const chunk of chunks) {
    const name = chunk.match(/name:\s*"([^"]+)"/)?.[1];
    const file = chunk.match(/file:\s*"([^"]+)"/)?.[1];
    if (!name || !file) continue;
    const strList = (key: string): string[] => {
      const body =
        chunk.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`, "s"))?.[1] ?? "";
      return [...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    };
    rows.push({
      name,
      title: chunk.match(/title:\s*"([^"]+)"/)?.[1] ?? name,
      category: (chunk.match(/category:\s*"([^"]+)"/)?.[1] ??
        "Settings") as BlockCategory,
      description: chunk.match(/description:\s*"([^"]+)"/)?.[1] ?? "",
      file,
      files: strList("files"),
      registryDependencies: strList("registryDependencies"),
      dependencies: strList("dependencies"),
    });
  }
  if (rows.length === 0) {
    throw new Error(
      "parsed 0 block rows — check `apps/site/src/blocks/manifest.ts` (gate: `bun --cwd apps/site scripts/check-blocks.mjs`).",
    );
  }
  return rows;
}

/** All declared files of a block (root first), or null when any is missing. */
export function blockFileList(
  row: BlockRow,
  root: string = WORKSPACE_ROOT,
): string[] | null {
  const dir = blocksDir(root);
  const all = [row.file, ...row.files];
  // Packed payload carries bytes; the workspace carries files on disk. Both
  // are checked — a declared file with neither is a half-block refused aloud.
  for (const f of all) {
    if (existsSync(join(dir, f))) continue;
    if (row.contents?.[f] !== undefined) continue;
    return null;
  }
  return all;
}

/** Read one block file: disk in a checkout, payload in a packed install. */
export function blockFileBytes(
  row: BlockRow,
  rel: string,
  root: string = WORKSPACE_ROOT,
): string {
  const disk = join(blocksDir(root), rel);
  if (existsSync(disk)) return readFileSync(disk, "utf8");
  const bytes = row.contents?.[rel];
  if (bytes === undefined) {
    throw new Error(`block "${row.name}": no bytes for "${rel}" anywhere.`);
  }
  return bytes;
}
