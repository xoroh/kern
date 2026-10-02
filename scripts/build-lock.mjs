#!/usr/bin/env node
// Serialise builds across concurrent agents.
//
// The problem this solves: tsup builds IN PLACE — `--clean` wipes dist/ and then
// rewrites it. Two agents building at once (or one agent building while the
// site's typecheck reads dist) interleave into a TORN dist: JS present, .d.ts
// absent. Measured: a build killed mid-DTS leaves `js=10, d.ts=0`, which is
// exactly the "Could not find a declaration file for module '@xoroh/kern'" the
// site keeps hitting.
//
// A lock makes the failure loud instead of silent:
//   - a build that cannot get the lock exits 1 immediately with a clear message
//     rather than corrupting a dist another process is reading;
//   - the loser never silently half-writes.
//
// Usage:
//   node scripts/build-lock.mjs          # acquire, run command, release
//   node scripts/build-lock.mjs --status # report holder, exit 0 always
//
// BUILDER_ENV (optional) names the agent for a friendlier message.

import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK_DIR = resolve(ROOT, "node_modules/.build-lock");
const OWNER =
  process.env.BUILDER_ENV || process.env.BUILDER || `pid-${process.pid}`;

// Stale locks (a killed build) must not wedge the repo forever. A build that
// legitimately takes ~60s is given a generous grace period.
const STALE_MS = 10 * 60 * 1000;

const argv = process.argv.slice(2);
const isStatus = argv[0] === "--status";

async function readOwner() {
  try {
    return JSON.parse(await readFile(resolve(LOCK_DIR, "owner.json"), "utf8"));
  } catch {
    return null;
  }
}

async function isStale(dir) {
  try {
    const info = await stat(dir);
    return Date.now() - info.mtimeMs > STALE_MS;
  } catch {
    return false;
  }
}

if (isStatus) {
  const owner = await readOwner();
  if (owner) {
    process.stdout.write(
      `build lock: HELD by ${owner.owner} since ${owner.at}\n`,
    );
  } else {
    process.stdout.write("build lock: free\n");
  }
  process.exit(0);
}

async function acquire() {
  try {
    await mkdir(LOCK_DIR, { recursive: false });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;

    if (await isStale(LOCK_DIR)) {
      // Reclaim: the previous holder was killed mid-build and left a torn dist.
      process.stderr.write(
        `build-lock: reclaiming a stale lock (>${STALE_MS / 60000}min old). ` +
          `Its dist may be torn — rebuild before trusting it.\n`,
      );
      await rm(LOCK_DIR, { recursive: true, force: true });
      await mkdir(LOCK_DIR, { recursive: true });
      return;
    }

    const owner = await readOwner();
    process.stderr.write(
      `\nbuild-lock: REFUSING TO BUILD — another build holds the lock.\n` +
        `  holder: ${owner ? owner.owner : "unknown"}\n` +
        `  since:  ${owner ? owner.at : "unknown"}\n\n` +
        `Two concurrent builds tear dist/ and produce a JS-only dist that looks\n` +
        `valid. Wait for the other build, or inspect it: bun run build-lock:status\n\n`,
    );
    process.exit(1);
  }

  await writeFile(
    resolve(LOCK_DIR, "owner.json"),
    `${JSON.stringify({ owner: OWNER, at: new Date().toISOString(), pid: process.pid })}\n`,
  );
}

await acquire();

// Run whatever we were asked to run, then always release.
const command = argv.join(" ");
try {
  const child = await Bun.spawn(["bash", "-lc", command], {
    stdout: "inherit",
    stderr: "inherit",
    env: process.env,
  });
  const code = await child.exited;
  await rm(LOCK_DIR, { recursive: true, force: true });
  process.exit(code);
} catch (error) {
  await rm(LOCK_DIR, { recursive: true, force: true });
  process.stderr.write(`build-lock: ${error?.message ?? error}\n`);
  process.exit(1);
}
