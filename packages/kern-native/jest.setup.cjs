// Suite-level globals on top of react-native/jest/setup.js (loaded first).
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Registers the material-3 preset tables with the universal theme resolver
// (side effect) — the RNTL counterpart of vitest.setup.ts. RNTL suites render
// real components, which resolve themes through `theme.tsx` at module load.
require("@xoroh/kern-material-3");
