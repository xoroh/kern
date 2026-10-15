/**
 * `kern create <name>` — a new app, not configuration of an existing project.
 *
 * CONTRACT (C1: create vs init)
 *
 * - `create` scaffolds the starter into a directory that must NOT exist yet.
 *   An existing path — empty or not — is refused, naming `kern init` as the
 *   command for existing projects. Creating over owned files is how
 *   someone's afternoon disappears; `init --force` already covers the
 *   deliberate overwrite case, so `create` needs no `--force` escape hatch.
 * - `init` keeps its behavior (existing dirs, `--force` for non-empty).
 *   The distinction lives here, in one refusal, not in callers.
 *
 * Scaffolding itself is `initScaffold` — one seed, one receipt shape
 * (`kern.json` + `kern.receipt.json`), so a created app and an initialized
 * one are indistinguishable downstream and `kern add` works in both.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { initScaffold, type InitOptions, type InitResult } from "./init.js";

export type CreateOptions = Omit<InitOptions, "force">;

function fail(msg: string): never {
  throw new Error(`kern create: ${msg}`);
}

export function createApp(name: string, opts: CreateOptions = {}): InitResult {
  if (!name) fail("missing <name> — usage: kern create <name>.");
  const cwd = opts.cwd ?? process.cwd();
  const dest = resolve(cwd, name);
  if (existsSync(dest)) {
    fail(
      `"${dest}" already exists — create is for new apps only. Configure the existing project with \`kern init\` instead.`,
    );
  }
  return initScaffold(dest, opts);
}
