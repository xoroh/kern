import { describe, expect, it, vi } from "vitest";

/**
 * Provider propagation for resolved comp overrides (A4-2).
 *
 * Style-function tests prove components read `scheme.comp`; this suite proves
 * the override survives the real path — CustomTheme → resolveThemeDetails →
 * KernThemeProvider → useKernScheme — instead of a hand-built scheme.
 */

// Importing the design system registers its presets with the resolver.
import "@xoroh/kern-material-3";

vi.mock("react-native", () => ({ useColorScheme: () => "light" }));

import { createElement } from "react";
// react-test-renderer ships without type declarations in this workspace.
// @ts-expect-error — untyped package.
import { act, create as createTree } from "react-test-renderer";
import {
  defineThemePreset,
  resolveThemeDetails,
  type ResolvedTheme,
} from "@xoroh/kern-tokens";
import { KernThemeProvider, useKernScheme } from "./theme";
import { inputStyles } from "./components/input";
import { switchStyles } from "./components/switch";

async function renderWithScheme(
  variant: Parameters<typeof KernThemeProvider>[0]["variant"],
  contrast: Parameters<typeof KernThemeProvider>[0]["contrast"] = "standard",
): Promise<ResolvedTheme | undefined> {
  let seen: ResolvedTheme | undefined;
  function Probe() {
    seen = useKernScheme();
    return null;
  }
  let tree: { unmount: () => void } | undefined;
  await act(async () => {
    tree = createTree(
      createElement(
        KernThemeProvider,
        { variant, contrast },
        createElement(Probe),
      ),
    );
  });
  tree?.unmount();
  return seen;
}

describe("KernThemeProvider comp propagation (A4-2)", () => {
  it("delivers a validated comp override through context", async () => {
    const theme = defineThemePreset({
      id: "a42-provider-probe",
      extends: "material-3",
      overrides: { comp: { "switch-track-shape": "4px" } },
    });
    const seen = await renderWithScheme(theme);
    expect(seen?.comp).toEqual({ "switch-track-shape": "4px" });
    // The shape fallback the override replaces is still present.
    expect(seen?.shape.full).toBe("9999px");
  });

  it("comp-free themes propagate without a comp key", async () => {
    const seen = await renderWithScheme("material-3");
    expect(seen?.comp).toBeUndefined();
    expect(seen?.shape.full).toBe("9999px");
  });

  it("contrast and variant selections resolve through the provider", async () => {
    const theme = defineThemePreset({
      id: "a42-provider-contrast",
      extends: "material-3",
      overrides: { comp: { "card-container-shape": "4px" } },
    });
    const seen = await renderWithScheme(theme, "high");
    // Same triple through the resolver directly: the provider adds nothing
    // and removes nothing.
    const direct = resolveThemeDetails("light", "high", theme);
    expect(seen).toEqual(direct);
    expect(seen?.comp).toEqual({ "card-container-shape": "4px" });
  });

  it("provider-delivered comp reaches style functions with filled corners intact", async () => {
    const theme = defineThemePreset({
      id: "a42-provider-styles",
      extends: "material-3",
      overrides: { comp: { "switch-track-shape": "4px" } },
    });
    const seen = await renderWithScheme(theme);
    expect(seen).toBeDefined();
    if (seen === undefined) return;
    // No hand-built scheme: the style functions read the provider scheme.
    expect(switchStyles(false, false, seen).track.borderRadius).toBe(4);
    expect(switchStyles(false, false, seen).thumb.borderRadius).toBe(9999);
    const filled = inputStyles(false, false, seen, false, "filled");
    expect(filled.borderTopLeftRadius).toBe(4);
    expect(filled.borderBottomLeftRadius).toBe(0);
  });
});
