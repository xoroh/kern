import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tokens from "@xoroh/kern-tokens/tokens.json";
import { describe, expect, it } from "vitest";
import m3 from "./themes/material-3.json";

const THEME_DIR = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(
  join(THEME_DIR, "..", "..", "kern-tokens", "src", "tokens.css"),
  "utf8",
);

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
          css.includes(`--sys-color-${kebab(role)}: ${value};`),
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
      expect(css.includes(`--sys-shape-corner-${name}: ${value};`)).toBe(true);
    }
  });

  it("contains the dark elevation overrides", () => {
    // Skip DTCG metadata keys (`$comment`, `$schema`, …): the generator does not
    // emit them as custom properties, so neither should this assert.
    for (const level of Object.keys(tokens.elevation).filter(
      (key) => !key.startsWith("$"),
    )) {
      expect(css).toContain(`--sys-elevation-${level}:`);
    }
    // And no metadata key may leak into the emitted CSS as an invalid var name.
    expect(css).not.toMatch(/--sys-[a-z-]*-\$/);
    expect(css).toContain(".dark {");
  });
});

describe("comp-tokens.css refs resolve in tokens.css (spacing/icon-size regressions)", () => {
  const comp = readFileSync(
    join(THEME_DIR, "..", "..", "kern-tokens", "src", "comp-tokens.css"),
    "utf8",
  );
  const defined = new Set(
    [...css.matchAll(/--sys-[A-Za-z0-9-]+(?=\s*:)/g)].map((m) => m[0]),
  );
  // P2 batch 2: comp `typography` slots expand to five per-attribute vars
  // (`--comp-<c>-<slot>-font-size`, …), each referencing the matching
  // `--sys-typescale-<scale>-<attr>` var tokens.css emits. A single comp
  // var cannot hold five CSS properties, so the slot becomes five vars.
  const IN_SCOPE = /--sys-(color|spacing|shape-corner|elevation|typescale)-/;
  it("every in-scope comp var() target is defined in tokens.css", () => {
    const refs = [...comp.matchAll(/var\(\s*(--sys-[A-Za-z0-9-]+)\s*\)/g)].map(
      (m) => m[1],
    );
    expect(refs.length).toBeGreaterThan(0);
    for (const r of new Set(refs))
      if (IN_SCOPE.test(r)) expect(defined.has(r), r).toBe(true);
  });
  it("spacing refs keep the space- infix; no icon-color vars emitted", () => {
    expect(comp).not.toMatch(/var\(--sys-spacing-(?!space-)/);
    expect(comp).not.toMatch(/var\(--sys-color-icon-/);
  });
});
