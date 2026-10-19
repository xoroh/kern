import { describe, expect, it, vi } from "vitest";

/**
 * Decision 010, mechanically: importing `@xoroh/kern-m3` must register
 * NOTHING with the universal resolver. No system is the implicit global
 * default — a renderer or app that imports this package for its data
 * (shapes, feedback timing, role tables) must not silently acquire five
 * registered presets it never asked for.
 *
 * The assertions run against a freshly reset module registry so they observe
 * the package exactly as a first importer would — the suite's own setup file
 * (which registers, explicitly) lives in a different registry and cannot
 * mask a regression here. Fail-before: on the import-side-effect design,
 * `await import("./index")` populated `themeIds()` and the first assertion
 * failed.
 */
describe("package entry purity (decision 010)", () => {
  it("registers no preset on import; registerM3() is the only path", async () => {
    vi.resetModules();
    const tokens = await import("@xoroh/kern-tokens");

    // Fresh registry: nothing registered yet.
    expect(tokens.themeIds()).not.toContain("material-3");

    // The package entry — every module an app could reach.
    await import("./index");
    expect(tokens.themeIds()).not.toContain("material-3");

    // The one explicit call registers the base table and the overrides.
    const { registerM3 } = await import("./material-3");
    registerM3();
    expect(tokens.themeIds()).toContain("material-3");
    expect(tokens.themeIds()).toEqual(
      expect.arrayContaining(["sharp", "brand", "compact", "demo"]),
    );
  });
});
