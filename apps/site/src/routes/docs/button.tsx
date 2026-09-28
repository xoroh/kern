import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@xoroh/kern";

export const Route = createFileRoute("/docs/button")({
  component: ButtonDocs,
});

const SNIPPET = `import { Button } from "@xoroh/kern";

export function Save() {
  return (
    <Button type="button" variant="primary">
      Save
    </Button>
  );
}`;

const PROPS: Array<[string, string, string]> = [
  ["variant", `"primary" | "tonal" | "ghost"`, `"primary"`],
  ["size", `"default" | "sm" | "icon"`, `"default"`],
  ["type", `"button" | "submit" | "reset"`, `— (set it yourself)`],
  ["disabled", `boolean`, `false`],
  ["onClick", `(e: MouseEvent) => void`, `—`],
];

function ButtonDocs() {
  return (
    <main>
      <p>
        <a href="/">Kern</a> / Docs / Button
      </p>
      <h1>Button</h1>
      <p>
        Primary action control. Rendered from <code>@xoroh/kern</code> — the
        same component below ships to TanStack Start, Astro islands, and (via{" "}
        <code>/native</code>) React Native.
      </p>

      <h2>Variants</h2>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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

      <h2>Sizes</h2>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Button type="button" size="default">
          Default
        </Button>
        <Button type="button" size="sm">
          Small
        </Button>
        <Button type="button" size="icon" aria-label="Add">
          +
        </Button>
        <Button type="button" disabled>
          Disabled
        </Button>
      </div>

      <h2>Usage</h2>
      <pre>
        <code>{SNIPPET}</code>
      </pre>

      <h2>Props</h2>
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {PROPS.map(([name, type, fallback]) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>
                <code>{type}</code>
              </td>
              <td>
                <code>{fallback}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Rules</h2>
      <ul>
        <li>
          Always set <code>type</code> explicitly — an unset button inside a
          form submits it.
        </li>
        <li>
          One primary button per view. Secondary actions use <code>tonal</code>{" "}
          or <code>ghost</code>.
        </li>
        <li>
          Icon-only buttons must set <code>aria-label</code>.
        </li>
      </ul>
    </main>
  );
}
