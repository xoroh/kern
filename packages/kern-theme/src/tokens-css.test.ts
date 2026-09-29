import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import m3 from "./themes/m3.json";
import tokens from "./tokens.json";

const THEME_DIR = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(THEME_DIR, "tokens.css"), "utf8");

const kebab = (name: string) =>
  name.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();

/**
 * The generated stylesheet is the artifact every web consumer actually
 * loads. These assertions fail on drift between the JSON sources and the
 * committed CSS, which unit tests against the resolver cannot see.
 */
describe("tokens.css matches the JSON sources", () => {
  it("contains every light and dark color role", () => {
    for (const mode of ["light", "dark"] as const) {
      for (const [role, value] of Object.entries(m3.color[mode])) {
        expect(
          css.includes(`--md-sys-color-${kebab(role)}: ${value};`),
          `${mode}.${role}`,
        ).toBe(true);
      }
    }
  });

  it("covers light and dark with the same role keys", () => {
    expect(Object.keys(m3.color.dark).sort()).toEqual(
      Object.keys(m3.color.light).sort(),
    );
  });

  it("contains every shape token", () => {
    for (const [name, value] of Object.entries(tokens.shape)) {
      expect(css.includes(`--md-sys-shape-corner-${name}: ${value};`)).toBe(
        true,
      );
    }
  });

  it("contains the dark elevation overrides", () => {
    for (const level of Object.keys(tokens.elevation)) {
      expect(css).toContain(`--md-sys-elevation-${level}:`);
    }
    expect(css).toContain(".dark {");
  });
});
