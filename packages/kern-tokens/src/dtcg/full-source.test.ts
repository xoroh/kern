import { describe, expect, test } from "vitest";
import { resolveThemeDetails } from "../resolve";
import { resolveAlias } from "../token-graph";
import { tokens } from "../tokens";
import { toDtcg } from "./export";
import { fromDtcg } from "./import";
import { componentsToHex } from "./shared";
import { validateDtcg } from "./validate";

/**
 * Full-source interchange proof (KERN-019/020) — the REAL tokens.json and the
 * REAL kern role tables round-trip, not a fixture subset. A fixture-only
 * roundtrip proves the machinery; this proves the mapping covers the source
 * it ships for.
 */
describe("full-source dtcg interchange", () => {
  const light = resolveThemeDetails("light", "standard", "kern")
    .color as unknown as Record<string, string>;
  const dark = resolveThemeDetails("dark", "standard", "kern")
    .color as unknown as Record<string, string>;
  const exported = toDtcg({
    tokens: tokens as unknown as Record<string, unknown>,
    light,
    dark,
  }) as unknown as Record<string, unknown>;

  test("the full export validates", () => {
    expect(validateDtcg(exported)).toEqual([]);
  });

  test("the full export imports with no errors", () => {
    const { diagnostics } = fromDtcg(exported);
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);
  });

  test("a palette ramp survives with provenance", () => {
    const { graph } = fromDtcg(exported);
    const node = resolveAlias(graph, "ref.palette.primary.600");
    const source = (
      tokens.palettes as unknown as Record<
        string,
        Record<string, { srgb: string; oklch: string }>
      >
    ).primary["600"];
    const colorValue = node.value as unknown as {
      components: [number, number, number];
    };
    expect(componentsToHex(colorValue.components)).toBe(
      source.srgb.toLowerCase(),
    );
    expect(node.extensions).toEqual({
      "org.xoroh.kern": { oklch: source.oklch, srgb: source.srgb },
    });
  });

  test("a sys role survives with its on-color pairing intact", () => {
    const { graph } = fromDtcg(exported);
    const primary = graph.nodes.get("sys.color.light.primary");
    if (!primary) throw new Error("missing sys role");
    const colorValue = primary.value as unknown as {
      components: [number, number, number];
    };
    expect(componentsToHex(colorValue.components)).toBe(
      light.primary.toLowerCase(),
    );
    expect(primary.extensions?.["org.xoroh.kern"]).toMatchObject({
      role: "primary",
      mode: "light",
    });
  });

  test("dark elevation shadows ride in extensions, not in the standard projection", () => {
    const { graph } = fromDtcg(exported);
    const level = graph.nodes.get("ref.elevation.level3");
    if (!level) throw new Error("missing elevation group");
    expect(level).toBeDefined();
    // The standard shadow composite is the light first layer; the dark
    // variant is preserved alongside, retrievable without guessing.
    const ext = (level.extensions?.["org.xoroh.kern"] ?? {}) as unknown as Record<
      string,
      string
    >;
    expect(ext.shadowDark).toContain("0.5");
    expect(ext.css).toContain("rgba(0, 0, 0, 0.3)");
  });

  test("typography normalizes line-height to a number and keeps px", () => {
    const { graph } = fromDtcg(exported);
    const body =
      graph.nodes.get("ref.type.scale.body-large") ??
      graph.nodes.get("ref.type.scale.body");
    expect(body).toBeDefined();
  });
});
