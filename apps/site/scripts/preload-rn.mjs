/**
 * preload-rn.mjs — bun-side mirror of the vite.config `react-native` alias.
 *
 * The site builds for web with `react-native` aliased to `react-native-web`
 * (vite.config). Scripts that import the mobile demo registry under bun need
 * the same alias, or the import fails with "Cannot find package
 * 'react-native'". This preload re-exports the real react-native-web module
 * object — no stubs, no enumeration to rot. Use:
 *   bun --preload ./scripts/preload-rn.mjs scripts/<x>.mjs
 */
import { plugin } from "bun";

plugin({
  name: "rn-alias",
  setup(build) {
    build.module("react-native", async () => {
      const web = await import("react-native-web");
      return { loader: "object", exports: { ...web } };
    });
  },
});
