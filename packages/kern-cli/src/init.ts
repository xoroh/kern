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
import { kernVersion, WORKSPACE_ROOT } from "./manifest.js";

export type InitOptions = {
  /** Workspace root (tests point this at a fixture; default: real workspace). */
  root?: string;
  /** Emit registry dep names instead of file: (post-publish; 404s until then). */
  registry?: boolean;
  /** Scaffold over a non-empty dest (same kern version only). */
  force?: boolean;
  /** Working directory the target dir resolves against. Default: process.cwd(). */
  cwd?: string;
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
    const prev = JSON.parse(readFileSync(receiptPath, "utf8")) as {
      kern: string;
      components?: Record<string, unknown>;
    };
    if (prev.kern !== version) {
      fail(
        `receipt pins kern ${prev.kern} but the workspace is ${version} — mixed-version dests are refused. Scaffold from a matching checkout instead.`,
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
  const primitivesDir = join(root, "packages/kern-primitives");
  const kernDep = opts.registry ? version : `file:${kernDir}`;
  const tokensDep = opts.registry ? version : `file:${tokensDir}`;
  const overrides = opts.registry
    ? {}
    : {
        "@xoroh/kern": `file:${kernDir}`,
        "@xoroh/kern-tokens": `file:${tokensDir}`,
        "@xoroh/kern-primitives": `file:${primitivesDir}`,
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

  const prevComponents = existsSync(receiptPath)
    ? (
        JSON.parse(readFileSync(receiptPath, "utf8")) as {
          components?: Record<string, unknown>;
        }
      ).components
    : undefined;
  const receipt = {
    kern: version,
    mode: "scaffold",
    components: prevComponents ?? {},
  };
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

  const instructions = ["bun install", "bun run dev"];
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
