import { describe, expect, test } from "vitest";

import {
  brandIconName,
  CHUNK_IDS,
  compareIconNames,
  isValidIconName,
  sortIconNames,
  splitMaterialStem,
  toChunkId,
  toKebab,
  toMaterialFileStem,
  toObjectKey,
  toPascalCase,
} from "./naming";

describe("splitMaterialStem", () => {
  test("splits the fill axis on the hyphen suffix", () => {
    expect(splitMaterialStem("search.svg")).toEqual({
      name: "search",
      filled: false,
    });
    expect(splitMaterialStem("search-fill.svg")).toEqual({
      name: "search",
      filled: true,
    });
    expect(splitMaterialStem("add_shopping_cart-fill.svg")).toEqual({
      name: "add-shopping-cart",
      filled: true,
    });
  });

  test('never mistakes a name ending in "fill" for the filled axis', () => {
    // Upstream names are snake_case, so the hyphen suffix is unambiguous —
    // `format_color_fill` is an icon in its own right, not FILL 1 of
    // a hypothetical `format-color`.
    expect(splitMaterialStem("format_color_fill.svg")).toEqual({
      name: "format-color-fill",
      filled: false,
    });
    expect(splitMaterialStem("format_color_fill-fill.svg")).toEqual({
      name: "format-color-fill",
      filled: true,
    });
  });
});

describe("brandIconName", () => {
  test("uses the stem verbatim because the fill axis lives in the directory", () => {
    expect(brandIconName("mark.svg")).toBe("mark");
    expect(brandIconName("color-fill.svg")).toBe("color-fill");
    expect(brandIconName("Super_App.svg")).toBe("super-app");
  });
});

describe("isValidIconName", () => {
  test("accepts canonical kebab-case, digits included", () => {
    for (const name of [
      "search",
      "add-shopping-cart",
      "10k",
      "360",
      "3d-rotation",
      "a",
    ]) {
      expect(isValidIconName(name)).toBe(true);
    }
  });

  test("rejects anything else", () => {
    for (const name of [
      "Search",
      "add_shopping_cart",
      "-search",
      "search-",
      "",
      "a--b",
      "café",
      "a b",
    ]) {
      expect(isValidIconName(name)).toBe(false);
    }
  });
});

describe("identifier derivation", () => {
  test("builds PascalCase words from kebab-case names", () => {
    expect(toPascalCase("add-shopping-cart")).toBe("AddShoppingCart");
    expect(toPascalCase("10k")).toBe("10k");
    expect(toPascalCase("3d-rotation")).toBe("3dRotation");
  });

  test("quotes object keys only when required", () => {
    expect(toObjectKey("search")).toBe("search");
    expect(toObjectKey("add-shopping-cart")).toBe('"add-shopping-cart"');
    expect(toObjectKey("10k")).toBe('"10k"');
  });

  test("round-trips between canonical names and upstream stems", () => {
    expect(toMaterialFileStem("add-shopping-cart")).toBe("add_shopping_cart");
    expect(toKebab("add_shopping_cart")).toBe("add-shopping-cart");
  });
});

describe("chunking", () => {
  test("buckets digits together and letters by first character", () => {
    expect(toChunkId("10k")).toBe("0");
    expect(toChunkId("360")).toBe("0");
    expect(toChunkId("search")).toBe("s");
    expect(CHUNK_IDS[0]).toBe("0");
    expect(CHUNK_IDS).toHaveLength(27);
  });

  test("sorts by chunk order, then code units", () => {
    expect(sortIconNames(["search", "10k", "add", "zoom-in", "360"])).toEqual([
      "10k",
      "360",
      "add",
      "search",
      "zoom-in",
    ]);
  });

  test("orders hyphenated names by code units, independent of locale", () => {
    // `localeCompare` puts "a-b" and "ab" in ICU order; a byte diff needs
    // '-' (0x2d) to sort before 'b' (0x62).
    expect(compareIconNames("a-b", "ab")).toBeLessThan(0);
    expect(sortIconNames(["ab", "a-b", "a0"])).toEqual(["a-b", "a0", "ab"]);
  });

  test("does not mutate its input", () => {
    const input = ["b", "a"];
    sortIconNames(input);
    expect(input).toEqual(["b", "a"]);
  });
});
