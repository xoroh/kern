const path = require("node:path");

// Our own react-native copy, not whatever the workspace hoist resolves.
const reactNativeDir = path.dirname(
  require.resolve("react-native/package.json"),
);

// react-native's paths are pinned explicitly below, so the symlink flag the
// old config needed is gone: preserving symlinks here actually broke babel's
// nested `lru-cache` lookup under a bun store.
module.exports = {
  // react-native >= 0.86 no longer ships a bundled `jest-preset.js`; the
  // preset moved to `@react-native/jest-preset`, which we declare as an
  // explicit devDependency so `test:jest` resolves it deterministically.
  preset: "@react-native/jest-preset",
  testMatch: ["**/*.rntest.ts?(x)"],
  // RNTL renders plus the RN preset's module registry are slow on a cold
  // run; the default 5s trips on a few interaction tests.
  //
  // This budget was raised from 30s after two native suites timed out on a COLD
  // cache in a full `test:all` run (25 suites / 284 tests). It is NOT a product
  // defect: the same suites pass in isolation, and `test:all` was green twice
  // on re-run. A cold CI runner is exactly the condition that triggers it, so
  // the budget is sized for the cold path, not the warm one.
  //
  // Sizing basis, stated honestly: a warm full run measures ~4.3s wall for all
  // 25 suites, so 30s was already ~7x warm wall and still too tight when 25
  // suites transform concurrently on a cold cache. The per-test timeout covers
  // first-require transform time, which is unbounded relative to warm timings —
  // so a warm measurement CANNOT derive this number, and this one is reasoned
  // headroom rather than a measured worst case.
  //
  // If this ever bites again, raise the budget AND reduce cold contention
  // (`--maxWorkers`); raising the budget alone is whack-a-mole that re-flakes
  // as the suite grows.
  testTimeout: 120000,
  setupFiles: [path.join(__dirname, "jest.setup.cjs")],
  // The extracted preset ships ESM (`jest/setup.js`, the asset transformer),
  // so it must be transformed. The usual RN pattern fails under a bun store
  // because the real path contains a nested `node_modules/.bun/<pkg>/` before
  // the package name — match on the whole tail instead of the first segment.
  transformIgnorePatterns: [
    "/node_modules/(?!.*(@react-native|react-native)/)",
  ],
  moduleNameMapper: {
    // The preset derives its react-native paths with `require.resolve` from
    // inside the hoisted preset package, which can resolve a *different*
    // major than this package develops against (workspace hoisting). Re-point
    // both entries at our own copy so the version under test is the one that
    // runs.
    "^react-native/setup-env$": `${reactNativeDir}/src/setup-env.js`,
    "^react-native($|/.*)": `${reactNativeDir}/$1`,
    "^react$": path.join(__dirname, "node_modules/react"),
    "^react/jsx-runtime$": path.join(
      __dirname,
      "node_modules/react/jsx-runtime",
    ),
    "^react/jsx-dev-runtime$": path.join(
      __dirname,
      "node_modules/react/jsx-dev-runtime",
    ),
    // The cross-renderer parity contract lives at the repo root, outside any
    // package, so kern-native never imports @xoroh/kern to read it (ADR 002).
    // The web suite aliases the same path; both sides read one declaration.
    "^@kern-parity/contract$": path.join(
      __dirname,
      "..",
      "..",
      "parity",
      "contract.ts",
    ),
  },
};
