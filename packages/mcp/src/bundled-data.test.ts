import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  BUNDLED_BLOCKS,
  BUNDLED_DTCG,
  BUNDLED_THEMES_CATALOG,
  BUNDLED_TOKEN_THEMES,
  BUNDLED_TOKENS_BASE,
} from "./bundled-data.js";
import {
  getBlock,
  getDtcg,
  getTokens,
  listBlocks,
  listThemes,
} from "./tools.js";

const HERE = dirname(new URL(import.meta.url).pathname);

/**
 * Roadmap item 7: the MCP server serves its data from the build-time bundle,
 * never from a checkout. These tests pin the bundle contract:
 *
 *   1. the generated module carries every dataset the tools serve;
 *   2. the tools answer from the bundle even when no checkout is reachable
 *      (KERN_REPO_ROOT pointed at nothing — the packed-tarbail shape).
 *
 * The packed-tarball end-to-end (real pack + temp-dir install + stdio tools)
 * lives in packed.test.ts; this file is the fast in-process half.
 */
describe("bundled data (roadmap item 7)", () => {
  it("carries base tokens with palettes and spectrum", () => {
    const base = BUNDLED_TOKENS_BASE as {
      palettes?: unknown;
      spectrum?: unknown;
    };
    expect(typeof base.palettes).toBe("object");
    expect(typeof base.spectrum).toBe("object");
  });

  it("carries the four served theme presets", () => {
    expect(Object.keys(BUNDLED_TOKEN_THEMES).sort()).toEqual(
      ["brand", "compact", "material-3", "sharp"].sort(),
    );
  });

  it("carries the DTCG document and the theme catalog", () => {
    expect(typeof BUNDLED_DTCG).toBe("object");
    expect(BUNDLED_DTCG).not.toBeNull();
    const ids = (
      BUNDLED_THEMES_CATALOG as { themes: { id: string }[] }
    ).themes.map((t) => t.id);
    expect(ids).toContain("material-3");
  });

  it("carries block rows with files and component dependencies", () => {
    expect(BUNDLED_BLOCKS.length).toBeGreaterThan(0);
    for (const b of BUNDLED_BLOCKS) {
      expect(b.files.length).toBeGreaterThan(0);
    }
  });

  it("serves tokens, DTCG, themes and blocks with no checkout reachable", async () => {
    const saved = process.env.KERN_REPO_ROOT;
    process.env.KERN_REPO_ROOT = join(HERE, "no-checkout-here");
    try {
      const base = await getTokens("base");
      expect("error" in base).toBe(false);
      const brand = await getTokens("brand");
      expect("error" in brand).toBe(false);
      const dtcg = await getDtcg();
      expect("error" in dtcg).toBe(false);
      const themes = await listThemes();
      expect("error" in (themes as object)).toBe(false);
      const blocks = await listBlocks();
      expect("error" in blocks).toBe(false);
      if ("error" in blocks) return;
      expect(blocks.count).toBe(BUNDLED_BLOCKS.length);
      const one = await getBlock(blocks.blocks[0].name);
      expect("error" in one).toBe(false);
    } finally {
      if (saved === undefined) delete process.env.KERN_REPO_ROOT;
      else process.env.KERN_REPO_ROOT = saved;
    }
  });

  it("ships the docs corpus index as a generated payload", () => {
    const file = join(HERE, "docs-index.json");
    expect(existsSync(file)).toBe(true);
    const index = JSON.parse(readFileSync(file, "utf8")) as {
      count: number;
      pages: { page: string; md: string[] }[];
    };
    expect(index.count).toBeGreaterThan(0);
    expect(index.pages.length).toBe(index.count);
    for (const p of index.pages) {
      expect(typeof p.page).toBe("string");
      expect(p.md.length).toBeGreaterThan(0);
    }
  });
});
