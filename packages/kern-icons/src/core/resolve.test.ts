/**
 * Runtime tests against the **real** committed registry.
 *
 * These assert the contract the two renderers rely on: every name in the union
 * resolves to paintable geometry on the 24x24 grid, the fill axis actually
 * changes something where it should, semantic aliases stay pinned, and unknown
 * names degrade to `null` rather than throwing inside a render.
 */

import { describe, expect, test } from "vitest";
import { useIcon } from "../render/useIcon";
import { ICON_MANIFEST } from "../sets/material/manifest";
import {
  BRAND_ICON_NAMES,
  ICON_NAMES,
  isIconName,
  MATERIAL_ICON_NAMES,
} from "../sets/material/names";
import { ICON_SHAPES, ICON_WEIGHTS } from "../sets/material/shapes";
import { resolveIconName } from "./naming";
import {
  DEFAULT_ICON_SET,
  getIconSet,
  listIconSets,
  registerIconSet,
} from "./registry";
import {
  assertIconName,
  getAvailableIconWeights,
  getIconShape,
  ICON_DEFAULT_COLOR,
  ICON_VIEW_BOX,
  resolveIconColor,
  resolveIconPaint,
  resolveIconSize,
  resolveIconWeight,
} from "./resolve";
import { SEMANTIC_ICONS } from "./semantic";
import type { ResolvedIcon } from "./types";
import { ICON_DEFAULT_WEIGHT, ICON_SIZE } from "./types";

/** `getIconShape` or a loud failure — keeps `!.` assertions out of the suite. */
function requireShape(
  name: string,
  options?: Parameters<typeof getIconShape>[1],
): ResolvedIcon {
  const shape = getIconShape(name, options);
  if (shape === null) throw new Error(`expected shape data for "${name}"`);
  return shape;
}

describe("catalog integrity", () => {
  test("the manifest matches what is actually committed", () => {
    expect(ICON_MANIFEST.viewBox).toBe(ICON_VIEW_BOX);
    expect(ICON_MANIFEST.viewBox).toBe("0 0 24 24");
    expect(ICON_MANIFEST.counts.total).toBe(ICON_NAMES.length);
    expect(ICON_MANIFEST.counts.total).toBeGreaterThan(0);
    expect(ICON_MANIFEST.counts.material).toBe(MATERIAL_ICON_NAMES.length);
    expect(ICON_MANIFEST.counts.brand).toBe(BRAND_ICON_NAMES.length);
    expect(ICON_MANIFEST.counts.total).toBe(
      ICON_MANIFEST.counts.material + ICON_MANIFEST.counts.brand,
    );
    expect(ICON_MANIFEST.defaultWeight).toBe(ICON_DEFAULT_WEIGHT);
    expect([...ICON_WEIGHTS]).toEqual([...ICON_MANIFEST.weights]);
  });

  test("names are unique, sorted, and canonical kebab-case", () => {
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
    for (const name of ICON_NAMES) {
      expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(isIconName(name)).toBe(true);
    }
  });

  test("every name resolves to non-empty geometry at the default weight", () => {
    for (const name of ICON_NAMES) {
      const shape = requireShape(name);
      expect(shape.d.length).toBeGreaterThan(0);
      expect(shape.d).toMatch(/^[Mm]/);
      expect(shape.d.startsWith("M") || shape.d.startsWith("m")).toBe(true);
      expect(shape.d).not.toContain("NaN");
      expect(shape.weight).toBe(ICON_DEFAULT_WEIGHT);
      expect(shape.filled).toBe(false);
    }
  });

  test("every shape is paintable path data on the 24x24 grid", () => {
    const map = ICON_SHAPES[400];
    if (map === undefined) throw new Error("expected shape data at weight 400");
    for (const name of ICON_NAMES) {
      const shape = map[name];
      if (shape === undefined) throw new Error(`missing shape for "${name}"`);
      expect(shape.o.length).toBeGreaterThan(0);
      expect(shape.o).toMatch(/^[Mm]/);
      expect(shape.o).not.toContain("NaN");
      // Geometry extents are asserted by `tools/check.ts`, which walks the path
      // and resolves relative commands. Scanning raw numbers here would be
      // wrong: a relative delta can legitimately exceed the icon size.
      if (shape.f !== undefined) expect(shape.f).toMatch(/^[Mm]/);
    }
  });

  test("the default set is registered and complete", () => {
    expect(DEFAULT_ICON_SET).toBe("material");
    const set = getIconSet(DEFAULT_ICON_SET);
    if (set === undefined) throw new Error("default set is not registered");
    expect(set.names.size).toBe(ICON_NAMES.length);
    for (const name of ICON_NAMES) expect(set.names.has(name)).toBe(true);
    expect(listIconSets()).toContain(DEFAULT_ICON_SET);
  });

  test("icons with a real filled variant expose distinct geometry", () => {
    const distinct = ICON_NAMES.filter((name) => {
      const map = ICON_SHAPES[400];
      if (map === undefined) return false;
      const shape = map[name];
      return (
        shape !== undefined && shape.f !== undefined && shape.f !== shape.o
      );
    });
    expect(distinct.length).toBe(
      ICON_MANIFEST.counts.total - ICON_MANIFEST.counts.filledReusesOutline,
    );
    expect(distinct).toContain("favorite");
  });
});

describe("fill axis", () => {
  test("filled switches to the FILL 1 geometry", () => {
    const outline = requireShape("favorite");
    const filled = requireShape("favorite", { filled: true });
    expect(filled.filled).toBe(true);
    expect(filled.d).not.toBe(outline.d);
    // The filled heart is solid, so it has strictly less path data than the
    // outlined one — the outline carries the inner counter-contour.
    expect(filled.d.length).toBeLessThan(outline.d.length);
  });

  test("filled is a no-op where upstream has no distinct variant", () => {
    const outline = requireShape("search");
    const filled = requireShape("search", { filled: true });
    expect(filled.d).toBe(outline.d);
    expect(filled.filledIsOutline).toBe(true);
  });

  test("filled defaults to false", () => {
    expect(requireShape("search").filled).toBe(false);
    expect(resolveIconPaint({ name: "search" })?.filled).toBe(false);
  });
});

describe("size resolution", () => {
  test("defaults to the canonical 24", () => {
    expect(resolveIconSize(undefined)).toBe(24);
    expect(ICON_SIZE.default).toBe(24);
    expect(ICON_VIEW_BOX.endsWith("24 24")).toBe(true);
  });

  test("resolves tokens and passes explicit numbers through", () => {
    expect(resolveIconSize("compact")).toBe(16);
    expect(resolveIconSize("small")).toBe(18);
    expect(resolveIconSize("medium")).toBe(20);
    expect(resolveIconSize("large")).toBe(32);
    expect(resolveIconSize("xlarge")).toBe(40);
    expect(resolveIconSize("display")).toBe(48);
    expect(resolveIconSize(30)).toBe(30);
    expect(resolveIconSize(0.5)).toBe(0.5);
  });

  test("falls back to 24 for nonsense sizes", () => {
    expect(resolveIconSize(0)).toBe(24);
    expect(resolveIconSize(-8)).toBe(24);
    expect(resolveIconSize(Number.NaN)).toBe(24);
    expect(resolveIconSize("nope" as never)).toBe(24);
  });
});

describe("colour resolution", () => {
  test("defaults to currentColor so icons follow the text role", () => {
    expect(ICON_DEFAULT_COLOR).toBe("currentColor");
    expect(resolveIconColor(undefined)).toBe("currentColor");
    expect(resolveIconColor("")).toBe("currentColor");
  });

  test("passes an explicit role through untouched", () => {
    expect(resolveIconColor("var(--md-sys-color-primary)")).toBe(
      "var(--md-sys-color-primary)",
    );
    expect(resolveIconColor("#0b57d0")).toBe("#0b57d0");
  });
});

describe("weight axis", () => {
  test("ships 400 — the 2px-equivalent baseline", () => {
    expect(getAvailableIconWeights()).toContain(400);
    expect(resolveIconWeight(undefined)).toBe(400);
    expect(resolveIconWeight(400)).toBe(400);
  });

  test("substitutes the nearest synced weight instead of failing", () => {
    // Only 400 is committed; a design asking for 300 must still render.
    expect(resolveIconWeight(300)).toBe(400);
    expect(requireShape("search", { weight: 100 }).weight).toBe(400);
    expect(requireShape("search", { weight: 100 }).weightSubstituted).toBe(
      true,
    );
    expect(requireShape("search", { weight: 400 }).weightSubstituted).toBe(
      false,
    );
  });
});

describe("name resolution", () => {
  test("accepts snake_case glyph names and kebab-case registry names", () => {
    expect(resolveIconName("arrow_back")).toEqual({
      set: "material",
      name: "arrow-back",
    });
    expect(resolveIconName("arrow-back")).toEqual({
      set: "material",
      name: "arrow-back",
    });
    expect(resolveIconName("add_shopping_cart")).toEqual({
      set: "material",
      name: "add-shopping-cart",
    });
  });

  test("resolves set:name qualifications", () => {
    expect(resolveIconName("material:search")).toEqual({
      set: "material",
      name: "search",
    });
    expect(resolveIconName("material:arrow_back")).toEqual({
      set: "material",
      name: "arrow-back",
    });
    expect(resolveIconName("nope:search")).toBeNull();
    expect(resolveIconName("material:nope")).toBeNull();
  });

  test("routes semantic aliases through their pinned targets", () => {
    for (const alias of Object.keys(SEMANTIC_ICONS)) {
      const resolved = resolveIconName(alias as keyof typeof SEMANTIC_ICONS);
      expect(resolved).not.toBeNull();
      if (resolved === null) continue;
      expect(resolved.set).toBe("material");
      expect(isIconName(resolved.name)).toBe(true);
    }
  });

  test("every semantic alias points at its declared set:name target", () => {
    let checked = 0;
    for (const [alias, target] of Object.entries(SEMANTIC_ICONS)) {
      const colon = target.indexOf(":");
      expect(colon).toBeGreaterThan(0);
      const expected = {
        set: target.slice(0, colon),
        name: target.slice(colon + 1),
      };
      expect(resolveIconName(alias)).toEqual(expected);
      checked++;
    }
    expect(checked).toBe(41);
  });

  test("the set prop only overrides unqualified names", () => {
    const set = getIconSet(DEFAULT_ICON_SET);
    if (set === undefined) throw new Error("default set is not registered");
    registerIconSet("extra", set);
    // A plain glyph name routes to the requested set…
    expect(resolveIconName("bolt", "extra")).toEqual({
      set: "extra",
      name: "bolt",
    });
    expect(resolveIconName("bolt")).toEqual({ set: "material", name: "bolt" });
    // …but `set:name` and semantic aliases carry their own set, because the
    // point of an alias is that `back` is one glyph on every surface.
    expect(resolveIconName("material:bolt", "extra")).toEqual({
      set: "material",
      name: "bolt",
    });
    expect(resolveIconName("search", "extra")).toEqual({
      set: "material",
      name: "search",
    });
    expect(listIconSets()).toContain("extra");
    expect(getIconSet("extra")).toBe(set);
  });

  test("registerIconSet replaces an existing set", () => {
    registerIconSet("replaceable", {
      names: new Set(["only"]),
      shapes: { 400: { only: { o: "M0 0Z" } } },
    });
    expect(getIconSet("replaceable")?.names.has("only")).toBe(true);
    registerIconSet("replaceable", {
      names: new Set(["other"]),
      shapes: { 400: { other: { o: "M1 1Z" } } },
    });
    expect(getIconSet("replaceable")?.names.has("other")).toBe(true);
    expect(getIconSet("replaceable")?.names.has("only")).toBe(false);
    expect(getIconShape("replaceable:other")).not.toBeNull();
  });
});

describe("unknown names degrade safely", () => {
  test("resolve to null rather than throwing inside a render", () => {
    expect(getIconShape("not-a-real-icon")).toBeNull();
    expect(getIconShape("")).toBeNull();
    expect(getIconShape("material:")).toBeNull();
    expect(resolveIconPaint({ name: "not-a-real-icon" as never })).toBeNull();
  });

  test("reject non-string and empty inputs at the name boundary", () => {
    expect(resolveIconName("")).toBeNull();
    expect(resolveIconName(null as never)).toBeNull();
    expect(resolveIconName(42 as never)).toBeNull();
    expect(resolveIconName(undefined as never)).toBeNull();
  });

  test("isIconName accepts committed names and nothing else", () => {
    expect(isIconName("search")).toBe(true);
    expect(isIconName("favorite")).toBe(true);
    expect(isIconName("not-a-real-icon")).toBe(false);
    expect(isIconName("Search")).toBe(false);
    expect(isIconName(7 as never)).toBe(false);
    expect(isIconName(null as never)).toBe(false);
  });

  test("assertIconName is the loud variant for build scripts", () => {
    expect(() => assertIconName("search")).not.toThrow();
    expect(() => assertIconName("not-a-real-icon")).toThrow(
      /not a valid IconName/,
    );
  });
});

describe("resolveIconPaint", () => {
  test("returns everything a renderer needs in one call", () => {
    const paint = resolveIconPaint({
      name: "favorite",
      filled: true,
      size: "large",
      color: "var(--md-sys-color-error)",
    });
    if (paint === null) throw new Error("expected paint for favorite");
    expect(paint.size).toBe(32);
    expect(paint.color).toBe("var(--md-sys-color-error)");
    expect(paint.filled).toBe(true);
    expect(paint.weight).toBe(400);
    expect(paint.fillRule).toBe("nonzero");
    expect(paint.d).toBe(requireShape("favorite", { filled: true }).d);
  });

  test("applies defaults when nothing is specified", () => {
    const paint = resolveIconPaint({ name: "search" });
    if (paint === null) throw new Error("expected paint for search");
    expect(paint.size).toBe(24);
    expect(paint.color).toBe("currentColor");
    expect(paint.filled).toBe(false);
    expect(paint.fillRule).toBe("nonzero");
  });

  test("propagates the evenodd rule when the source needs it", () => {
    for (const name of ICON_NAMES) {
      const paint = resolveIconPaint({ name });
      if (paint === null) throw new Error(`expected paint for "${name}"`);
      const map = ICON_SHAPES[400];
      const shape = map === undefined ? undefined : map[name];
      if (shape === undefined) throw new Error(`missing shape for "${name}"`);
      expect(paint.fillRule).toBe(
        shape.r === "evenodd" ? "evenodd" : "nonzero",
      );
    }
  });

  test("useIcon is pure paint resolution — same output as resolveIconPaint", () => {
    expect(
      useIcon({
        name: "favorite",
        filled: true,
        size: "medium",
        color: "#111",
      }),
    ).toEqual(
      resolveIconPaint({
        name: "favorite",
        filled: true,
        size: "medium",
        color: "#111",
      }),
    );
    expect(useIcon({ name: "not-a-real-icon" as never })).toBeNull();
  });
});
