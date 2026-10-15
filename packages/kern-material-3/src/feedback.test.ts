import { describe, expect, it } from "vitest";
import {
  BRAND_TRIO,
  DEFAULT_FEEDBACK_VARIANT,
  DEFAULT_LOADING_STYLE,
  FEEDBACK_SHAPES,
  FEEDBACK_SIZE_DP,
  FEEDBACK_SIZES,
  feedbackTiming,
  isLoadingStyleRendered,
  LOADING_INDICATOR_STYLES,
  PROGRESS_INDICATOR_KINDS,
  RENDERED_LOADING_STYLES,
  registerFeedbackVariant,
  resolveFeedbackVariant,
  SHORT_WAIT_MS,
  UNRENDERED_LOADING_STYLES,
} from "./feedback";

describe("feedback spec", () => {
  it("keeps the M3 role and style catalogs stable", () => {
    expect([...PROGRESS_INDICATOR_KINDS]).toEqual(["linear", "circular"]);
    expect([...LOADING_INDICATOR_STYLES]).toEqual([
      "spinner",
      "dots",
      "bar",
      "shapes",
      "conveyor",
      "contained",
      "orbit",
      "morph",
      "assembly",
    ]);
    expect([...RENDERED_LOADING_STYLES]).toEqual([
      "spinner",
      "dots",
      "bar",
      "shapes",
    ]);
    expect([...UNRENDERED_LOADING_STYLES]).toEqual([
      "conveyor",
      "contained",
      "orbit",
      "morph",
      "assembly",
    ]);
    expect([...FEEDBACK_SHAPES]).toEqual([
      "triangle",
      "circle",
      "square",
      "pill",
      "diamond",
      "arch",
    ]);
    expect([...BRAND_TRIO]).toEqual(["triangle", "circle", "square"]);
    expect([...FEEDBACK_SIZES]).toEqual(["sm", "md", "lg"]);
    expect(DEFAULT_LOADING_STYLE).toBe("shapes");
    expect(SHORT_WAIT_MS).toBe(5000);
  });

  it("pins the dp metrics and motion timing", () => {
    expect(FEEDBACK_SIZE_DP).toEqual({
      sm: { shape: 16, gap: 8, container: 32 },
      md: { shape: 24, gap: 12, container: 38 },
      lg: { shape: 30, gap: 14, container: 48 },
    });
    expect(feedbackTiming).toEqual({
      cycleMs: 1200,
      staggerMs: 150,
      hopDp: 12,
      fadeMs: 250,
      minDisplayMs: 1400,
      easing: [0.2, 0, 0, 1],
    });
  });

  it("separates rendered styles from reserved ones", () => {
    for (const style of RENDERED_LOADING_STYLES) {
      expect(isLoadingStyleRendered(style)).toBe(true);
    }
    for (const style of UNRENDERED_LOADING_STYLES) {
      expect(isLoadingStyleRendered(style)).toBe(false);
    }
    expect(isLoadingStyleRendered("assembly")).toBe(false);
    expect(isLoadingStyleRendered("shapes")).toBe(true);
  });

  it("resolves the platform default with no tenant id", () => {
    expect(resolveFeedbackVariant()).toBe(DEFAULT_FEEDBACK_VARIANT);
    expect(resolveFeedbackVariant(undefined)).toBe(DEFAULT_FEEDBACK_VARIANT);
    expect(resolveFeedbackVariant("")).toBe(DEFAULT_FEEDBACK_VARIANT);
  });

  it("matches the native suite literal for the default variant JSON", () => {
    expect(JSON.stringify(resolveFeedbackVariant())).toBe(
      '{"shapes":["triangle","circle","square"],"style":"shapes","tone":"surface"}',
    );
    expect(resolveFeedbackVariant()).toEqual({
      shapes: ["triangle", "circle", "square"],
      style: "shapes",
      tone: "surface",
    });
  });

  it("resolves a registered variant to a complete config", () => {
    registerFeedbackVariant("acme", {
      shapes: ["pill", "arch"],
      style: "dots",
      tone: "inverse",
    });
    expect(resolveFeedbackVariant("acme")).toEqual({
      shapes: ["pill", "arch"],
      style: "dots",
      tone: "inverse",
    });
    expect(JSON.stringify(resolveFeedbackVariant("acme"))).toBe(
      '{"shapes":["pill","arch"],"style":"dots","tone":"inverse"}',
    );
  });

  it("fills unspecified fields with the platform defaults", () => {
    registerFeedbackVariant("partial", { style: "bar" });
    expect(resolveFeedbackVariant("partial")).toEqual({
      shapes: ["triangle", "circle", "square"],
      style: "bar",
      tone: "surface",
    });
    registerFeedbackVariant("empty-config", {});
    expect(resolveFeedbackVariant("empty-config")).toEqual({
      shapes: ["triangle", "circle", "square"],
      style: "shapes",
      tone: "surface",
    });
  });

  it("replaces an existing registration (last write wins)", () => {
    registerFeedbackVariant("override-me", { style: "spinner" });
    expect(resolveFeedbackVariant("override-me").style).toBe("spinner");
    registerFeedbackVariant("override-me", { style: "dots", tone: "inverse" });
    expect(resolveFeedbackVariant("override-me")).toEqual({
      shapes: ["triangle", "circle", "square"],
      style: "dots",
      tone: "inverse",
    });
  });

  it("fails loud on an unknown tenant id", () => {
    expect(() => resolveFeedbackVariant("no-such-tenant")).toThrow(
      "Unknown feedback variant: no-such-tenant",
    );
  });

  it("rejects an empty tenant id at registration", () => {
    expect(() => registerFeedbackVariant("", {})).toThrow(
      "registerFeedbackVariant: tenantId must be a non-empty string",
    );
  });

  it("rejects a non-string tenant id at registration", () => {
    expect(() => registerFeedbackVariant(42 as unknown as string, {})).toThrow(
      "registerFeedbackVariant: tenantId must be a non-empty string",
    );
  });

  it("rejects an unknown loading style", () => {
    expect(() =>
      registerFeedbackVariant("bad-style", {
        style: "nope" as (typeof LOADING_INDICATOR_STYLES)[number],
      }),
    ).toThrow("Unknown loading style: nope");
  });

  it("rejects an unknown feedback shape", () => {
    expect(() =>
      registerFeedbackVariant("bad-shape", {
        shapes: ["hexagon" as (typeof FEEDBACK_SHAPES)[number]],
      }),
    ).toThrow("Unknown feedback shape: hexagon");
  });

  it("rejects an empty shape list", () => {
    expect(() => registerFeedbackVariant("no-shapes", { shapes: [] })).toThrow(
      "Feedback variant shapes must not be empty",
    );
  });

  it("rejects an unknown feedback tone", () => {
    expect(() =>
      registerFeedbackVariant("bad-tone", {
        tone: "neon" as unknown as "inverse",
      }),
    ).toThrow("Unknown feedback tone: neon");
  });

  it("freezes the stored variant and copies the shape list", () => {
    const shapes: Array<(typeof FEEDBACK_SHAPES)[number]> = ["pill"];
    registerFeedbackVariant("isolated", { shapes, style: "dots" });
    shapes.push("arch");
    const resolved = resolveFeedbackVariant("isolated");
    expect(resolved.shapes).toEqual(["pill"]);
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(() => {
      (resolved as { style: string }).style = "bar";
    }).toThrow();
  });
});
