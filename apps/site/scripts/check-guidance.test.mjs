import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Regression: the guidance corpus gate (the one standard, ADR-115).
 *
 * The teaching half of every component page moved to
 * `docs/m3-guidance/<family>.md` on 2026-10-19 — verbatim, with
 * `docs/m3-guidance/manifest.json` as the receipt. These tests pin the four
 * ways that move can go wrong, on the REAL tree (not a fixture): the corpus
 * drifts from the manifest, a page keeps a moved field, a page loses the
 * `states` list its token table carried, and the corpus is fine.
 *
 * Each mutation is written to a copy and restored in a `finally`, so the tree
 * is exactly as it was found even when an assertion fails.
 */

const site = dirname(dirname(fileURLToPath(import.meta.url)));
const repo = join(site, "..", "..");
const gate = join(site, "scripts", "check-guidance.mjs");
const guidanceDir = join(repo, "docs", "m3-guidance");

/** The two files the mutations below touch — snapshotted before any test. */
const BUTTON_GUIDANCE = join(guidanceDir, "button.md");
const BUTTON_PAGE = join(site, "src", "content", "web", "button.ts");
const guidanceBefore = readFileSync(BUTTON_GUIDANCE, "utf8");
const pageBefore = readFileSync(BUTTON_PAGE, "utf8");

function runGate() {
  return spawnSync("node", [gate], { cwd: site, encoding: "utf8" });
}

/**
 * Run `mutate` against a file, run the gate, and put the file back whatever
 * happened. The restore is the point: a gate test that leaves the tree
 * mutated is a gate test that breaks the next one.
 */
function withMutatedFile(path, mutate, body) {
  const original = readFileSync(path, "utf8");
  try {
    mutate(original);
    return body();
  } finally {
    writeFileSync(path, original);
  }
}

describe("check-guidance", () => {
  test("the real corpus passes: present, verbatim, and the pages carry none of it", () => {
    const run = runGate();
    expect(run.stdout).toContain("check-guidance: ok");
    expect(run.status).toBe(0);
  }, 120_000);

  test("a hand-edited guidance file fails the byte comparison", () => {
    const file = join(guidanceDir, "button.md");
    expect(existsSync(file)).toBe(true);
    withMutatedFile(
      file,
      (src) => writeFileSync(file, `${src}\nAn edit nobody made.\n`),
      () => {
        const run = runGate();
        expect(run.status).toBe(1);
        expect(run.stderr).toContain(
          "button.md is not what the manifest renders",
        );
      },
    );
  }, 120_000);

  test("a page that still carries a moved field fails the run, naming the page", () => {
    const file = join(site, "src", "content", "web", "separator.ts");
    withMutatedFile(
      file,
      (src) => {
        const anchor = src.indexOf("  meta: {");
        expect(anchor).toBeGreaterThan(-1);
        writeFileSync(
          file,
          `${src.slice(0, anchor)}  features: "A pitch that moved.",\n${src.slice(anchor)}`,
        );
      },
      () => {
        const run = runGate();
        expect(run.status).toBe(1);
        expect(run.stderr).toContain("separator.ts");
        expect(run.stderr).toContain("still carries `features`");
      },
    );
  }, 120_000);

  test("a page that lost the states its token table carried fails the run", () => {
    const file = join(site, "src", "content", "web", "button.ts");
    withMutatedFile(
      file,
      (src) => {
        const stripped = src.replace(/ {2}states: \[[^\]]*\],\n/, "");
        expect(stripped).not.toBe(src);
        writeFileSync(file, stripped);
      },
      () => {
        const run = runGate();
        expect(run.status).toBe(1);
        expect(run.stderr).toContain("button.ts");
        expect(run.stderr).toContain("carries no `states` list");
      },
    );
  }, 120_000);

  test("a states list that misses a token row fails the run", () => {
    const file = join(site, "src", "content", "web", "button.ts");
    withMutatedFile(
      file,
      (src) => {
        const partial = src.replace(
          / {2}states: \[[^\]]*\],\n/,
          '  states: ["resting", "hover"],\n',
        );
        expect(partial).not.toBe(src);
        writeFileSync(file, partial);
      },
      () => {
        const run = runGate();
        expect(run.status).toBe(1);
        expect(run.stderr).toContain("does not cover the states");
      },
    );
  }, 120_000);

  test("every mutation was restored — the tree is as it was found", () => {
    // The restore is the contract the other four tests depend on: a gate
    // test that leaves the tree mutated breaks the next run.
    expect(readFileSync(BUTTON_GUIDANCE, "utf8")).toBe(guidanceBefore);
    expect(readFileSync(BUTTON_PAGE, "utf8")).toBe(pageBefore);
  }, 60_000);
});
