import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Field } from "@xoroh/kern";
import { Kicker } from "../../components/chrome/kicker";
import { Code, Step } from "../../components/docs/code";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_MD,
  T_PAGE,
} from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/docs/getting-started")({
  head: () =>
    routeHead(
      "Getting started",
      "From install to a themed component in ten steps.",
    ),
  component: GettingStarted,
});

const INSTALL = `bun add @xoroh/kern @xoroh/kern-icons`;

const STYLESHEET = `/* app.css — the only required import */
@import "@xoroh/kern/theme";`;

const FIRST_COMPONENT = `import { Button, Field } from "@xoroh/kern";

export function SignIn() {
  return (
    <form>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" placeholder="you@example.com" required />
        <Field.Description>We only use this for sign-in.</Field.Description>
      </Field.Root>
      <Button type="submit">Continue</Button>
    </form>
  );
}`;

const THEMING = `import { useKernTheme } from "@xoroh/kern";

export function AppearanceToggle() {
  const { mode, setMode, useSystem } = useKernTheme();
  return (
    <>
      <button onClick={() => setMode("light")}>Light</button>
      <button onClick={() => setMode("dark")}>Dark</button>
      <button onClick={useSystem}>System</button>
      <p>Current: {mode}</p>
    </>
  );
}`;

const WEB_QUICKSTART = `import {
  AppShell,
  NavigationRail,
  NavigationRailButton,
} from "@xoroh/kern/start";

export function App() {
  return (
    <AppShell
      rail={
        <NavigationRail>
          <NavigationRailButton href="/" label="Home" icon={<span />} />
          <NavigationRailButton href="/docs" label="Docs" icon={<span />} />
        </NavigationRail>
      }
    >
      <h1>Kern app</h1>
    </AppShell>
  );
}`;

const MOBILE_INSTALL = `bun add @xoroh/kern-native @xoroh/kern-tokens`;

const MOBILE_QUICKSTART = `import {
  Button,
  KernThemeProvider,
  Text,
} from "@xoroh/kern-native";

export function SaveScreen() {
  return (
    <KernThemeProvider>
      <Text variant="headline">Save changes</Text>
      <Button variant="primary" onPress={save}>
        Save
      </Button>
    </KernThemeProvider>
  );
}`;

const ICONS = `import { Icon } from "@xoroh/kern-icons";

// A semantic alias: the same meaning resolves to the same glyph everywhere.
<Icon name="settings" size={24} title="Settings" />

// Or a raw glyph from the synced catalog.
<Icon name="account-tree" size={24} filled />`;

const PRESET_PICKER = `import { useState } from "react";
import { applyKernTheme, Button, type Mode, type ThemeId } from "@xoroh/kern";

const PRESETS = ["material-3", "sharp", "brand", "demo"] as const satisfies readonly ThemeId[];

export function PresetPicker() {
  const [preset, setPreset] = useState<ThemeId>("material-3");
  const [mode] = useState<Mode>("light");
  function apply(next: ThemeId) {
    setPreset(next);
    applyKernTheme(document.documentElement, mode, "standard", next);
  }
  return (
    <>
      {PRESETS.map((p) => (
        <Button
          key={p}
          variant={p === preset ? "primary" : "outlined"}
          onClick={() => apply(p)}
        >
          {p}
        </Button>
      ))}
    </>
  );
}`;

function GettingStarted() {
  return (
    <SiteLayout>
      <PageCard width="narrow">
        <header className="flex flex-col gap-3">
          <Kicker>Getting started</Kicker>
          <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
            From install to a themed component
          </h1>
          <p className={`m-0 ${T_BODY} text-(--sys-color-on-surface-variant)`}>
            Install, theme, render your first component.
          </p>
        </header>

        <Step n={1} title="Install the packages">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Source path first — available now: scaffold from a checkout and
            vendor what you need (Steps 8–9). Registry path — available at
            release: packages are unpublished, so this resolves from a checkout
            until 0.1.0 publishes.
          </p>
          <Code>{INSTALL}</Code>
        </Step>

        <Step n={2} title="Load the theme stylesheet">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            One import sets every CSS custom property.
          </p>
          <Code>{STYLESHEET}</Code>
        </Step>

        <Step n={3} title="Render your first component">
          <div className="flex flex-col gap-4 rounded-(--sys-shape-corner-medium) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-low) p-6">
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Field.Control type="email" placeholder="you@example.com" />
              <Field.Description>
                We only use this for sign-in.
              </Field.Description>
            </Field.Root>
            <Button variant="primary">Continue</Button>
          </div>
          <Code>{FIRST_COMPONENT}</Code>
        </Step>

        <Step n={4} title="Theming">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Same scheme on web and native, persisted across visits.
          </p>
          <Code>{THEMING}</Code>
        </Step>

        <Step n={5} title="Web quickstart — the app shell">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            <code>@xoroh/kern/start</code> ships the frame: a rail, a drawer,
            split panes, and top bars that take slots rather than baking in one
            app shape. Omit the slots you do not need and every other shell
            shape follows.
          </p>
          <Code>{WEB_QUICKSTART}</Code>
        </Step>

        <Step n={6} title="Mobile quickstart">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Native components take <code>onPress</code> instead of{" "}
            <code>onClick</code>, and resolve the same theme through{" "}
            <code>KernThemeProvider</code>. Source path first — vendor from a
            checkout (Step 9 covers <code>kern add --platform native</code>);
            the registry command below runs at release.
          </p>
          <Code>{MOBILE_INSTALL}</Code>
          <Code>{MOBILE_QUICKSTART}</Code>
          {/* P-READY (G6): install without ecosystem — G3/G4 lifts this
                block onto the primitives subdomain; do not duplicate the
                install string elsewhere. */}
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Prefer no ecosystem? The behavior kernel is Axis-owned and installs
            standalone with its first published release — until then it ships
            inside Kern (React 18+ is the only peer). Per-module pages land with
            the primitives subdomain; until then start here and read the module
            index:
          </p>
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            <Link
              to="/primitives"
              className="text-(--sys-color-secondary) no-underline hover:underline"
            >
              Primitives — behavior kernel, no visuals
            </Link>
          </p>
        </Step>

        <Step n={7} title="Icons">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Prefer a semantic alias over a raw glyph: the alias is the
            unification decision, so a re-decision stays a one-line change in
            the icon package instead of a sweep across every product.
          </p>
          <Code>{ICONS}</Code>
        </Step>

        <Step n={8} title="Scaffold the starter — kern init">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            The fastest adoption path is the scaffold: one command, then{" "}
            <code>bun install</code> and <code>bun run dev</code>, and the
            themed screen is up — an app shell with the preset picker (kern,
            sharp, brand, and the demo tenant) on the light/dark axis. The CLI
            is unpublished with everything else, so run it from a checkout until
            it ships on its own.
          </p>
          <Code>
            {
              "bun <checkout>/packages/kern-cli/src/kern.ts init my-app\ncd my-app\nbun install\nbun run dev"
            }
          </Code>
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Switching a preset is override data, never a second role table:{" "}
            <code>applyKernTheme</code> writes the resolved roles onto the
            document root and every component repaints.
          </p>
          <Code>{PRESET_PICKER}</Code>
        </Step>

        <Step n={9} title="Vendor components with kern add">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Prefer owning the code over depending on it? <code>kern add</code>{" "}
            vendors one component plus its transitive closure into your tree —
            run it once per component for a scaffold shell, or once for a
            single-component hybrid where the values stay depended.{" "}
            <code>--self-contained</code> additionally vendors the token CSS
            snapshot: the eject path for owning your values. Like{" "}
            <code>init</code>, run it from a checkout until the CLI ships on its
            own.
          </p>
          <Code>
            {
              "bun <checkout>/packages/kern-cli/src/kern.ts add button --dest components/kern\nbun <checkout>/packages/kern-cli/src/kern.ts add dialog --dest components/kern"
            }
          </Code>
        </Step>

        <Step n={10} title="Receipts are the audit trail">
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Every <code>init</code> and <code>add</code> stamps{" "}
            <code>kern.receipt.json</code> with the kern version and the file
            hashes. <code>kern list</code>, <code>kern diff</code>, and{" "}
            <code>kern upgrade</code> read that receipt when they ship — shown
            here as coming, never as available — and until then the receipt is
            what refuses a mixed-version destination instead of silently merging
            it.
          </p>
        </Step>
      </PageCard>
    </SiteLayout>
  );
}
