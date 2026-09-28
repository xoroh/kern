import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@xoroh/kern";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <h1>Kern by Xoroh</h1>
      <p>
        Design system for TanStack Start, React Native, and EmDash. Component
        docs + playground live here.
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
          <a href="/docs/button">Button</a> — variants, sizes, props, rules
          (example page: copy this pattern for every component)
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
