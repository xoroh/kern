import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  functional,
  functionalTone,
  isFunctionalTone,
  registerFunctionalDomain,
  resolveFunctionalTone,
  setFunctionalOverrides,
  toneClass,
} from "./functional";
import { resolveTheme } from "./resolve";
import {
  avatarToneFor,
  getHue,
  makeHueRamp,
  registerHue,
  SPECTRUM_HUES,
  spectrumTone,
  statusTone,
  TONAL_STEPS,
  TONE_ROLES,
  userToneFor,
} from "./tones";
import {
  assertCompleteScheme,
  getVariant,
  listVariants,
  registerVariant,
  resolveThemeLayers,
  schemeToCssVars,
} from "./variants";

const light = resolveTheme("light");
const dark = resolveTheme("dark");

describe("tones", () => {
  it("keeps hash picks stable (golden vectors)", () => {
    expect(userToneFor("alice", "light").hue).toBe("red");
    expect(userToneFor("bob", "light").hue).toBe("blue");
    expect(avatarToneFor(light, "alice").bg).toBe(
      statusTone(light, "primary").bg,
    );
    expect(avatarToneFor(light, "bob").bg).toBe(
      statusTone(light, "success").bg,
    );
  });

  it("is deterministic across calls and modes", () => {
    expect(userToneFor("alice", "dark").hue).toBe(
      userToneFor("alice", "light").hue,
    );
    expect(avatarToneFor(dark, "alice").bg).toBe(
      avatarToneFor(dark, "alice").bg,
    );
  });

  it("flips spectrum steps by mode", () => {
    const ramp = getHue("blue");
    expect(ramp).not.toBeNull();
    expect(spectrumTone("blue", "light")).toEqual({
      hue: "blue",
      bg: ramp?.["100"].srgb,
      fg: ramp?.["900"].srgb,
      dot: ramp?.["700"].srgb,
    });
    expect(spectrumTone("blue", "dark")).toEqual({
      hue: "blue",
      bg: ramp?.["800"].srgb,
      fg: ramp?.["100"].srgb,
      dot: ramp?.["300"].srgb,
    });
  });

  it("resolves status tones from M3 roles", () => {
    expect(statusTone(light, "primary")).toEqual({
      bg: light.primaryContainer,
      fg: light.onPrimaryContainer,
      dot: light.primary,
    });
    expect(TONE_ROLES.neutral.dot).toBe("outline");
  });

  it("registers custom hues and throws on unknown ones", () => {
    const ramp = makeHueRamp({ hue: 280, chroma: 0.1 });
    expect(Object.keys(ramp)).toHaveLength(TONAL_STEPS.length);
    for (const step of TONAL_STEPS) {
      expect(ramp[step].srgb).toMatch(/^#[\da-f]{6}$/i);
    }
    registerHue("brand-coral", ramp);
    expect(getHue("brand-coral")).toEqual(ramp);
    expect(spectrumTone("brand-coral", "light").hue).toBe("brand-coral");
    expect(() => spectrumTone("nope", "light")).toThrow("Unknown hue");
  });

  it("seeds makeHueRamp from hex and oklch strings", () => {
    expect(makeHueRamp("#7c3aed")["500"].srgb).toMatch(/^#[\da-f]{6}$/i);
    expect(makeHueRamp("oklch(62% 0.19 300)")["900"].srgb).toMatch(
      /^#[\da-f]{6}$/i,
    );
    expect(SPECTRUM_HUES).toContain("blue");
  });
});

describe("functional map", () => {
  it("resolves all 46 default keys", () => {
    let count = 0;
    for (const [domain, table] of Object.entries(
      functional as Record<string, Record<string, unknown>>,
    )) {
      for (const key of Object.keys(table)) {
        const colors = resolveFunctionalTone(light, domain, key);
        expect(colors.bg).toMatch(/^#[\da-f]{6}$/i);
        expect(colors.fg).toMatch(/^#[\da-f]{6}$/i);
        count++;
      }
    }
    expect(count).toBe(46);
  });

  it("names utilities and classifies values", () => {
    expect(toneClass("ticketStatus", "in_progress")).toBe(
      "tone-ticket-status-in_progress",
    );
    expect(isFunctionalTone(functionalTone("priority", "urgent"))).toBe(true);
    expect(() => functionalTone("priority", "nope")).toThrow(
      "Unknown functional key",
    );
  });

  it("extends and overrides at runtime", () => {
    registerFunctionalDomain("orderStatus", {
      shipped: { hue: "teal", bg: "100", fg: "700" },
    });
    expect(resolveFunctionalTone(light, "orderStatus", "shipped").bg).toBe(
      getHue("teal")?.["100"].srgb,
    );
    setFunctionalOverrides({
      priority: { urgent: { hue: "red", bg: "100", fg: "800" } },
    });
    expect(resolveFunctionalTone(light, "priority", "urgent").bg).toBe(
      getHue("red")?.["100"].srgb,
    );
    setFunctionalOverrides(null);
  });
});

describe("theme engine", () => {
  it("registers variants and reports deltas", () => {
    registerVariant({
      id: "tenant-x",
      overrides: { color: { light: { primary: "#1e3a8a" } } },
    });
    expect(getVariant("tenant-x").id).toBe("tenant-x");
    expect(listVariants().map((v) => v.id)).toContain("tenant-x");
    expect(() => getVariant("nope")).toThrow("Unknown variant");
    const { scheme, deltas } = resolveThemeLayers(
      "light",
      "standard",
      "tenant-x",
    );
    expect(deltas.primary).toBe("#1e3a8a");
    expect(scheme.secondary).toBe(light.secondary);
  });

  it("fails loud on incomplete schemes and unknown ids", () => {
    expect(() => assertCompleteScheme({ primary: "#000000" })).toThrow(
      "missing roles",
    );
    expect(() => assertCompleteScheme(light)).not.toThrow();
    expect(() => resolveThemeLayers("light", "standard", "bogus")).toThrow(
      "Unknown variant",
    );
  });

  it("emits CSS vars per role", () => {
    const vars = schemeToCssVars(light);
    expect(vars["--md-sys-color-primary"]).toBe(light.primary);
  });
});

describe("tone utilities", () => {
  it("generates a class for every functional key", () => {
    const css = readFileSync(new URL("./tones.css", import.meta.url), "utf8");
    for (const [domain, table] of Object.entries(
      functional as Record<string, Record<string, unknown>>,
    )) {
      for (const key of Object.keys(table)) {
        expect(css).toContain(`${toneClass(domain, key)} {`);
      }
    }
  });
});
