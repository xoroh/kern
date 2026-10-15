import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Vitest runs headless: components see the stub. Jest (RNTL) uses the
      // real react-native via its own config — the two worlds never mix.
      "react-native": path.resolve(__dirname, "test-doubles/react-native.ts"),
      // Same split for vector art: real react-native-svg on device, the
      // prop-passthrough double under vitest.
      "react-native-svg": path.resolve(
        __dirname,
        "test-doubles/react-native-svg.ts",
      ),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 15000,
  },
});
