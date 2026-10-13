import { describe, expect, test } from "vitest";
import { resolveAlias } from "../token-graph";
import { toDtcg } from "./export";
import { fromDtcg } from "./import";
import { retainedNotes } from "./retained";
import {
  asCubicBezier,
  asDimension,
  asDuration,
  asOpacityNumber,
  componentsToHex,
  hexToComponents,
  parseFirstShadow,
} from "./shared";
import { validateDtcg } from "./validate";

describe("shared conversions", () => {
  test("hex round-trips through sRGB components", () => {
    expect(componentsToHex(hexToComponents("#6750a4"))).toBe("#6750a4");
    expect(hexToComponents("#000000")).toEqual([0, 0, 0]);
    expect(hexToComponents("#ffffff")).toEqual([1, 1, 1]);
  });

  test("a malformed hex fails instead of producing a near-color", () => {
    expect(() => hexToComponents("#xyz")).toThrow("six-digit sRGB hex");
    expect(() => componentsToHex([2, 0, 0])).toThrow("outside 0..1");
  });

  test("durations, dimensions, beziers and opacities validate", () => {
    expect(asDuration("150ms")).toBe("150ms");
    expect(() => asDuration("150")).toThrow("duration");
    expect(asDimension("8px")).toEqual({ value: 8, unit: "px" });
    expect(() => asDimension("8%")).toThrow("dimension");
    expect(asCubicBezier("cubic-bezier(0.2, 0, 0, 1)")).toEqual([0.2, 0, 0, 1]);
    expect(() => asCubicBezier("ease-in")).toThrow("cubic-bezier");
    expect(asOpacityNumber("8%")).toBe(0.08);
  });

  test("shadows parse the first layer; none parses to null", () => {
    expect(parseFirstShadow("none")).toBeNull();
    const parsed = parseFirstShadow(
      "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)",
    );
    if (!parsed) throw new Error("expected a parsed shadow");
    expect(parsed.offsetX).toEqual({ value: 0, unit: "px" });
    expect(parsed.offsetY).toEqual({ value: 1, unit: "px" });
    expect(parsed.blur).toEqual({ value: 2, unit: "px" });
    expect(parsed.color.alpha).toBe(0.3);
  });
});

const AUTHORING = {
  palettes: {
    primary: {
      500: { oklch: "oklch(55% 0.1 300)", srgb: "#6750a4" },
    },
  },
  typography: {
    webFamily: "Inter",
    family: "Inter",
    scale: {
      body: {
        size: "16px",
        lineHeight: "24px",
        tracking: "0px",
        weight: 400,
      },
    },
    scaleEmphasized: {},
    roles: {},
  },
  shape: { small: "8px" },
  elevation: {
    level1: {
      dp: 1,
      shadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      shadowDark: "none",
    },
  },
  motion: {
    easing: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
    duration: { short1: "50ms" },
    spring: { gentle: { stiffness: 1200, damping: 90 } },
    schemes: { standard: { easing: "standard" } },
  },
  states: { "hover-opacity": "8%" },
  spacing: { "space-100": "8px" },
};

const LIGHT = { primary: "#6750a4" };
const DARK = { primary: "#d0bcff" };

describe("export", () => {
  test("every foundation group is represented", () => {
    const doc = toDtcg({ tokens: AUTHORING, light: LIGHT, dark: DARK }) as {
      ref: Record<string, unknown>;
      sys: unknown;
    };
    for (const group of [
      "palette",
      "type",
      "shape",
      "elevation",
      "motion",
      "states",
      "spacing",
    ]) {
      expect(doc.ref[group], group).toBeDefined();
    }
    expect(doc.sys).toBeDefined();
  });

  test("the export validates against the implementation schema", () => {
    expect(
      validateDtcg(toDtcg({ tokens: AUTHORING, light: LIGHT, dark: DARK })),
    ).toEqual([]);
  });

  test("sys roles carry provenance, not bare values", () => {
    const doc = toDtcg({ tokens: AUTHORING, light: LIGHT, dark: DARK }) as {
      sys: {
        color: {
          light: Record<
            string,
            { $extensions: { "org.xoroh.kern": { role: string } } }
          >;
        };
      };
    };
    expect(doc.sys.color.light.primary.$extensions["org.xoroh.kern"].role).toBe(
      "primary",
    );
  });

  test("multi-layer shadows collapse to the first layer with the full CSS kept", () => {
    const doc = toDtcg({
      tokens: {
        ...AUTHORING,
        elevation: {
          level3: {
            dp: 6,
            shadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)",
            shadowDark: "none",
          },
        },
      },
      light: LIGHT,
      dark: DARK,
    }) as {
      ref: {
        elevation: {
          level3: {
            shadow: { $value: { blur: { value: number } } };
            $extensions: {
              "org.xoroh.kern": { css: string; multiLayer: boolean };
            };
          };
        };
      };
    };
    const level = doc.ref.elevation.level3;
    expect(level.shadow.$value.blur).toEqual({ value: 3, unit: "px" });
    expect(level.$extensions["org.xoroh.kern"].multiLayer).toBe(true);
    expect(level.$extensions["org.xoroh.kern"].css).toContain("0 4px 8px");
  });

  test("scheme selections are strings, never dangling aliases", () => {
    const doc = toDtcg({ tokens: AUTHORING, light: LIGHT, dark: DARK }) as {
      ref: {
        motion: { schemes: { standard: { easing: { $value: string } } } };
      };
    };
    expect(doc.ref.motion.schemes.standard.easing.$value).toBe("standard");
  });

  test("export is deterministic", () => {
    const a = JSON.stringify(
      toDtcg({ tokens: AUTHORING, light: LIGHT, dark: DARK }),
    );
    const b = JSON.stringify(
      toDtcg({ tokens: AUTHORING, light: LIGHT, dark: DARK }),
    );
    expect(a).toBe(b);
  });
});

describe("import", () => {
  const color = (hex: string) => ({
    $value: {
      colorSpace: "srgb",
      components: hexToComponents(hex),
      alpha: 1,
    },
    $type: "color",
  });

  test("values, aliases and extensions survive the round trip", () => {
    const exported = toDtcg({
      tokens: AUTHORING,
      light: LIGHT,
      dark: DARK,
    }) as unknown as Record<string, unknown>;
    // An alias in the source rides the round trip as a reference, not a copy.
    (exported.ref as unknown as Record<string, unknown>).alias = {
      $value: "{ref.palette.primary.500}",
      $type: "color",
    };
    const { graph, diagnostics } = fromDtcg(exported);
    expect(diagnostics).toEqual([]);
    expect(resolveAlias(graph, "ref.alias").value).toEqual({
      colorSpace: "srgb",
      components: hexToComponents("#6750a4"),
      alpha: 1,
    });
    const palette = graph.nodes.get("ref.palette.primary.500");
    if (!palette) throw new Error("missing palette node");
    expect(palette.extensions).toEqual({
      "org.xoroh.kern": { oklch: "oklch(55% 0.1 300)", srgb: "#6750a4" },
    });
  });

  test("malformed input is errors, not exceptions or silence", () => {
    const { diagnostics } = fromDtcg({
      color: { bad: { $value: "#000", $type: "color" } },
    });
    expect(diagnostics.length).toBeGreaterThan(0);
    expect(diagnostics.every((d) => d.severity === "error")).toBe(true);
  });

  test("an unknown type string is invalid", () => {
    const { diagnostics } = fromDtcg({
      spring: { gentle: { $value: { stiffness: 1 }, $type: "spring" } },
    });
    expect(diagnostics.some((d) => d.code === "unknown-type")).toBe(true);
  });

  test("a remote pointer is an error", () => {
    const { diagnostics } = fromDtcg({
      a: { $ref: "https://example.com/tokens.json#/color" },
    });
    expect(diagnostics.some((d) => d.code === "remote-pointer")).toBe(true);
  });

  test("a local pointer becomes a graph ref through the same resolution path", () => {
    const { graph, diagnostics } = fromDtcg({
      color: { base: color("#000000") },
      alias: { $ref: "#/color/base" },
    });
    expect(diagnostics).toEqual([]);
    expect(graph.nodes.get("alias")?.ref).toBe("color.base");
    expect(resolveAlias(graph, "alias").value).toEqual(color("#000000").$value);
  });

  test("$extends merges with the document winning", () => {
    const { graph, diagnostics } = fromDtcg({
      $extends: { color: { base: color("#000000") } },
      color: { extra: color("#ffffff") },
    });
    expect(diagnostics).toEqual([]);
    expect(graph.nodes.get("color.base")?.value).toEqual(
      color("#000000").$value,
    );
    expect(graph.nodes.get("color.extra")?.value).toEqual(
      color("#ffffff").$value,
    );
  });

  test("group $type inheritance is honored", () => {
    const { graph, diagnostics } = fromDtcg({
      color: { $type: "color", base: { $value: color("#000000").$value } },
    });
    expect(diagnostics).toEqual([]);
    expect(graph.nodes.get("color.base")?.type).toBe("color");
  });

  test("retained composites are notes, not errors and not drops", () => {
    const doc = {
      border: {
        heavy: {
          $type: "border",
          $value: { color: "#000", width: "1px", style: "solid" },
        },
      },
    };
    const notes = retainedNotes(doc);
    expect(notes).toHaveLength(1);
    expect(notes[0].severity).toBe("note");
    const { graph, diagnostics } = fromDtcg(doc);
    expect(diagnostics).toEqual(notes);
    expect(graph.nodes.get("border.heavy")).toBeDefined();
  });

  test("a cycle fails with the full chain", () => {
    const { graph, diagnostics } = fromDtcg({
      a: { $value: "{b}", $type: "color" },
      b: { $value: "{a}", $type: "color" },
    });
    expect(diagnostics).toEqual([]);
    expect(() => resolveAlias(graph, "a")).toThrow("a -> b -> a");
  });
});
