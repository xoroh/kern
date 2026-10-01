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
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // jsdom per file is heavy; testTimeout covers loaded machines.
    // Bound workers via CLI: vitest run --maxWorkers 4
    testTimeout: 15000,
  },
});
