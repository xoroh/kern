import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { Code, Step } from "../components/docs/code";

export const Route = createFileRoute("/getting-started")({
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

function GettingStarted() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
              Getting started
            </p>
            <h1 className="m-0 text-3xl font-semibold text-(--md-sys-color-on-surface)">
              From install to a themed component
            </h1>
            <p className="m-0 text-(--md-sys-color-on-surface-variant)">
              Six steps: install, theme stylesheet, first component, theming,
              then the web and mobile quickstarts. Every TypeScript snippet here
              is compiled against the shipped packages before it ships; the
              shell, CSS and fragment lines are checked against the real APIs by
              hand.
            </p>
          </header>

          <Step n={1} title="Install the packages">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              Kern is one package per platform. Web consumers install{" "}
              <code>@xoroh/kern</code>; the icon set and the app scaffold are
              separate, so you only take what you use.
            </p>
            <Code>{INSTALL}</Code>
          </Step>

          <Step n={2} title="Load the theme stylesheet">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              One import sets the CSS custom properties every component reads.
              Import it once, at the root of your stylesheet.
            </p>
            <Code>{STYLESHEET}</Code>
          </Step>

          <Step n={3} title="Render your first component">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              <code>Field</code> composes the input and wires the label,
              description, and error relationships for you. There is no{" "}
              <code>id</code> to invent.
            </p>
            <Code>{FIRST_COMPONENT}</Code>
          </Step>

          <Step n={4} title="Theming">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              <code>useKernTheme</code> resolves the same scheme the native side
              resolves, and persists the choice. <code>useSystem</code> hands
              control back to the OS.
            </p>
            <Code>{THEMING}</Code>
          </Step>

          <Step n={5} title="Web quickstart — the app shell">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              <code>@xoroh/kern/start</code> ships the frame: a rail, a drawer,
              split panes, and top bars that take slots rather than baking in
              one app shape. Omit the slots you do not need and every other
              shell shape follows.
            </p>
            <Code>{WEB_QUICKSTART}</Code>
          </Step>

          <Step n={6} title="Mobile quickstart">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              Native components take <code>onPress</code> instead of{" "}
              <code>onClick</code>, and resolve the same theme through{" "}
              <code>KernThemeProvider</code>.
            </p>
            <Code>{MOBILE_INSTALL}</Code>
            <Code>{MOBILE_QUICKSTART}</Code>
          </Step>

          <Step n={7} title="Icons">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              Prefer a semantic alias over a raw glyph: the alias is the
              unification decision, so a re-decision stays a one-line change in
              the icon package instead of a sweep across every product.
            </p>
            <Code>{ICONS}</Code>
          </Step>
        </div>
      </section>
    </SiteLayout>
  );
}
