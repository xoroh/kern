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
import { join } from "node:path";
import { WORKSPACE_ROOT } from "./manifest.js";

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
};

/** Where block sources live inside the workspace (v1 layout). */
export function blocksDir(root: string = WORKSPACE_ROOT): string {
  return join(root, "apps", "site", "src", "blocks");
}

/**
 * Parse `apps/site/src/blocks/manifest.ts` into rows.
 *
 * Text parsing, like `loadManifest`: the manifest is a typed TS source of
 * truth both the site and the CLI read, and a shared runtime import would
 * couple the CLI to the site's bundler. The row type above is the contract.
 */
export function loadBlocks(root: string = WORKSPACE_ROOT): BlockRow[] {
  const src = readFileSync(join(blocksDir(root), "manifest.ts"), "utf8");
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
  for (const f of all) {
    if (!existsSync(join(dir, f))) return null;
  }
  return all;
}
