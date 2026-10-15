import "./material-3"; // registers the material-3 preset tables (side effect)
import { describe, expect, it } from "vitest";
import { defineThemePreset, resolveTheme, varName } from "@xoroh/kern-tokens";
import { themes } from "./themes";

describe("resolveTheme", () => {
  it("resolves light roles from ramp values", () => {
    const scheme = resolveTheme("light");
    expect(scheme.primary).toBe(themes["material-3"].color.light.primary);
    expect(scheme.secondary).toBe(themes["material-3"].color.light.secondary);
    expect(scheme.surfaceTonal).toBe(themes["material-3"].color.light.surfaceTonal);
  });

  it("mirrors assignments in dark", () => {
    const scheme = resolveTheme("dark");
    expect(scheme.primary).toBe(themes["material-3"].color.dark.primary);
    expect(scheme.surface).toBe(themes["material-3"].color.dark.surface);
  });

  it("layers contrast overlays over base", () => {
    expect(resolveTheme("light", "medium").outline).toBe(
      themes["material-3"].contrast["light-medium"].outline,
    );
    expect(resolveTheme("light").outline).toBe(themes["material-3"].color.light.outline);
    expect(resolveTheme("dark", "high").outline).toBe(
      themes["material-3"].contrast["dark-high"].outline,
    );
  });

  it("applies sharp deltas", () => {
    expect(resolveTheme("light", "standard", "sharp").onSurface).toBe(
      themes["material-3"].color.light.onSurface,
    );
    expect(resolveTheme("light").onSurface).toBe(
      themes["material-3"].color.light.onSurface,
    );
  });

  it("validates custom theme roles and contrast", () => {
    expect(() =>
      defineThemePreset({
        id: "custom",
        extends: "material-3",
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
    expect(varName("onSurface")).toBe("--sys-color-on-surface");
  });
});
