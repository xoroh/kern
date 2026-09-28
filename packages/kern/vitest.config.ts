import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // jsdom per file is heavy; testTimeout covers loaded machines.
    // Bound workers via CLI: vitest run --maxWorkers 4
    testTimeout: 15000,
  },
});
