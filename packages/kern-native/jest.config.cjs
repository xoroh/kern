const path = require("node:path");

// Run with NODE_OPTIONS=--preserve-symlinks (see the package `test` script):
// bun's store realpaths nest node_modules and defeat every classic
// react-native jest pattern. With symlinks preserved the standard layout
// holds and the RN preset just works.
module.exports = {
  preset: "react-native",
  testMatch: ["**/*.rntest.ts?(x)"],
  setupFiles: [path.join(__dirname, "jest.setup.cjs")],
  moduleNameMapper: {
    "^react$": path.join(__dirname, "node_modules/react"),
    "^react/jsx-runtime$": path.join(
      __dirname,
      "node_modules/react/jsx-runtime",
    ),
    "^react/jsx-dev-runtime$": path.join(
      __dirname,
      "node_modules/react/jsx-dev-runtime",
    ),
  },
};
