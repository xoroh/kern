/**
 * preload-rn.mjs — bun-side mirror of the vite.config `react-native` alias.
 *
 * The site builds for web with `react-native` aliased to `react-native-web`
 * (vite.config). Scripts running under bun need the same alias: the real
 * `react-native` entry is Flow-typed source no JS runtime can parse, and
 * since the kern→Axis cutover the `@xoroh/kern` dist re-exports the
 * `@xoroh/axis` barrel, so any script reaching the component registry pulls
 * it in. This preload re-exports the real react-native-web module
 * object — no stubs, no enumeration to rot. Use:
 *   bun --preload ./scripts/preload-rn.mjs scripts/<x>.mjs
 */
import { plugin } from "bun";
import * as web from "react-native-web";

plugin({
  name: "rn-alias",
  setup(build) {
    // CommonJS dependencies require a synchronous module factory.
    build.module("react-native", () => {
      return { loader: "object", exports: { ...web } };
    });
    // Match Vite's real SVG web renderer rather than loading native fabric views.
    build.module("react-native-svg", async () => {
      const svg = await import("react-native-svg/lib/module/elements.web.js");
      return { loader: "object", exports: { ...svg, default: svg.Svg } };
    });
  },
});
