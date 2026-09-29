import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/guides")({
  component: Guides,
});

function Guides() {
  return (
    <main id="main">
      <nav aria-label="Breadcrumb">
        <p>
          <a href="/">Kern</a> / <a href="/docs/components">Docs</a> / Guides
        </p>
      </nav>
      <h1>Guides</h1>

      <h2>Swap the theme</h2>
      <p>
        Ship the <code>m3</code> default, offer <code>sharp</code> as a shape
        variation, or author a customer theme with the validated helper:
      </p>
      <pre>
        <code>{`import { applyKernTheme, defineThemePreset } from "@xoroh/kern";

const brand = defineThemePreset({
  id: "acme",
  extends: "m3",
  overrides: { color: { light: { primary: "#1e3a8a" } } },
});

applyKernTheme(document.documentElement, "dark", "standard", brand);`}</code>
      </pre>
      <p>
        `defineThemePreset` rejects unknown roles, non-hex colors, and contrast
        failures before anything renders.
      </p>

      <h2>Use Kern in React Native</h2>
      <pre>
        <code>{`import { KernThemeProvider, Button } from "@xoroh/kern-native";

<KernThemeProvider>
  <Button variant="primary" onPress={save}>
    Save
  </Button>
</KernThemeProvider>;`}</code>
      </pre>
      <p>
        Load `Inter_400Regular`, `Inter_500Medium`, and `Inter_600SemiBold` from
        `@expo-google-fonts/inter` before rendering typography.
      </p>
    </main>
  );
}
