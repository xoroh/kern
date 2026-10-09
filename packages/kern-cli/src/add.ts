/**
 * `kern add <component>` — Mode 1: vendored, you own the code.
 *
 * WHAT IT DOES
 *
 * Resolves the name against the registry, copies the component file PLUS its
 * relative closure (see closure.ts) into `<dest>` mirroring package paths
 * minus `src/` (`src/components/button.tsx` → `<dest>/components/button.tsx`,
 * `src/utils/cn.ts` → `<dest>/utils/cn.ts`), so relative imports work
 * byte-identical with zero rewriting. Writes `<dest>/kern.receipt.json`
 * (kern version + per-file sha256 — the input `kern diff`/`kern upgrade`
 * need, and the reason receipts exist from day one). Prints the commands the
 * consumer runs themselves: `bun add` for npm closure peers, the tokens
 * setup, and the CSS import.
 *
 * TOKENS (hybrid default, --self-contained flag)
 *
 * Default: code vendored, values depended — instructions print
 * `bun add @xoroh/kern-tokens` plus the CSS import. One source of truth for
 * values, structure is theirs. `--self-contained` additionally vendors the
 * full CSS set (tokens, comp-tokens, tones, tailwind, motion — over-included
 * on purpose; trimming is the consumer's documented choice) and records the
 * token version in the receipt so `kern diff` can flag value drift, not just
 * structural drift.
 *
 * REFUSALS (exit non-zero, each naming the reason)
 *
 * Unknown name · stub status (not shipped — nothing to vendor) · native
 * platform (Mode 1 is web-only until the Metro asset story is scoped) ·
 * conflicting file already at the destination (same content = skip silently;
 * different content = fail naming both components, never auto-merge — that is
 * `kern upgrade`'s job in step 3, and auto-merging into owned code is how you
 * ship someone else's breaking change as your commit).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { blockFileList, blocksDir, loadBlocks } from "./blocks.js";
import { resolveClosure } from "./closure.js";
import { kernVersion, loadManifest, WORKSPACE_ROOT } from "./manifest.js";

export type AddOptions = {
  /** Workspace root (tests point this at a fixture; default: real workspace). */
  root?: string;
  /** Where vendored code lands. Default: `<cwd>/components/kern`. */
  dest?: string;
  /** Also vendor the full token CSS set. Default: false (hybrid). */
  selfContained?: boolean;
  /** Working directory for default dest. Default: process.cwd(). */
  cwd?: string;
};

export type AddResult = {
  component: string;
  files: string[];
  npm: string[];
  receipt: string;
  instructions: string[];
};

/**
 * `kern add <block>` — the multi-file sibling of `addComponent`.
 *
 * A block is a composed section (see `blocks.ts`): a declared list of files
 * copied verbatim under `<dest>/blocks/`, npm peers from the manifest's
 * `dependencies`, and the same receipt contract (`blocks:` entry beside the
 * `components:` map, so `kern diff`/`upgrade` can read both without a shape
 * change). There is no closure walk: the manifest declares the file list and
 * `check-blocks` proves every relative import stays inside it.
 */
export function addBlock(name: string, opts: AddOptions = {}): AddResult {
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  const cwd = opts.cwd ?? process.cwd();
  const dest = opts.dest ?? join(cwd, "components", "kern");

  const rows = loadBlocks(root);
  const row = rows.find((r) => r.name === name);
  if (!row)
    fail(
      `unknown block "${name}" — block names come from apps/site/src/blocks/manifest.ts.`,
    );

  const list = blockFileList(row, root);
  if (!list)
    fail(
      `block "${name}": a declared file is missing on disk — run \`bun --cwd apps/site scripts/check-blocks.mjs\`.`,
    );

  const version = kernVersion(root);
  const written: string[] = [];
  const receiptFiles: Record<string, string> = {};
  for (const rel of list) {
    const bytes = readFileSync(join(blocksDir(root), rel), "utf8");
    const outRel = join("blocks", rel);
    const outAbs = join(dest, outRel);
    if (existsSync(outAbs)) {
      const incumbent = readFileSync(outAbs, "utf8");
      if (incumbent === bytes) continue;
      fail(
        `"${outRel}" already exists with different content — owned code is never auto-merged. Delete it or wait for \`kern upgrade\` (step 3).`,
      );
    }
    mkdirSync(dirname(outAbs), { recursive: true });
    writeFileSync(outAbs, bytes);
    written.push(outRel);
    receiptFiles[outRel] = sha256(bytes);
  }

  const receiptPath = join(dest, "kern.receipt.json");
  const receipt = {
    kern: version,
    mode: "block",
    components: {},
    blocks: {
      [name]: { files: receiptFiles },
    },
  };
  if (existsSync(receiptPath)) {
    const prev = JSON.parse(readFileSync(receiptPath, "utf8")) as {
      kern: string;
      components: Record<string, { files: Record<string, string> }>;
      blocks?: Record<string, { files: Record<string, string> }>;
    };
    if (prev.blocks?.[name]) {
      fail(
        `"${name}" is already vendored here (kern ${prev.kern}) — re-adding is an upgrade, wait for \`kern upgrade\` (step 3).`,
      );
    }
    receipt.components = prev.components ?? {};
    receipt.blocks = { ...(prev.blocks ?? {}), ...receipt.blocks };
    if (prev.kern !== version) {
      fail(
        `receipt pins kern ${prev.kern} but the workspace is ${version} — mixed-version dests are refused.`,
      );
    }
  }
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

  const npm = row.dependencies.filter((d) => d !== "react");
  const instructions = [
    npm.length > 0
      ? `bun add ${npm.join(" ")}`
      : "bun add @xoroh/kern  # block renders kern exports only",
    opts.selfContained
      ? `import "./tokens/tokens.css" (vendored snapshot — values frozen at kern ${version})`
      : `bun add @xoroh/kern-tokens  # values stayed depended (hybrid default)`,
  ];
  if (!opts.selfContained) {
    instructions.push(
      `import "@xoroh/kern-tokens/theme" in your CSS entry  # token values + Tailwind v4 required`,
    );
  }

  return {
    component: name,
    files: written,
    npm,
    receipt: receiptPath,
    instructions,
  };
}

const SELF_CONTAINED_CSS = [
  "src/tokens.css",
  "src/comp-tokens.css",
  "src/tones.css",
  "src/tailwind.css",
  "src/motion.css",
];

function sha256(bytes: string): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

function fail(msg: string): never {
  throw new Error(`kern add: ${msg}`);
}

export function addComponent(name: string, opts: AddOptions = {}): AddResult {
  // Manifest lives in the workspace in v1 (see manifest.ts seam): default to
  // the workspace root, not the consumer cwd. KERN_WORKSPACE overrides.
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  const cwd = opts.cwd ?? process.cwd();
  const dest = opts.dest ?? join(cwd, "components", "kern");

  const rows = loadManifest(root);
  const row = rows.find((r) => r.name === name);
  if (!row)
    fail(
      `unknown component "${name}" — names come from the registry, run \`kern list\` (step 3) or check the docs.`,
    );
  const entry = row as (typeof rows)[number];
  if (entry.status !== "real")
    fail(`"${name}" is a stub (not shipped) — nothing to vendor.`);
  if (entry.platform !== "web")
    fail(
      `"${name}" is native-only — Mode 1 is web-only until the Metro asset story is scoped.`,
    );

  const pkgDir = join(root, "packages/kern");
  const { vendor, npm, mirror } = resolveClosure(pkgDir, entry.path);
  const version = kernVersion(root);

  const written: string[] = [];
  const receiptFiles: Record<string, string> = {};
  for (const rel of vendor) {
    const bytes = readFileSync(join(pkgDir, rel), "utf8");
    const outRel = mirror.get(rel) as string;
    const outAbs = join(dest, outRel);
    if (existsSync(outAbs)) {
      const incumbent = readFileSync(outAbs, "utf8");
      if (incumbent === bytes) continue; // same content: idempotent re-add
      fail(
        `"${outRel}" already exists with different content — owned code is never auto-merged. Delete it or wait for \`kern upgrade\` (step 3).`,
      );
    }
    mkdirSync(dirname(outAbs), { recursive: true });
    writeFileSync(outAbs, bytes);
    written.push(outRel);
    receiptFiles[outRel] = sha256(bytes);
  }

  if (opts.selfContained) {
    const tokensDir = join(root, "packages/kern-tokens");
    for (const css of SELF_CONTAINED_CSS) {
      const bytes = readFileSync(join(tokensDir, css), "utf8");
      const outRel = `tokens/${css.split("/").pop()}`;
      const outAbs = join(dest, outRel);
      mkdirSync(dirname(outAbs), { recursive: true });
      writeFileSync(outAbs, bytes);
      written.push(outRel);
      receiptFiles[outRel] = sha256(bytes);
    }
  }

  const receiptPath = join(dest, "kern.receipt.json");
  const receipt = {
    kern: version,
    mode: opts.selfContained ? "self-contained" : "hybrid",
    components: {
      [name]: { files: receiptFiles },
    },
  };
  // Merge with an existing receipt (second component, same dest): keep other
  // components' entries, refuse to overwrite this one's without upgrade.
  if (existsSync(receiptPath)) {
    const prev = JSON.parse(
      readFileSync(receiptPath, "utf8"),
    ) as typeof receipt & {
      blocks?: Record<string, { files: Record<string, string> }>;
    };
    if (prev.components[name]) {
      fail(
        `"${name}" is already vendored here (kern ${prev.kern}) — re-adding is an upgrade, wait for \`kern upgrade\` (step 3).`,
      );
    }
    receipt.components = { ...prev.components, ...receipt.components };
    // A prior `kern add <block>` may have recorded block entries — keep them,
    // or a component add would silently erase the block history.
    if (prev.blocks) {
      (receipt as { blocks?: typeof prev.blocks }).blocks = prev.blocks;
    }
    if (prev.kern !== version) {
      fail(
        `receipt pins kern ${prev.kern} but the workspace is ${version} — mixed-version dests are refused.`,
      );
    }
  }
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

  const instructions = [
    `bun add ${npm.join(" ")}`,
    opts.selfContained
      ? `import "./tokens/tokens.css" (vendored snapshot — values frozen at kern ${version})`
      : `bun add @xoroh/kern-tokens  # values stayed depended (hybrid default)`,
  ];
  if (!opts.selfContained) {
    instructions.push(
      `import "@xoroh/kern-tokens/theme" in your CSS entry  # token values + Tailwind v4 required`,
    );
  }

  return {
    component: name,
    files: written,
    npm,
    receipt: receiptPath,
    instructions,
  };
}
