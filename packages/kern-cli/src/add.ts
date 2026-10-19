/**
 * `kern add` — Mode 1: vendored, you own the code. Two phases, one promise:
 * a late failure leaves the destination byte-identical.
 *
 * Phase 1 (plan, no writes): resolve the name against the registry, walk the
 * full relative closure (see closure.ts), read every byte, and check every
 * conflict. Phase 2 (commit): write files, then the receipt. NOTHING is
 * written before every conflict is known — the old code wrote component files
 * first and failed on the receipt or a later conflict, leaving a half-vendored
 * dest that reported an error but kept the files. A fault-injection test
 * (`add.test.ts`) pins this: a conflict planted late in the closure order
 * must leave zero new files behind.
 *
 * Platforms: web (default) and native (`--platform native` or kern.json).
 * The manifest row for the requested platform is selected BEFORE lookup, so a
 * shared name can never copy web source for a native install (the defect the
 * MCP server had in tools.ts). Native installs record platform requirements;
 * Metro/font setup rides in the printed instructions.
 *
 * Blocks vendor their declared files PLUS the closure of every
 * `registryDependencies` export — the old code printed the package dependency
 * and left the component graph behind, so a block installed "successfully"
 * into a tree missing its components.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { blockFileBytes, blockFileList, loadBlocks } from "./blocks.js";
import { resolveClosure } from "./closure.js";
import {
  loadRegistry,
  payloadDir,
  resolveSystem,
  WORKSPACE_ROOT,
} from "./manifest.js";
import { type InstallReceipt, readReceipt } from "./receipt.js";

export type AddPlatform = "web" | "native";

export type AddOptions = {
  /** Workspace root (tests point this at a fixture; default: real workspace). */
  root?: string;
  /** Where vendored code lands. Default: `<cwd>/components/kern`. */
  dest?: string;
  /** Also vendor the full token CSS set. Default: false (hybrid). */
  selfContained?: boolean;
  /** Working directory for default dest. Default: process.cwd(). */
  cwd?: string;
  /** Renderer to install. Default: web (or kern.json). */
  platform?: AddPlatform;
  /** Design system to install from (decision 009). Default: the only current system. */
  system?: string;
  /** Install mode recorded in the receipt. Default from flags/kern.json. */
  mode?: "source-hybrid" | "source-snapshot";
};

export type AddResult = {
  component: string;
  platform: AddPlatform;
  files: string[];
  npm: string[];
  receipt: string;
  instructions: string[];
};

export type PlannedFile = {
  /** Package-relative source path (for the receipt owner trail). */
  src: string;
  /** Destination-relative output path. */
  out: string;
  bytes: string;
};

function sha256(bytes: string): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

function fail(msg: string): never {
  throw new Error(`kern add: ${msg}`);
}

/** kern.json defaults a project records once (`kern init` writes it). */
export function readProjectConfig(cwd: string): {
  platform?: AddPlatform;
  mode?: "source-hybrid" | "source-snapshot";
  preset?: string;
  pm?: "bun" | "npm" | "pnpm" | "yarn";
} {
  const file = join(cwd, "kern.json");
  if (!existsSync(file)) return {};
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as Record<
      string,
      unknown
    >;
    const out: {
      platform?: AddPlatform;
      mode?: "source-hybrid" | "source-snapshot";
      preset?: string;
      pm?: "bun" | "npm" | "pnpm" | "yarn";
    } = {};
    // N6 contract: the writer records `renderer` (web|native); the reader
    // maps it onto the add platform default. Registry rows and the
    // `--platform` flag keep `platform` until the P3 rename — that migration
    // renames producers and consumers together, never one side alone.
    if (raw.renderer === "web" || raw.renderer === "native")
      out.platform = raw.renderer;
    if (raw.mode === "source-hybrid" || raw.mode === "source-snapshot")
      out.mode = raw.mode;
    // N6 preset pin: recorded at scaffold, read back so later commands
    // resolve against the user's preset, never a substituted default.
    if (
      typeof raw.preset === "string" &&
      /^[a-z][a-z0-9-]{1,31}$/.test(raw.preset)
    ) {
      out.preset = raw.preset;
    }
    if (
      raw.pm === "bun" ||
      raw.pm === "npm" ||
      raw.pm === "pnpm" ||
      raw.pm === "yarn"
    ) {
      out.pm = raw.pm;
    }
    return out;
  } catch {
    return {};
  }
}

function pkgDirFor(root: string, platform: AddPlatform): string {
  return join(
    root,
    platform === "native" ? "packages/kern-native" : "packages/kern",
  );
}

/**
 * Where component sources come from (KERN-034/041).
 *
 * Checkout: the workspace tree (or KERN_WORKSPACE). Packed install: the
 * versioned tarball — `KERN_TARBALL` points at a local .tgz (tests pack the
 * workspace; post-publish it names the registry tarball). A packed CLI that
 * vendored from nowhere would install nothing; one that silently fell back to
 * stale bytes would install the wrong thing. Both fail here, naming the
 * missing piece.
 */
function resolveSourceTree(
  root: string,
  platform: AddPlatform,
): { dir: string; cleanup: () => void } {
  const checkout = pkgDirFor(root, platform);
  if (existsSync(join(checkout, "package.json"))) {
    return { dir: checkout, cleanup: () => {} };
  }
  // Packed install: vendor from the versioned tarball. KERN_TARBALL points at
  // a local .tgz (tests pack the workspace; post-publish this is the registry
  // tarball at the pinned version). Extraction goes to a temp dir that
  // cleanup removes — extracted sources never linger in the consumer tree.
  const tarball = process.env.KERN_TARBALL;
  if (!tarball || !existsSync(tarball)) {
    fail(
      `no ${platform} sources at ${checkout} — packed installs vendor from the published tarball. ` +
        `Set KERN_TARBALL to a local .tgz (e.g. from \`bun pm pack\`) or run with KERN_WORKSPACE pointed at a checkout.`,
    );
  }
  const tmp = mkdtempSync(join(tmpdir(), "kern-tarball-"));
  try {
    // Trust boundary (AUD-026, deliberate Preview posture): the tarball is
    // either packed from the local workspace or the pinned-version registry
    // tarball — both trusted sources — so plain extraction is sufficient.
    // If remote/untrusted registries ever arrive, add `--no-same-owner`, a
    // symlink audit, and a `relative(dest,out)` output guard here.
    execFileSync("tar", ["-xzf", tarball, "-C", tmp]);
  } catch {
    rmSync(tmp, { recursive: true, force: true });
    fail(`cannot extract ${tarball} — need a working \`tar\`.`);
  }
  const dir = join(tmp, "package");
  if (!existsSync(join(dir, "package.json"))) {
    rmSync(tmp, { recursive: true, force: true });
    fail(`${tarball} extracted with no package/ root — not an npm tarball.`);
  }
  return { dir, cleanup: () => rmSync(tmp, { recursive: true, force: true }) };
}

/**
 * Plan the install: resolve, read, conflict-check. NO WRITES. Returns the
 * complete file list or throws naming the first problem — the destination is
 * byte-identical either way.
 */
export function planComponent(
  name: string,
  opts: AddOptions = {},
): {
  platform: AddPlatform;
  files: PlannedFile[];
  npm: string[];
  version: string;
  releaseSet: string;
} {
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  const cwd = opts.cwd ?? process.cwd();
  const project = readProjectConfig(cwd);
  const platform = opts.platform ?? project.platform ?? "web";
  const selfContained =
    opts.selfContained ?? project.mode === "source-snapshot";

  const registry = loadRegistry(root);
  // Decision 009: the system gates row selection before the platform does.
  // Unknown systems fail here naming what the registry carries — resolving
  // against the wrong system would vendor nothing while reporting success.
  const system = resolveSystem(registry.rows, opts.system);
  const candidates = registry.rows.filter(
    (r) => r.name === name && r.system === system,
  );
  if (candidates.length === 0) {
    fail(
      `unknown component "${name}" — names come from the registry, run \`kern list\` or check the docs.`,
    );
  }
  const row = candidates.find(
    (r) => r.platform === platform,
  ) as (typeof candidates)[number];
  if (!row) {
    const have = candidates.map((r) => r.platform).join(", ");
    fail(`"${name}" is not available for ${platform} (registry has: ${have}).`);
  }
  if (row.status !== "real")
    fail(`"${name}" is a stub (not shipped) — nothing to vendor.`);

  const { dir: pkgDir, cleanup } = resolveSourceTree(root, platform);
  try {
    return planFromTree(pkgDir, row, selfContained, root, platform, registry);
  } finally {
    cleanup();
  }
}

function planFromTree(
  pkgDir: string,
  row: { path: string },
  selfContained: boolean,
  root: string,
  platform: AddPlatform,
  registry: { version: string; releaseSet: string },
): {
  platform: AddPlatform;
  files: PlannedFile[];
  npm: string[];
  version: string;
  releaseSet: string;
} {
  const { vendor, npm, mirror } = resolveClosure(pkgDir, row.path);
  const files: PlannedFile[] = [];
  for (const rel of vendor) {
    const bytes = readFileSync(join(pkgDir, rel), "utf8");
    files.push({ src: rel, out: mirror.get(rel) as string, bytes });
  }

  if (selfContained) {
    // Snapshot CSS: workspace tokens in a checkout, bundled snapshot bytes in
    // a packed install (no checkout to read). Same files, same order — the
    // payload is emitted from these exact sources, never hand-kept.
    const tokensDir = join(root, "packages/kern-tokens");
    const snapshotDir = join(payloadDir(), "tokens-snapshot");
    for (const css of SELF_CONTAINED_CSS) {
      const name = css.split("/").pop() as string;
      const fromWorkspace = join(tokensDir, css);
      const fromPayload = join(snapshotDir, name);
      const bytes = readFileSync(
        existsSync(fromWorkspace) ? fromWorkspace : fromPayload,
        "utf8",
      );
      files.push({ src: `kern-tokens/${css}`, out: `tokens/${name}`, bytes });
    }
  }
  return {
    platform,
    files,
    npm,
    version: registry.version,
    releaseSet: registry.releaseSet,
  };
}

const SELF_CONTAINED_CSS = [
  "src/tokens.css",
  "src/comp-tokens.css",
  "src/tones.css",
  "src/tailwind.css",
  "src/motion.css",
];

/**
 * Commit a plan: every conflict is checked BEFORE the first write, then files
 * land and the receipt follows. A throw anywhere before the return leaves the
 * destination exactly as found — verified by fault injection, not by reading
 * this comment.
 */
export function commitPlan(
  name: string,
  kind: "component" | "block",
  plan: {
    files: PlannedFile[];
    npm: string[];
    version: string;
    releaseSet: string;
  },
  opts: AddOptions & { platform?: AddPlatform } = {},
): AddResult {
  const cwd = opts.cwd ?? process.cwd();
  const dest = opts.dest ?? join(cwd, "components", "kern");
  const platform = opts.platform ?? "web";
  const mode =
    opts.mode ?? (opts.selfContained ? "source-snapshot" : "source-hybrid");

  // Preflight: ALL conflicts, zero writes.
  for (const file of plan.files) {
    const outAbs = join(dest, file.out);
    if (existsSync(outAbs)) {
      const incumbent = readFileSync(outAbs, "utf8");
      if (incumbent !== file.bytes) {
        fail(
          `"${file.out}" already exists with different content — owned code is never auto-merged. Delete it or run \`kern upgrade ${name}\`.`,
        );
      }
    }
  }
  const receiptPath = join(dest, "kern.receipt.json");
  let prev: InstallReceipt | null = null;
  if (existsSync(receiptPath)) {
    prev = readReceipt(JSON.parse(readFileSync(receiptPath, "utf8")));
    const owned = prev.files.some((f) => f.owner === `${kind}:${name}`);
    if (owned) {
      // Idempotent re-add: every planned file already identical in the dest.
      // Anything else is an upgrade, not an add — owned edits must never be
      // "re-added" over.
      const identical = plan.files.every((file) => {
        const outAbs = join(dest, file.out);
        return (
          existsSync(outAbs) && readFileSync(outAbs, "utf8") === file.bytes
        );
      });
      if (identical) {
        return {
          component: name,
          platform,
          files: [],
          npm: plan.npm,
          receipt: receiptPath,
          instructions: [],
        };
      }
      fail(
        `"${name}" is already vendored here (${prev.config.kern ?? "unknown version"}) — re-adding is an upgrade, run \`kern upgrade ${name}\`.`,
      );
    }
    if ((prev.config.kern as string) !== plan.version) {
      fail(
        `receipt pins kern ${prev.config.kern} but the workspace is ${plan.version} — mixed-version dests are refused.`,
      );
    }
  }

  // Commit: files, then receipt. Receipt write is last so a crash mid-commit
  // leaves files without a claim rather than a claim without files.
  const written: string[] = [];
  for (const file of plan.files) {
    const outAbs = join(dest, file.out);
    if (existsSync(outAbs)) continue; // identical content: idempotent re-add
    mkdirSync(dirname(outAbs), { recursive: true });
    writeFileSync(outAbs, file.bytes);
    written.push(file.out);
  }
  const rows = plan.files.map((file) => {
    const hash = sha256(file.bytes);
    return {
      path: file.out,
      baselineHash: hash,
      currentHash: hash,
      owner: `${kind}:${name}`,
      customized: false,
    };
  });
  const receipt: InstallReceipt = {
    schemaVersion: "2",
    releaseSet: plan.releaseSet,
    mode,
    files: [...(prev?.files ?? []), ...rows],
    assets: [...(prev?.assets ?? [])],
    licenses: [...(prev?.licenses ?? []), ...plan.npm.map((n) => `npm:${n}`)],
    config: { ...(prev?.config ?? {}), kern: plan.version, platform },
  };
  // Dedupe licenses: the same npm peer across two adds is one license line.
  receipt.licenses = [...new Set(receipt.licenses)];
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

  const instructions =
    platform === "native"
      ? [
          `bun add ${plan.npm.join(" ")}`,
          "Metro: the vendored files resolve through your Expo/Metro config; add `react-native-svg` to the host app if icons render.",
          mode === "source-hybrid"
            ? `bun add @xoroh/kern-tokens  # values stayed depended (hybrid default)`
            : `values frozen at ${plan.releaseSet} (snapshot)`,
        ]
      : [
          `bun add ${plan.npm.join(" ")}`,
          opts.selfContained
            ? `import "./tokens/tokens.css" (vendored snapshot — values frozen at ${plan.releaseSet})`
            : `bun add @xoroh/kern-tokens  # values stayed depended (hybrid default)`,
          ...(opts.selfContained
            ? []
            : [
                `import "@xoroh/kern-tokens/theme" in your CSS entry  # token values + Tailwind v4 required`,
              ]),
        ];

  return {
    component: name,
    platform,
    files: written,
    npm: plan.npm,
    receipt: receiptPath,
    instructions,
  };
}

export function addComponent(name: string, opts: AddOptions = {}): AddResult {
  const plan = planComponent(name, opts);
  return commitPlan(name, "component", plan, {
    ...opts,
    platform: plan.platform,
  });
}

/**
 * `kern add <block>` — declared block files PLUS the closure of every
 * `registryDependencies` export, planned and committed in the same two
 * phases. Component closures resolve against the web manifest rows; a block
 * dependency with no row fails naming it rather than installing half a block.
 */
export function planBlock(
  name: string,
  opts: AddOptions = {},
): {
  platform: AddPlatform;
  files: PlannedFile[];
  npm: string[];
  version: string;
  releaseSet: string;
} {
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  const cwd = opts.cwd ?? process.cwd();
  const project = readProjectConfig(cwd);
  const platform = opts.platform ?? project.platform ?? "web";
  if (platform !== "web") {
    fail(
      `blocks are web-only in this release — "${name}" has no native block manifest.`,
    );
  }

  const rows = loadBlocks(root);
  const row = rows.find((r) => r.name === name);
  if (!row) {
    fail(
      `unknown block "${name}" — block names come from apps/site/src/blocks/manifest.ts.`,
    );
  }
  const list = blockFileList(row, root);
  if (!list) {
    fail(
      `block "${name}": a declared file is missing on disk — run \`bun --cwd apps/site scripts/check-blocks.mjs\`.`,
    );
  }

  const registry = loadRegistry(root);
  // Decision 009: the system flag validates even for blocks (blocks are
  // web-only M3 compositions with no system of their own) — installing M3
  // bytes under a foreign system name must fail, not silently succeed.
  const system = resolveSystem(registry.rows, opts.system);
  const files: PlannedFile[] = [];
  for (const rel of list) {
    files.push({
      src: `blocks/${rel}`,
      out: join("blocks", rel),
      bytes: blockFileBytes(row, rel, root),
    });
  }
  // The component closure the old code left behind: every registryDependency
  // export resolves to its manifest row, whose closure vendors alongside.
  const pkgDir = pkgDirFor(root, "web");
  const seen = new Set<string>();
  for (const exportName of row.registryDependencies) {
    const dep = registry.rows.find(
      (r) =>
        r.export === exportName && r.platform === "web" && r.system === system,
    );
    if (!dep) {
      fail(
        `block "${name}" needs "${exportName}" but the registry has no web row for it — refusing a half-block.`,
      );
    }
    const { vendor, mirror } = resolveClosure(pkgDir, dep.path);
    for (const rel of vendor) {
      if (seen.has(rel)) continue;
      seen.add(rel);
      files.push({
        src: rel,
        out: mirror.get(rel) as string,
        bytes: readFileSync(join(pkgDir, rel), "utf8"),
      });
    }
  }

  const npm = row.dependencies.filter((d) => d !== "react");
  return {
    platform,
    files,
    npm,
    version: registry.version,
    releaseSet: registry.releaseSet,
  };
}

export function addBlock(name: string, opts: AddOptions = {}): AddResult {
  const plan = planBlock(name, opts);
  return commitPlan(name, "block", plan, {
    ...opts,
    platform: plan.platform,
  });
}
