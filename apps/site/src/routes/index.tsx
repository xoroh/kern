import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@xoroh/kern";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main id="main">
      <h1>Kern by Xoroh</h1>
      <p>
        Design system for TanStack Start and React Native. Component docs and
        working theme previews live here.
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Button type="button" variant="primary">
          Primary
        </Button>
        <Button type="button" variant="tonal">
          Tonal
        </Button>
        <Button type="button" variant="ghost">
          Ghost
        </Button>
      </div>
      <h2>Docs</h2>
      <ul>
        <li>
          <a href="/docs/components">Components</a> — live previews of the
          components below
        </li>
        <li>
          <a href="/docs/button">Button</a> — per-component reference page
        </li>
        <li>
          <a href="/docs/getting-started">Getting started</a> — install, theme,
          first Button
        </li>
        <li>
          <a href="/docs/guides">Guides</a> — theme swapping, native
        </li>
      </ul>
      <ul>
        <li>
          <a href="https://xoroh.org">xoroh.org</a> — back to the hub
        </li>
      </ul>
    </main>
  );
}
