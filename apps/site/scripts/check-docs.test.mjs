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
 * Regression: the thin-page contract (013/D-DOCS-DEPTH, second half).
 *
 * Every family outside the top-20 list carries a thin-but-correct page:
 * the THIN_PAGE_CONTRACT sections in lib/top-families.mjs (API table +
 * a11y notes; the API half is also required of every page by checkSections).
 * These two tests pin both halves:
 *
 *   1. the current tree passes the contract (fails BEFORE the two mobile
 *      toggles gained aria notes);
 *   2. a thin page with its aria notes taken away fails naming the page
 *      (fails if anyone weakens the contract back to prose).
 */
describe("check-docs thin-page contract", () => {
  test("every non-top-20 family carries the thin-page contract", () => {
    const run = runGate();
    expect(run.status).toBe(0);
    expect(run.stderr).not.toContain("not a thin page");
  }, 60_000);

  test("a thin page without a11y notes fails the run, not just reports", () => {
    const page = join(site, "src", "content", "mobile", "theme-toggle.ts");
    const aside = `${page}.gated-aside`;
    expect(existsSync(page)).toBe(true);
    renameSync(page, aside);
    try {
      const src = readFileSync(aside, "utf8");
      const start = src.indexOf("  aria: [");
      expect(start).toBeGreaterThan(-1);
      const end = src.indexOf("],", start) + 2;
      writeFileSync(page, src.slice(0, start) + src.slice(end));
      const run = runGate();
      expect(run.status).toBe(1);
      expect(run.stderr).toContain(
        "thin-page mobile/theme-toggle: not a thin page — missing aria",
      );
    } finally {
      renameSync(aside, page);
    }
  }, 60_000);
});
