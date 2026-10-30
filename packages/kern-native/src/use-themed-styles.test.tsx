import { describe, expect, it, vi } from "vitest";

vi.mock("react-native", () => ({ useColorScheme: () => "light" }));

import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import { createElement } from "react";
// react-test-renderer ships without type declarations in this workspace.
// @ts-expect-error — untyped package.
import { act, create as createTree } from "react-test-renderer";
import { KernThemeProvider, useThemedStyles } from "./theme";

/**
 * U2 (kern-oss-upstream-v1): the D221 themed-styles factory for native.
 * One subscription (the provider's), one style object per scheme identity —
 * re-renders reuse it, theme changes rebuild it.
 */
describe("useThemedStyles (U2)", () => {
  it("returns the factory result for the active scheme", async () => {
    let seen: { bg: string } | undefined;
    function Probe() {
      seen = useThemedStyles((scheme) => ({ bg: scheme.color.surface }));
      return null;
    }
    let tree: { unmount: () => void } | undefined;
    await act(async () => {
      tree = createTree(
        createElement(KernThemeProvider, null, createElement(Probe)),
      );
    });
    tree?.unmount();
    expect(seen?.bg).toBe(
      resolveThemeDetails("light", "standard", "material-3").color.surface,
    );
  });

  it("memoizes per scheme: re-render reuses, mode change rebuilds", async () => {
    const factory = vi.fn((scheme: ResolvedTheme) => ({
      bg: scheme.color.surface,
    }));
    let seen: { bg: string } | undefined;
    function Probe() {
      seen = useThemedStyles(factory);
      return null;
    }
    let tree:
      | { unmount: () => void; update: (element: unknown) => void }
      | undefined;
    await act(async () => {
      tree = createTree(
        createElement(
          KernThemeProvider,
          { mode: "light" },
          createElement(Probe),
        ),
      );
    });
    const first = seen;
    expect(factory).toHaveBeenCalledTimes(1);
    await act(async () => {
      tree?.update(
        createElement(
          KernThemeProvider,
          { mode: "light" },
          createElement(Probe),
        ),
      );
    });
    expect(factory).toHaveBeenCalledTimes(1);
    expect(seen).toBe(first);
    await act(async () => {
      tree?.update(
        createElement(
          KernThemeProvider,
          { mode: "dark" },
          createElement(Probe),
        ),
      );
    });
    tree?.unmount();
    expect(factory).toHaveBeenCalledTimes(2);
    expect(seen).not.toBe(first);
    expect(seen?.bg).toBe(
      resolveThemeDetails("dark", "standard", "material-3").color.surface,
    );
  });
});
