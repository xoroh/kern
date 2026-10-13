import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/kern.ts", "src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: true },
  outDir: "dist",
  clean: true,
  // The bin entry needs its shebang: without it `kern` is a JS file the
  // shell cannot execute, and the failure surfaces at install time.
  banner: { js: "#!/usr/bin/env node" },
});
