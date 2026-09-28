import type { AstroIntegration } from "astro";
import { tokens } from "@xoroh/kern/tokens";

export type KernEmdashOptions = {
  /** Theme preset applied to every page. Defaults to the M3 theme. */
  theme?: "m3" | "sharp" | "brand";
};

/**
 * Astro integration wiring Kern into an EmDash theme.
 *
 * Injects the Kern theme stylesheet and exposes the shared tokens to
 * Astro components. Requires `@astrojs/react` in the host project for
 * interactive (hydrated) components — static components render as HTML.
 *
 * Tested against `emdash@0.1.x` (beta). Re-verify on each EmDash minor.
 */
export function kernEmdash(options: KernEmdashOptions = {}): AstroIntegration {
  const theme = options.theme ?? "m3";

  return {
    name: "@xoroh/kern-emdash",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        injectScript(
          "page-ssr",
          `import "@xoroh/kern/theme"; globalThis.__KERN_THEME__ = ${JSON.stringify(theme)};`,
        );
      },
    },
  };
}

export { tokens };
