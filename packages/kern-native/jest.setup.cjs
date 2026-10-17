// Suite-level globals on top of react-native/jest/setup.js (loaded first).
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Test-harness ENTRY: registers the material-3 preset tables with the
// universal theme resolver explicitly (decision 010 — no import side
// effects) — the RNTL counterpart of vitest.setup.ts. RNTL suites render
// real components, which resolve themes through `theme.tsx`; without this
// call they fail loud with "Unknown preset". Exactly what a production app
// does once at its own entry.
require("@xoroh/kern-m3").registerM3();
