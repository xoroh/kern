import { describe, expect, test } from "bun:test";
import { codeOnly } from "./source-code.mjs";

describe("code-only source", () => {
  test("comments drop out; code, strings and line numbers survive", () => {
    const source = [
      '// import x from "themes/sharp.json"',
      '/* readFileSync("themes/brand.json") */',
      'const label = "themes/demo.json";',
      'const real = "rounded-(--sys-shape-corner-large)";',
    ].join("\n");
    const code = codeOnly(source);
    expect(code).not.toContain("sharp.json");
    expect(code).not.toContain("brand.json");
    expect(code).toContain('"themes/demo.json"');
    expect(code).toContain("rounded-(--sys-shape-corner-large)");
    expect(code.split("\n").length).toBe(source.split("\n").length);
  });

  test("a url or a double slash inside a string is never treated as a comment", () => {
    const source = 'const url = "https://m3.material.io//styles";';
    expect(codeOnly(source)).toBe(source);
  });

  test("backtick templates keep their literal text", () => {
    // Split so no source literal contains "${": the runtime value stays the
    // template `themes/${preset}.json`, which is what codeOnly must preserve.
    const source = "const t = `themes/$" + "{preset}.json`;";
    expect(codeOnly(source)).toBe("const t = `themes/$" + "{preset}.json`;");
  });
});
