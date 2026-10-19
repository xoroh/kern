import { describe, expect, it, vi } from "vitest";

/**
 * Decision 010, mechanically, at the renderer boundary: importing
 * "@xoroh/kern" must register NOTHING with the universal resolver. The
 * renderer hosts components of every system; if importing it silently
 * registered M3, the renderer would choose the app's design system —
 * exactly what decision 010 forbids.
 *
 * Assertions run against a freshly reset module registry, so they observe
 * the package exactly as a first importer would — the suite's own setup
 * file (which registers explicitly, like an app entry) lives in a different
 * registry and cannot mask a regression. Fail-before: while "@xoroh/kern"'s
 * entry carried `import "@xoroh/kern-m3"` for its side effect, the fresh
 * import populated themeIds() and the first assertion failed.
 */
describe("entry purity (decision 010)", () => {
  it("importing @xoroh/kern registers no preset; registerM3() is the only path", async () => {
    vi.resetModules();
    const tokens = await import("@xoroh/kern-tokens");

    expect(tokens.themeIds()).not.toContain("material-3");

    await import("./index");
    expect(tokens.themeIds()).not.toContain("material-3");

    const { registerM3 } = await import("@xoroh/kern-m3");
    registerM3();
    expect(tokens.themeIds()).toContain("material-3");
  });
});
