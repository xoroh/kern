import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// react-native-web ships the `react-native` module surface on the web, so the
// kern-native sources resolve without a Metro/Expo host. This is the S2.3
// choice: real previews, not screenshots.
// Absolute path: a bare specifier here is not resolved by the SSR bundler and
// produces duplicated modules.
const reactNativeAlias = {
  "react-native": fileURLToPath(
    import.meta.resolve("react-native-web"),
  ),
};

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: reactNativeAlias,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),

    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
