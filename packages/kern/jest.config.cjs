// Bun workspaces isolate node_modules under .bun/, where path-based
// transformIgnorePatterns cannot allowlist reliably. Transform everything
// instead — slower cold start, cached after. Revisit if the suite grows.
const path = require("node:path");

const rnRoot = path.dirname(
  require.resolve("react-native/package.json", {
    paths: [__dirname],
  }),
);

module.exports = {
  testMatch: ["**/*.rntest.[jt]s?(x)"],
  moduleNameMapper: {
    "^.*/Utilities/Platform$": path.join(
      rnRoot,
      "Libraries/Utilities/Platform.ios.js",
    ),
  },
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  globals: { __DEV__: true },
  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      { presets: ["@react-native/babel-preset"] },
    ],
  },
  transformIgnorePatterns: [],
};
