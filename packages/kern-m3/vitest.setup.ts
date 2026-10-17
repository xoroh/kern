// The suite resolves M3 themes in many files; registration is explicit
// everywhere (decision 010), test harness included — this is the harness's
// ENTRY calling the system's one registration function, exactly as an app
// does. It is NOT an import side effect: entry-purity.test.ts proves the
// package entry registers nothing, using a fresh module registry that this
// setup cannot reach.
import { registerM3 } from "./src/material-3";

registerM3();
