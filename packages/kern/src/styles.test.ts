import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = join(HERE, "..");
const TOKENS_CSS = join(PKG, "..", "kern-tokens", "src", "tokens.css");

/**
 * Public stylesheet contract (KERN-033).
 *
 * `./theme` is the compatibility entry (token vars + animations, forwarding
 * to the token package). `./styles` is the compiled entry: everything inlined,
 * importable from a tarball with no checkout scan. Both must resolve, both
 * must carry the keyframes, and neither may reference a package that does not
 * exist — D01 was exactly that, and it shipped.
 */
describe("public styles", () => {
  test("./theme forwards to the token package, not to a ghost", () => {
    const theme = readFileSync(join(PKG, "src", "theme.css"), "utf8");
    expect(theme).toContain('@import "@xoroh/kern-tokens/theme";');
    expect(theme).not.toContain("@xoroh/kern-theme");
  });

  test("./styles is compiled: token vars plus all keyframes, inlined", () => {
    const styles = readFileSync(join(PKG, "src", "styles.css"), "utf8");
    expect(styles).toContain("--md-sys-color-primary: #6750a4;");
    for (const frame of [
      "kern-linear-indeterminate",
      "kern-linear-four-color",
      "kern-circular-rotate",
      "kern-circular-four-color",
    ]) {
      expect(styles, frame).toContain(`@keyframes ${frame}`);
    }
    // No unresolved imports except the documented font entry, which CSS
    // requires first.
    const imports = [...styles.matchAll(/^@import\s+"([^"]+)";/gm)].map(
      (m) => m[1],
    );
    expect(imports).toEqual(["@fontsource-variable/inter"]);
  });

  test("styles.css traces to its two sources byte-for-byte", () => {
    const styles = readFileSync(join(PKG, "src", "styles.css"), "utf8");
    const tokensCss = readFileSync(TOKENS_CSS, "utf8").trim();
    const theme = readFileSync(join(PKG, "src", "theme.css"), "utf8");
    const keyframes = theme.split("\n").slice(1).join("\n").trim();
    expect(styles).toContain(tokensCss);
    expect(styles).toContain(keyframes);
  });

  test("the package manifest publishes both entries", () => {
    const manifest = JSON.parse(
      readFileSync(join(PKG, "package.json"), "utf8"),
    );
    expect(manifest.exports["./theme"]).toBe("./src/theme.css");
    expect(manifest.exports["./styles"]).toBe("./src/styles.css");
    expect(existsSync(join(PKG, "src", "styles.css"))).toBe(true);
  });
});
