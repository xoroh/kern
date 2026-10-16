import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // The cross-renderer parity contract lives at the repo root, outside any
      // package, so neither @xoroh/kern nor @xoroh/kern-native imports the
      // other to read it (ADR 002). Both test suites alias it from here.
      // `fileURLToPath` keeps this correct on any platform; a bare relative
      // string would not.
      "@kern-parity/contract": fileURLToPath(
        new URL("../../parity/contract.ts", import.meta.url),
      ),
      // Cutover consequence: the web components import behavior models from
      // the `@xoroh/axis` barrel, and the barrel's rendered modules import
      // `react-native` at top level. Under a web bundler the unused RN
      // modules shake away; under vitest the whole graph loads, and the
      // real `react-native` entry is Flow-typed source Node cannot parse.
      // Alias to react-native-web — the same surface the site serves in
      // production — so the models under test resolve against the web
      // implementation. Declared devDependency, never a runtime import.
      "react-native": fileURLToPath(import.meta.resolve("react-native-web")),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // jsdom per file is heavy; testTimeout covers loaded machines.
    // Bound workers via CLI: vitest run --maxWorkers 4
    testTimeout: 15000,
    server: {
      deps: {
        // `@xoroh/axis` ships as compiled dist (vendored pre-publish
        // tarball): externalizing it would load the real Flow-typed
        // react-native in plain Node. Inline it so the transform runs and
        // the `react-native` alias above applies. (Same split as
        // kern-native's vitest config.)
        inline: [/@xoroh\/axis/],
      },
    },
  },
});
