import { describe, expect, it } from "vitest";
import { MATERIAL_3_PRESET } from "./material-3";

describe("material-3 preset", () => {
  it("validates with the full M3 role set", () => {
    expect(MATERIAL_3_PRESET.id).toBe("material-3");
    expect(Object.keys(MATERIAL_3_PRESET.color.light)).toHaveLength(58);
    expect(Object.keys(MATERIAL_3_PRESET.shape)).toHaveLength(10);
  });

  it("registers tables the universal resolver can consume", async () => {
    const { resolveThemeDetails, themeIds } = await import(
      "@xoroh/kern-tokens"
    );
    expect(themeIds()).toContain("material-3");
    const scheme = resolveThemeDetails("light", "standard", "material-3");
    expect(Object.keys(scheme.color)).toHaveLength(58);
  });
});
