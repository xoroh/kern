import { describe, expect, it } from "bun:test";
import { type HighlightLanguage, tokenize } from "./highlight";

/**
 * The tokenizer only classifies — joining every token must reproduce the
 * source byte-for-byte. A highlighter that eats whitespace or drops a
 * character teaches the wrong code, so the round-trip is asserted on every
 * fixture, not just the classification.
 */
function textOf(source: string, language: HighlightLanguage): string {
  return tokenize(source, language)
    .map((t) => t.text)
    .join("");
}

function classesOf(source: string, language: HighlightLanguage): string[] {
  return tokenize(source, language)
    .filter((t) => t.cls !== null)
    .map((t) => `${t.text}=>${t.cls}`);
}

describe("tsx", () => {
  const src = `import { Button } from "@xoroh/kern";

// Five variants, no more.
export function Actions({ count = 0 }: { count?: number }) {
  return <Button variant="elevated" disabled={count > 0}>Save</Button>;
}`;

  it("round-trips the source exactly", () => {
    expect(textOf(src, "tsx")).toBe(src);
  });

  it("classifies keywords, strings, comments, tags, attrs, numbers", () => {
    const got = classesOf(src, "tsx");
    expect(got).toContain("import=>tok-keyword");
    expect(got).toContain("export=>tok-keyword");
    expect(got).toContain('"@xoroh/kern"=>tok-string');
    expect(got).toContain("// Five variants, no more.=>tok-comment");
    expect(got).toContain("Button=>tok-tag");
    expect(got).toContain("variant=>tok-attr");
    expect(got).toContain("0=>tok-number");
  });

  it("booleans read as literals, capitalized types as types", () => {
    const got = classesOf("const on = true;\nlet w: Mode = null;", "tsx");
    expect(got).toContain("true=>tok-number");
    expect(got).toContain("null=>tok-number");
    expect(got).toContain("Mode=>tok-type");
  });

  it("member-expression tags color as one tag", () => {
    const got = classesOf("<Field.Label>Email</Field.Label>", "tsx");
    expect(got).toContain("Field.Label=>tok-tag");
  });

  it("a fence containing < never becomes markup", () => {
    const tokens = tokenize("<Button>1 < 2</Button>", "tsx");
    expect(tokens.map((t) => t.text).join("")).toBe("<Button>1 < 2</Button>");
  });
});

describe("bash", () => {
  const src = `bun add @xoroh/kern @xoroh/kern-tokens
npm i @xoroh/kern --save-dev # until publish
kern add button --platform native && kern diff`;

  it("round-trips the source exactly", () => {
    expect(textOf(src, "bash")).toBe(src);
  });

  it("classifies commands, flags, operators, trailing comments", () => {
    const got = classesOf(src, "bash");
    expect(got).toContain("bun=>tok-command");
    expect(got).toContain("npm=>tok-command");
    expect(got).toContain("--save-dev=>tok-flag");
    expect(got).toContain("--platform=>tok-flag");
    expect(got).toContain("&&=>tok-operator");
    expect(got).toContain("# until publish=>tok-comment");
  });

  it("quoted values stay whole strings", () => {
    const got = classesOf('kern add "my button" --dest ./out', "bash");
    expect(got).toContain('"my button"=>tok-string');
  });
});

describe("css", () => {
  const src = `/* the only required import */
@import "@xoroh/kern-tokens/theme";
.stage { color: var(--sys-color-primary); }`;

  it("round-trips the source exactly", () => {
    expect(textOf(src, "css")).toBe(src);
  });

  it("classifies at-rules, strings, comments, selectors, properties", () => {
    const got = classesOf(src, "css");
    expect(got).toContain("@import=>tok-keyword");
    expect(got).toContain('"@xoroh/kern-tokens/theme"=>tok-string');
    expect(got).toContain("/* the only required import */=>tok-comment");
    expect(got).toContain(".stage=>tok-tag");
    expect(got).toContain("color=>tok-attr");
  });
});

describe("json", () => {
  const src = `// any MCP host: Claude Code, Cursor, VS Code, Zed
{
  "mcpServers": {
    "kern": { "command": "bunx", "args": ["@xoroh/kern-mcp", "--fresh"] }
  }
}`;

  it("round-trips the source exactly", () => {
    expect(textOf(src, "json")).toBe(src);
  });

  it("classifies keys, strings, comments, literals", () => {
    const got = classesOf(src, "json");
    expect(got).toContain('"mcpServers"=>tok-type');
    expect(got).toContain('"command"=>tok-type');
    expect(got).toContain('"bunx"=>tok-string');
    expect(got).toContain('"@xoroh/kern-mcp"=>tok-string');
    expect(got).toContain(
      "// any MCP host: Claude Code, Cursor, VS Code, Zed=>tok-comment",
    );
  });

  it("numbers and booleans color, punctuation stays base ink", () => {
    const got = classesOf(
      `{ "version": 2, "pinned": true, "x": null }`,
      "json",
    );
    expect(got).toContain("2=>tok-number");
    expect(got).toContain("true=>tok-keyword");
    expect(got).toContain("null=>tok-keyword");
    // classesOf drops unclassified tokens, so base-ink punctuation shows
    // only as an ABSENCE — no token is just a brace or a colon.
    expect(got.filter((c) => /^[":{}[\],]+=>/.test(c)).length).toBe(0);
  });
});

/** sRGB relative luminance (WCAG 2.2, same math as check-contrast.mjs). */
function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = Number.parseInt(hex.slice(i + 1, i + 3), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("code theme contrast", () => {
  /**
   * Every tok-* class against the code surface (surface-container-high) in
   * both modes, WCAG 2.2 AA for text (4.5:1). The mapping is role-based —
   * `styles.css` paints each class from a `--sys-color-*` role, so light and
   * dark fall out of the token layer with no extra hex. The hexes below are
   * the compiled default-theme values in
   * `packages/kern-tokens/src/tokens.css` (`:root` + `.dark`), recorded so a
   * token regeneration that moves a value fails here rather than silently
   * shipping unreadable code. Measured ratios: light >= 5.1, dark >= 10.5.
   */
  const codeBg = { light: "#e5e5e5", dark: "#171717" };
  const roles = {
    // tok-keyword, tok-tag, tok-command: primary.
    "tok-keyword": { light: "#6750a4", dark: "#d0bcff" },
    // tok-string: tertiary.
    "tok-string": { light: "#7d5260", dark: "#efb8c8" },
    // tok-number, tok-type, tok-flag: secondary.
    "tok-number": { light: "#625b71", dark: "#ccc2dc" },
    "tok-tag": { light: "#6750a4", dark: "#d0bcff" },
    "tok-type": { light: "#625b71", dark: "#ccc2dc" },
    // tok-attr stays in the base ink so prop values pop, not names.
    "tok-command": { light: "#6750a4", dark: "#d0bcff" },
    "tok-flag": { light: "#625b71", dark: "#ccc2dc" },
    // tok-comment, tok-operator: on-surface-variant.
    "tok-comment": { light: "#525252", dark: "#d4d4d4" },
    "tok-operator": { light: "#525252", dark: "#d4d4d4" },
  };
  for (const [cls, hex] of Object.entries(roles)) {
    it(`${cls} passes AA on the code surface, light and dark`, () => {
      expect(ratio(hex.light, codeBg.light)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(hex.dark, codeBg.dark)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
