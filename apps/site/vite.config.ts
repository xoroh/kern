import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// react-native-web ships the `react-native` module surface on the web, so the
// kern-native sources resolve without a Metro/Expo host. This is the S2.3
// choice: real previews, not screenshots.
// Absolute path: a bare specifier here is not resolved by the SSR bundler and
// produces duplicated modules.
const reactNativeAlias = {
  "react-native": fileURLToPath(import.meta.resolve("react-native-web")),
};

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: reactNativeAlias,
  },
  // @cloudflare/unenv-preset is bun-nested (node_modules/.bun/...) and cannot be
  // resolved by vite's SSR dep-optimizer to pre-bundle, which fails with a
  // missing optimized file. Excluded so it's not pre-bundled (it's an SSR/node
  // compatibility shim the cloudflare plugin loads directly).
  optimizeDeps: {
    exclude: ["@cloudflare/unenv-preset"],
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),

    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
