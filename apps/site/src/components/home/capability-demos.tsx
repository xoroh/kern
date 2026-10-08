/**
 * Capability demos — three things the system does, each proved live rather
 * than described.
 *
 * - Theme roles: a toggle plus swatches bound to the same CSS vars the
 *   components read, so flipping the theme repaints the proof.
 * - Composition: the shipped Accordion with real content (the install
 *   commands, whose source of truth is the getting-started route).
 * - Platform parity: the two install lines side by side — one contract,
 *   two renderers.
 *
 * Nothing here is staged: the toggle is the global `useKernTheme`, the
 * accordion is the shipped component, and the commands are the real ones.
 */
import { Accordion, Button, useKernTheme } from "@xoroh/kern";
import { useState, type ReactElement } from "react";
import { Kicker } from "../chrome/kicker";
import { Code } from "../docs/code";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL_LG,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";

const CARD =
  "flex flex-col gap-4 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5";
const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

/** Roles the theme demo paints — every swatch resolves a live token. */
const SWATCHES: { role: string; label: string }[] = [
  { role: "--md-sys-color-primary", label: "Primary" },
  { role: "--md-sys-color-secondary", label: "Secondary" },
  { role: "--md-sys-color-tertiary", label: "Tertiary" },
  { role: "--md-sys-color-error", label: "Error" },
];

function ThemeDemo() {
  const { mode, toggle } = useKernTheme();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="img" aria-label={`Theme roles in ${mode} mode`}>
        {SWATCHES.map((swatch) => (
          <span
            key={swatch.role}
            title={swatch.label}
            aria-hidden="true"
            className="size-10 rounded-full border border-(--md-sys-color-outline-variant)"
            style={{ backgroundColor: `var(${swatch.role})` }}
          />
        ))}
      </div>
      <div>
        <Button variant="tonal" onClick={toggle}>
          {mode === "light" ? "Show dark" : "Show light"}
        </Button>
      </div>
    </div>
  );
}

const INSTALLS: [string, string][] = [
  ["Web", "bun add @xoroh/kern @xoroh/kern-icons"],
  ["Native", "bun add @xoroh/kern-native @xoroh/kern-tokens"],
];

function CompositionDemo() {
  return (
    <Accordion.Root>
      {INSTALLS.map(([platform, command]) => (
        <Accordion.Item key={platform} value={platform}>
          <Accordion.Header>
            <Accordion.Trigger>{platform}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <code className={`font-mono ${T_BODY_SM} ${INK}`}>{command}</code>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

function ParityDemo() {
  const [platform, setPlatform] = useState<"Web" | "Native">("Web");
  const command = INSTALLS.find(([p]) => p === platform)?.[1] ?? "";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2" role="group" aria-label="Platform">
        {(["Web", "Native"] as const).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={platform === p ? "primary" : "tonal"}
            aria-pressed={platform === p}
            onClick={() => setPlatform(p)}
          >
            {p}
          </Button>
        ))}
      </div>
      <Code>{command}</Code>
    </div>
  );
}

const DEMOS: {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  demo: () => ReactElement;
}[] = [
  {
    id: "capability-theme",
    title: "Theme roles, live",
    body: "Four roles, straight from the active scheme. Flip the mode and the swatches repaint — they read the same vars the components do.",
    href: "/foundations/theme",
    cta: "Open the theme",
    demo: ThemeDemo,
  },
  {
    id: "capability-composition",
    title: "Composed from parts",
    body: "Heads, triggers and panels that wire their own relationships. Open a section — the install line inside is the real one.",
    href: "/components",
    cta: "Browse components",
    demo: CompositionDemo,
  },
  {
    id: "capability-parity",
    title: "One contract, two platforms",
    body: "The web package and the native package resolve the same theme. Pick a platform and copy its install.",
    href: "/components/mobile",
    cta: "See the native side",
    demo: ParityDemo,
  },
];

export function CapabilityDemos() {
  return (
    <section
      className="px-4 py-4 sm:px-6 sm:py-6"
      aria-labelledby="capabilities-heading"
    >
      <div className="rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
        <header className="flex flex-col gap-3">
          <Kicker>Capabilities</Kicker>
          <h2
            id="capabilities-heading"
            className={`m-0 ${T_SECTION} ${INK}`}
          >
            Try the system, not the screenshots
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Every demo below is a shipped component running against the live
            theme. If one regresses, this page shows it.
          </p>
        </header>
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {DEMOS.map((item) => {
            const Demo = item.demo;
            return (
              <article key={item.id} className={CARD}>
                <h3 id={item.id} className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                  {item.title}
                </h3>
                <Demo />
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{item.body}</p>
                <a
                  href={item.href}
                  className={`mt-auto ${T_LABEL_LG} text-(--md-sys-color-primary) no-underline hover:underline`}
                >
                  {item.cta} →
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
