/**
 * `kern init <dir>` — Mode 2 scaffold: a working first run, not vendored code.
 *
 * WHAT IT DOES
 *
 * Copies `starters/web/` (the app shell, the themed screen with the
 * kern/sharp/brand/demo preset picker, the stylesheet pair) into `<dir>`,
 * resolves the two kern dependencies, and stamps `<dir>/kern.receipt.json`
 * (`{kern, mode: "scaffold", components: {}}` — the same receipt shape
 * `add.ts` merges into, so a later `kern add` in the scaffold keeps the
 * receipt instead of replacing it). Prints the commands the consumer runs
 * themselves: `bun install`, then `bun run dev`.
 *
 * DEPENDENCIES (file: default, --registry flag)
 *
 * Kern is 0.0.0 and unpublished: the registry names do not resolve yet, so
 * the default scaffold points `@xoroh/kern` and `@xoroh/kern-tokens` at the
 * checkout with `file:` dependencies and the README says so. `--registry`
 * emits the versioned names for post-publish use and warns that they 404
 * until the first publish. The flag exists so the template does not need a
 * rewrite the day publishing happens — the honesty moves with it.
 *
 * REFUSALS (exit non-zero, each naming the reason)
 *
 * Non-empty dest without `--force` (scaffolding over owned files is how you
 * lose someone's afternoon) · any receipt pinning a different kern version,
 * with or without `--force` (mixed-version dests are refused — same rule as
 * `add.ts:154-158`, same wording family).
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineCliConfig } from "@xoroh/kern-contracts";
import { kernVersion, loadRegistry, WORKSPACE_ROOT } from "./manifest.js";
import { type InstallReceipt, readReceipt } from "./receipt.js";

export type InitOptions = {
  /** Workspace root (tests point this at a fixture; default: real workspace). */
  root?: string;
  /** Emit registry dep names instead of file: (post-publish; 404s until then). */
  registry?: boolean;
  /** Scaffold over a non-empty dest (same kern version only). */
  force?: boolean;
  /** Working directory the target dir resolves against. Default: process.cwd(). */
  cwd?: string;
  /** Design-system preset pinned into kern.json (N6). Default: the starter default. */
  preset?: string;
  /** Package manager for the scaffold instructions (C2). Default: bun. */
  pm?: "bun" | "npm" | "pnpm" | "yarn";
};

export type InitResult = {
  dir: string;
  files: string[];
  receipt: string;
  instructions: string[];
  registry: boolean;
};

const HERE = dirname(fileURLToPath(import.meta.url));
/** On-disk scaffold templates shipped with the CLI. */
export const STARTERS_WEB_DIR = resolve(HERE, "..", "starters", "web");

function fail(msg: string): never {
  throw new Error(`kern init: ${msg}`);
}

function copyTree(
  src: string,
  dest: string,
  files: string[],
  base: string,
): void {
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const rel = join(base, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(join(dest, rel), { recursive: true });
      copyTree(from, dest, files, rel);
    } else if (entry.isFile()) {
      mkdirSync(dirname(join(dest, rel)), { recursive: true });
      writeFileSync(join(dest, rel), readFileSync(from));
      files.push(rel);
    }
  }
}

export function initScaffold(dir: string, opts: InitOptions = {}): InitResult {
  if (!dir) fail("missing <dir> — usage: kern init <dir>.");
  // Manifest lives in the workspace in v1 (see manifest.ts seam): default to
  // the workspace root, not the consumer cwd. KERN_WORKSPACE overrides.
  const root =
    opts.root ?? (process.env.KERN_WORKSPACE as string) ?? WORKSPACE_ROOT;
  const cwd = opts.cwd ?? process.cwd();
  const dest = resolve(cwd, dir);
  const version = kernVersion(root);

  const receiptPath = join(dest, "kern.receipt.json");
  if (existsSync(receiptPath)) {
    const prev = readReceipt(JSON.parse(readFileSync(receiptPath, "utf8")));
    if ((prev.config.kern as string) !== version) {
      fail(
        `receipt pins kern ${prev.config.kern} but the workspace is ${version} — mixed-version dests are refused. Scaffold from a matching checkout instead.`,
      );
    }
  }
  if (existsSync(dest) && readdirSync(dest).length > 0 && !opts.force) {
    fail(
      `"${dest}" already exists and is not empty — owned files are never scaffolded over blindly. Pass --force to overwrite (same kern version only).`,
    );
  }
  if (!existsSync(STARTERS_WEB_DIR)) {
    fail(
      `starter templates missing at "${STARTERS_WEB_DIR}" — reinstall the CLI.`,
    );
  }

  mkdirSync(dest, { recursive: true });
  const files: string[] = [];
  copyTree(STARTERS_WEB_DIR, dest, files, "");

  // Resolve the two kern deps honestly: file: against the checkout while
  // 0.0.0 is unpublished, versioned names behind --registry for post-publish.
  // The overrides pin the transitive workspace packages (@xoroh/kern itself
  // depends on workspace-pinned siblings) to the same checkout, so `bun
  // install` never reaches the registry for an unpublished name.
  const kernDir = join(root, "packages/kern");
  const tokensDir = join(root, "packages/kern-tokens");
  const material3Dir = join(root, "packages/kern-material-3");
  // @xoroh/axis pre-publish: exactly one vendored tarball (see vendor/axis
  // + the migration roadmap). Globbed, not hardcoded, so re-vendoring a new
  // Axis SHA needs no code change — but two tarballs is an error, never a
  // choice, because scaffolded installs must resolve deterministically.
  const axisTarballs = readdirSync(join(root, "vendor", "axis")).filter((f) =>
    f.endsWith(".tgz"),
  );
  if (axisTarballs.length !== 1) {
    throw new Error(
      `expected exactly one vendored @xoroh/axis tarball in vendor/axis, found ${axisTarballs.length}`,
    );
  }
  const axisTarball = join(root, "vendor", "axis", axisTarballs[0] as string);
  const kernDep = opts.registry ? version : `file:${kernDir}`;
  const tokensDep = opts.registry ? version : `file:${tokensDir}`;
  const overrides = opts.registry
    ? {}
    : {
        "@xoroh/kern": `file:${kernDir}`,
        "@xoroh/kern-tokens": `file:${tokensDir}`,
        "@xoroh/axis": `file:${axisTarball}`,
        // @xoroh/kern depends on its material-3 preset package: without
        // this pin the transitive dep escapes to the registry (C1-S smoke
        // proved it — `bun install` failed outside the monorepo).
        "@xoroh/kern-material-3": `file:${material3Dir}`,
      };
  const pkgPath = join(dest, "package.json");
  writeFileSync(
    pkgPath,
    readFileSync(pkgPath, "utf8")
      .replace("__KERN_DEP__", kernDep)
      .replace("__KERN_TOKENS_DEP__", tokensDep)
      .replace("__KERN_OVERRIDES__", JSON.stringify(overrides, null, 2)),
  );
  const readmePath = join(dest, "README.md");
  writeFileSync(
    readmePath,
    readFileSync(readmePath, "utf8").replaceAll("__KERN_VERSION__", version),
  );

  const prevFiles = existsSync(receiptPath)
    ? readReceipt(JSON.parse(readFileSync(receiptPath, "utf8"))).files
    : [];
  // kern.json: the project records its install choices once, and `kern add`
  // reads them back — target renderer, pinned preset, package manager and
  // mode are project facts, not flags to re-type (and re-typo) on every
  // command. Validated by the contracts package: one shape definition, not
  // a writer/reader pair that can drift.
  const kernJson = {
    ...defineCliConfig({
      target: dest,
      renderer: "web",
      mode: "source-hybrid",
      preset: opts.preset ?? "material-3",
      pm: opts.pm ?? "bun",
    }),
    kern: version,
  };
  writeFileSync(
    join(dest, "kern.json"),
    `${JSON.stringify(kernJson, null, 2)}\n`,
  );
  const receipt: InstallReceipt = {
    schemaVersion: "2",
    releaseSet: loadRegistry(root).releaseSet,
    mode: "source-hybrid",
    files: prevFiles,
    assets: [],
    licenses: [],
    config: { kern: version, scaffold: "web" },
  };
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

  const pm = opts.pm ?? "bun";
  // `bun`/`npm` spell the run subcommand out; `pnpm`/`yarn` run bare.
  // bun keeps its exact historical instructions (`bun run dev`).
  const runCmd = pm === "bun" || pm === "npm" ? `${pm} run` : pm;
  const instructions = [`${pm} install`, `${runCmd} dev`];
  if (opts.registry) {
    instructions.unshift(
      `kern is ${version} and unpublished — these registry names 404 until the first publish. Omit --registry to scaffold with file: deps against your checkout instead.`,
    );
  }

  return {
    dir: dest,
    files: files.sort(),
    receipt: receiptPath,
    instructions,
    registry: opts.registry ?? false,
  };
}
