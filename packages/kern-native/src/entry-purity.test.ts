import { describe, expect, it, vi } from "vitest";

/**
 * Decision 010, mechanically, at the native renderer boundary: importing
 * "@xoroh/kern-native" must register NOTHING with the universal resolver,
 * and must not require registration to be IMPORTABLE at all (ESM evaluates
 * imports before the app entry runs — which is why `defaultScheme()` in
 * `theme.tsx` resolves lazily instead of at module scope).
 *
 * Assertions run against a freshly reset module registry so they observe the
 * package as a first importer would — the suite's setup file (which
 * registers explicitly, like an app entry) lives in a different registry and
 * cannot mask a regression. Fail-before: the entry's
 * `import "@xoroh/kern-m3"` side effect populated themeIds() on import.
 */
describe("native entry purity (decision 010)", () => {
  it("importing @xoroh/kern-native registers no preset; registerM3() is the only path", async () => {
    vi.resetModules();
    const tokens = await import("@xoroh/kern-tokens");

    expect(tokens.themeIds()).not.toContain("material-3");

    // Importing the whole entry — every component module — must succeed
    // unregistered (lazy defaultScheme) and register nothing.
    await import("@xoroh/kern-native");
    expect(tokens.themeIds()).not.toContain("material-3");

    const { registerM3 } = await import("@xoroh/kern-m3");
    registerM3();
    expect(tokens.themeIds()).toContain("material-3");
  });
});
