import { describe, expect, it } from "vitest";
import { defineThemePreset, resolveTheme, varName } from "./resolve";
import { themes } from "./tokens";

describe("resolveTheme", () => {
  it("resolves light roles from ramp values", () => {
    const scheme = resolveTheme("light");
    expect(scheme.primary).toBe(themes.m3.color.light.primary);
    expect(scheme.secondary).toBe(themes.m3.color.light.secondary);
    expect(scheme.surfaceTonal).toBe(themes.m3.color.light.surfaceTonal);
  });

  it("mirrors assignments in dark", () => {
    const scheme = resolveTheme("dark");
    expect(scheme.primary).toBe(themes.m3.color.dark.primary);
    expect(scheme.surface).toBe(themes.m3.color.dark.surface);
  });

  it("layers contrast overlays over base", () => {
    expect(resolveTheme("light", "medium").outline).toBe(
      themes.m3.contrast["light-medium"].outline,
    );
    expect(resolveTheme("light").outline).toBe(themes.m3.color.light.outline);
    expect(resolveTheme("dark", "high").outline).toBe(
      themes.m3.contrast["dark-high"].outline,
    );
  });

  it("applies sharp deltas", () => {
    expect(resolveTheme("light", "standard", "sharp").onSurface).toBe(
      themes.m3.color.light.onSurface,
    );
    expect(resolveTheme("light").onSurface).toBe(
      themes.m3.color.light.onSurface,
    );
  });

  it("validates custom theme roles and contrast", () => {
    expect(() =>
      defineThemePreset({
        id: "custom",
        extends: "m3",
        overrides: { color: { light: { primary: "#111111" } } },
      }),
    ).not.toThrow();
    expect(() =>
      defineThemePreset({
        id: "unknown",
        overrides: { color: { light: { notAColorRole: "#111111" } } },
      }),
    ).toThrow("Unknown color role");
    expect(() =>
      defineThemePreset({
        id: "lowcontrast",
        overrides: { color: { light: { onSurface: "#ffffff" } } },
      }),
    ).toThrow("fails light contrast");
  });

  it("names vars per M3", () => {
    expect(varName("onSurface")).toBe("--md-sys-color-on-surface");
  });
});
