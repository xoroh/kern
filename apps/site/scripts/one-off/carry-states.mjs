#!/usr/bin/env bun
/**
 * carry-states — one-off: keep the STATE list a family's token table
 * registered, now that the token table itself moved to the guidance file.
 *
 * The page's States strip taught "which states does this component
 * register" from the token table's `state` column. The table moved to
 * `docs/m3-guidance/<family>.md`, but the strip is a live lens on the demo
 * and it still has something to say. So the state names are carried over as
 * a small, explicit `states` field on the page — the teaching half stays,
 * the reference table moves.
 *
 * Reads the pre-migration files from git (the commit that moved them), so it
 * is safe to run once and then delete.
 *
 * Usage: bun scripts/one-off/carry-states.mjs [--write]
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const APP = join(import.meta.dir, "..", "..");
const CONTENT = join(APP, "src", "content");
const REPO = join(APP, "..", "..");
const write = process.argv.includes("--write");
const BASE = "HEAD";

function gitShow(path) {
  return execFileSync("git", ["show", `${BASE}:${path}`], {
    cwd: REPO,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

const files = [];
for (const platform of ["web", "mobile"]) {
  const listing = execFileSync(
    "git",
    ["ls-tree", "--name-only", `${BASE}:apps/site/src/content/${platform}`],
    { cwd: REPO, encoding: "utf8" },
  );
  for (const line of listing.trim().split("\n")) {
    if (line.endsWith(".ts")) files.push({ platform, file: line });
  }
}

// The token rows' `state` values, per file, read from the pre-migration text.
let carried = 0;
for (const { platform, file } of files) {
  const path = join(CONTENT, platform, file);
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  const original = gitShow(`apps/site/src/content/${platform}/${file}`);
  const states = [];
  const rowRe = /state:\s*"([^"]+)"/g;
  for (const match of original.matchAll(rowRe)) {
    if (!states.includes(match[1])) states.push(match[1]);
  }
  if (states.length === 0) continue;
  const list = states.map((s) => `"${s}"`).join(", ");
  // Insert the field right after the `parts:` line — the reference block.
  const anchor = /^( {2}parts: \[[^\]]*\],)$/m;
  if (!anchor.test(source)) {
    console.log(`skip (no parts anchor): ${platform}/${file}`);
    continue;
  }
  const next = source.replace(
    anchor,
    `$1\n  // The states this component registers, carried from the token table\n  // that now lives in docs/m3-guidance/<family>.md.\n  states: [${list}],`,
  );
  carried++;
  if (write) writeFileSync(path, next);
}

console.log(
  `carry-states: ${carried} page files ${write ? "updated" : "would update"}`,
);
