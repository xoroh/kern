import {
  assertCompleteScheme,
  getVariant,
  registerPreset,
  registerVariant,
  resolveThemeDetails,
  resolveThemeLayers,
} from "@xoroh/kern-tokens";
import { describe, expect, it } from "vitest";

/**
 * U3 (kern-oss-upstream-v1): tenant partial-scheme register + completeness
 * guard. A whitelabel tenant registers overrides only (never a full table);
 * layers resolve base -> contrast -> overrides, and the guard fails loud on
 * incomplete schemes — against the tenant's own base, not M3 by assumption.
 */

registerPreset("u3-base", {
  color: {
    light: { primary: "#6750a4", onPrimary: "#ffffff" },
    dark: { primary: "#d0bcff", onPrimary: "#381e72" },
  },
  shape: { small: "4px" },
  policy: { textPairs: [], uiPairs: [], waivers: [] },
});

registerVariant({
  id: "u3-tenant",
  extends: "material-3",
  overrides: { color: { light: { primary: "#123456" } } },
});

describe("U3 tenant partial-scheme pattern", () => {
  it("registers and resolves overrides over the base", () => {
    expect(getVariant("u3-tenant").extends).toBe("material-3");
    const { scheme, deltas } = resolveThemeLayers(
      "light",
      "standard",
      "u3-tenant",
    );
    expect(scheme.primary).toBe("#123456");
    expect(scheme.onPrimary).toBe(
      resolveThemeDetails("light", "standard", "material-3").color.onPrimary,
    );
    expect(deltas).toEqual({ primary: "#123456" });
  });

  it("assertCompleteScheme passes on resolved schemes, fails loud on partials", () => {
    const { scheme } = resolveThemeLayers("light", "standard", "u3-tenant");
    expect(() => assertCompleteScheme(scheme)).not.toThrow();
    expect(() => assertCompleteScheme({ primary: "#123456" })).toThrow(
      /missing roles: .*onPrimary/,
    );
  });

  it("probes the tenant base when given, not M3 by assumption", () => {
    expect(() =>
      assertCompleteScheme(
        { primary: "#6750a4", onPrimary: "#ffffff" },
        "u3-base",
      ),
    ).not.toThrow();
    expect(() =>
      assertCompleteScheme({ primary: "#6750a4" }, "u3-base"),
    ).toThrow(/missing roles: onPrimary/);
  });
});
