import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Regression: undocumented inventory exports must FAIL check-docs.
 *
 * The coverage line ("402/418 inventory exports documented") used to be
 * report-only — the gate printed the 16 orphans and still exited 0, so a
 * component could ship with no page at all and nothing moved. The gate now
 * pushes every orphan into `errors`, and these two tests pin both halves of
 * that contract:
 *
 *   1. zero debt → exit 0 (fails BEFORE the documenting work, when coverage
 *      was 402/418; passes after all 16 exports are claimed);
 *   2. one export taken away → exit 1 with the orphan named (fails if anyone
 *      reverts the flip back to report-only).
 */

const site = dirname(dirname(fileURLToPath(import.meta.url)));
const gate = join(site, "scripts", "check-docs.mjs");

function runGate() {
  return spawnSync("node", [gate], { cwd: site, encoding: "utf8" });
}

describe("check-docs orphan gate", () => {
  test("every inventory export has a documenting family", () => {
    const run = runGate();
    const coverage = /coverage (\d+)\/(\d+) inventory exports documented/.exec(
      run.stdout,
    );
    expect(coverage).not.toBeNull();
    const documented = Number(coverage[1]);
    const total = Number(coverage[2]);
    expect(documented).toBe(total);
    expect(run.status).toBe(0);
  }, 60_000);

  test("an export with no documenting family fails the run, not just reports", () => {
    const page = join(site, "src", "content", "web", "focus-ring.ts");
    const aside = `${page}.gated-aside`;
    expect(existsSync(page)).toBe(true);
    renameSync(page, aside);
    try {
      const run = runGate();
      expect(run.status).toBe(1);
      expect(run.stderr).toContain(
        "web/FocusRing: inventory export with no documenting family",
      );
    } finally {
      renameSync(aside, page);
    }
  }, 60_000);
});

/**
 * Regression: the ONE STANDARD (ADR-115) has no tiers.
 *
 * Decision 013 split the families into a top-20 that carried full pages and
 * every other family that carried a thin-but-correct page. The one standard
 * replaced that with ONE page shape: the depth bar is gone — its family list
 * and its thin-page contract are gone with it — and what replaced them is the
 * guidance corpus, the teaching half of every page, moved verbatim to
 * `docs/m3-guidance/<family>.md`.
 *
 * These two tests pin that replacement:
 *
 *   1. the guidance corpus passes on the real tree (every family has its
 *      file, the file equals a fresh render from the manifest, and no page
 *      still carries a moved field);
 *   2. a page that still carries a moved field FAILS the run, naming the
 *      page — so the split cannot quietly reverse itself, which is the
 *      failure the tiers' replacement has to prevent.
 */
describe("check-docs one standard (guidance corpus)", () => {
  test("the guidance corpus is present, verbatim, and the pages carry none of it", () => {
    const run = runGate();
    expect(run.status).toBe(0);
    expect(run.stdout).toContain("check-docs: guidance corpus");
  }, 60_000);

  test("a page that still carries a moved field fails the run, naming the page", () => {
    const page = join(site, "src", "content", "web", "separator.ts");
    const aside = `${page}.gated-aside`;
    expect(existsSync(page)).toBe(true);
    const src = readFileSync(page, "utf8");
    const anchor = src.indexOf("  meta: {");
    expect(anchor).toBeGreaterThan(-1);
    writeFileSync(
      page,
      `${src.slice(0, anchor)}  features: "A pitch that moved.",\n${src.slice(anchor)}`,
    );
    try {
      const run = runGate();
      expect(run.status).toBe(1);
      expect(run.stderr).toContain("still carries `features`");
      expect(run.stderr).toContain("separator.ts");
    } finally {
      writeFileSync(page, src);
      expect(existsSync(aside)).toBe(false);
    }
  }, 60_000);
});
