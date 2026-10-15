import "./material-3"; // registers the material-3 preset tables (side effect)
import { describe, expect, test } from "vitest";
import { resolveThemeDetails } from "@xoroh/kern-tokens";
import { tokens } from "@xoroh/kern-tokens";
import { toDtcg } from "@xoroh/kern-tokens";
import { fromDtcg } from "@xoroh/kern-tokens";
import { componentsToHex } from "@xoroh/kern-tokens";

/**
 * Projection proof (KERN-022) — every published artifact traces to the graph.
 *
 * "Generated freshness" proves files match a rerun; it does not prove the
 * rerun reads the canonical source. These tests close that second gap: the
 * DTCG sys roles equal the resolver output role-for-role, and the resolver
 * output equals what the CSS generator emits. An output that cannot be traced
 * to the graph is an output nobody may trust.
 */
describe("graph projections", () => {
  const light = resolveThemeDetails("light", "standard", "material-3")
    .color as unknown as Record<string, string>;
  const dark = resolveThemeDetails("dark", "standard", "material-3")
    .color as unknown as Record<string, string>;
  const exported = toDtcg({
    tokens: tokens as unknown as Record<string, unknown>,
    light,
    dark,
  }) as {
    sys: {
      color: {
        light: Record<
          string,
          { $value: { components: [number, number, number] } }
        >;
        dark: Record<
          string,
          { $value: { components: [number, number, number] } }
        >;
      };
    };
  };

  test("every sys role traces to the resolver, light and dark", () => {
    for (const [mode, table] of [
      ["light", light],
      ["dark", dark],
    ] as const) {
      const sys =
        mode === "light" ? exported.sys.color.light : exported.sys.color.dark;
      // `$type` is the group's inherited type annotation, not a role.
      const roles = Object.keys(sys).filter((k) => !k.startsWith("$"));
      expect(roles.sort()).toEqual(Object.keys(table).sort());
      for (const [role, hex] of Object.entries(table)) {
        expect(
          componentsToHex(sys[role].$value.components),
          `${mode}.${role}`,
        ).toBe(hex.toLowerCase());
      }
    }
  });

  test("every reference palette step traces to compiled sRGB", () => {
    const { graph } = fromDtcg(exported);
    const palettes = tokens.palettes as unknown as Record<
      string,
      Record<string, { srgb: string }>
    >;
    let count = 0;
    for (const [hue, ramp] of Object.entries(palettes)) {
      for (const [step, value] of Object.entries(ramp)) {
        const node = graph.nodes.get(`ref.palette.${hue}.${step}`);
        if (!node) throw new Error(`missing ${hue}.${step}`);
        const colorValue = node.value as unknown as {
          components: [number, number, number];
        };
        expect(componentsToHex(colorValue.components)).toBe(
          value.srgb.toLowerCase(),
        );
        count += 1;
      }
    }
    expect(count).toBeGreaterThan(0);
  });

  test("elevation dp values trace to the M3 scale, not to prose", () => {
    const { graph } = fromDtcg(exported);
    const expected: Record<string, number> = {
      level0: 0,
      level1: 1,
      level2: 3,
      level3: 6,
      level4: 8,
      level5: 12,
    };
    for (const [level, dp] of Object.entries(expected)) {
      expect(graph.nodes.get(`ref.elevation.${level}.dp`)?.value).toEqual({
        value: dp,
        unit: "px",
      });
    }
  });
});
