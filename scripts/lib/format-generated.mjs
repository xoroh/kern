/**
 * One formatter for every generator script that emits `.ts`.
 *
 * WHY THIS EXISTS (F-02)
 * ----------------------
 * Several generators spawned `node_modules/.bin/biome` and, when that spawn
 * failed (partial install, release runner, `npx` absent), wrote their output
 * UNFORMATTED with a warning — exit 0. Every `bun run generate` then left a
 * tracked generated file dirty, which fails `bun run lint` on a checkout
 * where nobody broke anything. A generator that writes bytes the repo's own
 * formatter rejects is a generator that ships its cleanup as someone else's
 * job.
 *
 * THE CONTRACT
 * ------------
 * `formatText` returns formatter-canonical text or THROWS. It never returns
 * unformatted text. Callers write its return value directly, so there is no
 * window in which unformatted bytes reach the file. A throw propagates out of
 * the generator with a nonzero exit — loud, not a warning.
 *
 * RESOLUTION ORDER
 * ----------------
 * 1. The workspace bin: `<root>/node_modules/.bin/biome` (the repo's pinned
 *    biome — the same binary `bun run lint` uses, so generator and gate
 *    agree by construction).
 * 2. `bun x` with the repo's biome spec (exact installed version when the
 *    `@biomejs/biome` package directory is present, else the devDependency
 *    range from the root manifest). Pinning matters: an unpinned `bun x`
 *    fetches latest, whose formatting can differ from the pinned gate and
 *    restart the fight this module ends. The bun binary is `process.execPath`
 *    when the generator runs under bun (the normal case, PATH-independent);
 *    otherwise `bun` from PATH.
 *
 * `which` overrides auto-resolution and exists for tests only.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Repo root, derived from this file's location (`scripts/lib/`). */
export const REPO_ROOT = join(HERE, "..", "..");

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
}

/**
 * The biome spec `bun x` should fetch: the exact installed version when the
 * package directory survives (partial installs can lose `.bin` while keeping
 * the package), else the root manifest's devDependency range, else unpinned.
 */
export function biomeSpecFor(root) {
  const installed = readJson(
    join(root, "node_modules", "@biomejs", "biome", "package.json"),
  );
  if (installed?.version) return `@biomejs/biome@${installed.version}`;
  const manifest = readJson(join(root, "package.json"));
  const range = manifest?.devDependencies?.["@biomejs/biome"];
  if (typeof range === "string" && range.length > 0)
    return `@biomejs/biome@${range}`;
  return "@biomejs/biome";
}

function bunBinary() {
  if (
    typeof process.versions.bun === "string" &&
    typeof process.execPath === "string"
  ) {
    return process.execPath;
  }
  return "bun";
}

function attemptFailed(error) {
  if (error?.code === "ENOENT") return `not found (${error.path})`;
  if (error?.code === "ENOBUFS")
    return "output exceeded the spawn buffer (raised maxBuffer, still hit it?)";
  const stderr =
    error?.stderr?.toString?.() ?? error?.stdout?.toString?.() ?? "";
  const last = stderr.trim().split("\n").filter(Boolean).at(-1);
  return last ?? String(error?.message ?? error);
}

// Generated barrels reach megabytes (props.ts is ~1.7MB); execFileSync's
// 1MB default buffer would ENOBUFS on exactly the largest outputs — the old
// code hit this and fell back to unformatted on the biggest file.
const SPAWN_OPTS = (text) => ({
  input: text,
  encoding: "utf8",
  maxBuffer: 256 * 1024 * 1024,
});

/**
 * Format `text` as `stdinFilePath` (e.g. `manifest.ts`) with the repo's
 * biome. Returns the formatted text; throws on any failure — never returns
 * unformatted text.
 */
export function formatText({
  root = REPO_ROOT,
  text,
  stdinFilePath,
  label = stdinFilePath,
  which = {},
}) {
  const failures = [];
  const workspaceBin =
    which.biome !== undefined
      ? which.biome
      : join(root, "node_modules", ".bin", "biome");
  if (workspaceBin && existsSync(workspaceBin)) {
    try {
      return execFileSync(
        workspaceBin,
        ["format", `--stdin-file-path=${stdinFilePath}`],
        SPAWN_OPTS(text),
      );
    } catch (error) {
      failures.push(`workspace bin (${workspaceBin}): ${attemptFailed(error)}`);
    }
  } else {
    failures.push(
      `workspace bin (${workspaceBin ?? "overridden"}): not present`,
    );
  }

  const bun = which.bun !== undefined ? which.bun : bunBinary();
  if (bun) {
    const spec = biomeSpecFor(root);
    try {
      return execFileSync(
        bun,
        ["x", spec, "format", `--stdin-file-path=${stdinFilePath}`],
        SPAWN_OPTS(text),
      );
    } catch (error) {
      failures.push(`bun x (${spec}): ${attemptFailed(error)}`);
    }
  } else {
    failures.push("bun: not available, so no bunx fallback");
  }

  throw new Error(
    `${label}: refusing to write unformatted output — biome is unreachable:\n` +
      failures.map((f) => `  - ${f}`).join("\n"),
  );
}
