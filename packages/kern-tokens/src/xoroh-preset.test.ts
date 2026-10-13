import { describe, expect, test } from "vitest";
import { resolveThemeDetails } from "./resolve";
import { XOROH_PRESET } from "./xoroh-preset";

describe("xoroh compatibility preset", () => {
  test("it loads — defineThemePreset already contrast-gated it", () => {
    expect(XOROH_PRESET.id).toBe("xoroh");
    expect(XOROH_PRESET.extends).toBe("kern");
  });

  test("light resolves the private blue secondary, not the M3 baseline", () => {
    const { color } = resolveThemeDetails("light", "standard", XOROH_PRESET);
    expect(color.secondary).toBe("#2563eb");
    expect(color.onSecondary).toBe("#ffffff");
    expect(color.secondaryContainer).toBe("#dbeafe");
    expect(color.onSecondaryContainer).toBe("#1e3a8a");
  });

  test("light resolves the private black primary", () => {
    const { color } = resolveThemeDetails("light", "standard", XOROH_PRESET);
    expect(color.primary).toBe("#000000");
    expect(color.onPrimary).toBe("#ffffff");
  });

  test("dark resolves the private values on both families", () => {
    const { color } = resolveThemeDetails("dark", "standard", XOROH_PRESET);
    expect(color.primary).toBe("#ffffff");
    expect(color.onPrimary).toBe("#000000");
    expect(color.secondary).toBe("#60a5fa");
    expect(color.onSecondary).toBe("#172554");
  });

  test("tertiary is untouched — the parent scheme has none, and the gap is honest", () => {
    const preset = resolveThemeDetails("light", "standard", XOROH_PRESET);
    const baseline = resolveThemeDetails("light", "standard", "kern");
    expect(preset.color.tertiary).toBe(baseline.color.tertiary);
  });

  test("the OSS default is NOT the private theme — no silent rebrand", () => {
    const baseline = resolveThemeDetails("light", "standard", "kern");
    expect(baseline.color.secondary).toBe("#625b71");
    expect(baseline.color.secondary).not.toBe("#2563eb");
  });
});
