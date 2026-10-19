import { Link } from "@tanstack/react-router";
import { Button, buttonVariants, Chip, cn, Switch } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { tokens } from "@xoroh/kern-tokens";
import { useState } from "react";
import {
  T_BODY,
  T_BODY_MD,
  T_CODE,
  T_LABEL_LG,
  T_SECTION,
  T_SUB,
} from "../../domains/shared/systems/type-scale";
import { INK, INK_SOFT, LINK } from "../../domains/shared/systems/ui";
import { Kicker } from "../chrome/kicker";

function SectionHead({
  id,
  kicker,
  title,
  body,
  to,
  action,
}: {
  id: string;
  kicker: string;
  title: string;
  body: string;
  to: string;
  action: string;
}) {
  return (
    <div className="home-section-head">
      <div className="max-w-[42rem]">
        <Kicker>{kicker}</Kicker>
        <h2 id={id} className={`mt-3 mb-3 ${T_SECTION} ${INK}`}>
          {title}
        </h2>
        <p className={`m-0 text-pretty ${T_BODY} ${INK_SOFT}`}>{body}</p>
      </div>
      <Link to={to} className={`home-text-link ${T_LABEL_LG} ${LINK}`}>
        {action}
        <Icon name="arrow-forward" size={18} />
      </Link>
    </div>
  );
}

const FAMILIES = [
  {
    name: "Primary",
    role: "primary",
    containerBg: "var(--sys-color-primary-container)",
    containerFg: "var(--sys-color-on-primary-container)",
    circleBg: "var(--sys-color-primary)",
    circleFg: "var(--sys-color-on-primary)",
    tokenLabel: "--sys-color-primary",
    ramp: tokens.palettes.primary,
    description:
      "High-emphasis actions, filled buttons, active switches, and key focal elements.",
  },
  {
    name: "Secondary",
    role: "secondary",
    containerBg: "var(--sys-color-secondary-container)",
    containerFg: "var(--sys-color-on-secondary-container)",
    circleBg: "var(--sys-color-secondary)",
    circleFg: "var(--sys-color-on-secondary)",
    tokenLabel: "--sys-color-secondary",
    ramp: tokens.palettes.m3violet,
    description:
      "Muted violet for tonal buttons, navigation active indicators, and selected filter chips.",
  },
  {
    name: "Tertiary",
    role: "tertiary",
    containerBg: "var(--sys-color-tertiary-container)",
    containerFg: "var(--sys-color-on-tertiary-container)",
    circleBg: "var(--sys-color-tertiary)",
    circleFg: "var(--sys-color-on-tertiary)",
    tokenLabel: "--sys-color-tertiary",
    ramp: tokens.palettes.m3rose,
    description:
      "Warm rose-mauve accent that balances primary and secondary with editorial contrast.",
  },
  {
    name: "Neutral",
    role: "neutral",
    containerBg: "var(--sys-color-surface-container-high)",
    containerFg: "var(--sys-color-on-surface)",
    circleBg: "var(--sys-color-on-surface)",
    circleFg: "var(--sys-color-surface)",
    tokenLabel: "--sys-color-surface-container",
    ramp: tokens.palettes.m3neutral,
    description:
      "Subtle purple-tinted neutral surfaces, reading panes, and the 5-step container hierarchy.",
  },
  {
    name: "Neutral Variant",
    role: "neutral-variant",
    containerBg: "var(--sys-color-surface-tonal)",
    containerFg: "var(--sys-color-on-surface-variant)",
    circleBg: "var(--sys-color-outline)",
    circleFg: "var(--sys-color-surface)",
    tokenLabel: "--sys-color-on-surface-variant",
    ramp: tokens.palettes.m3neutralVariant,
    description:
      "Medium-emphasis text, icons, structural outlines, and decorative hairline dividers.",
  },
] as const;

const SURFACE_CONTAINERS = [
  {
    label: "Lowest",
    token: "--sys-color-surface-container-lowest",
    usage: "Elevated cards & inputs",
  },
  {
    label: "Low",
    token: "--sys-color-surface-container-low",
    usage: "Default cards & app shell",
  },
  {
    label: "Container",
    token: "--sys-color-surface-container",
    usage: "Navigation & grouped bands",
  },
  {
    label: "High",
    token: "--sys-color-surface-container-high",
    usage: "Search bars, code & dialogs",
  },
  {
    label: "Highest",
    token: "--sys-color-surface-container-highest",
    usage: "Filled cards, tracks & switches",
  },
] as const;

export function PaletteBand() {
  return (
    <section aria-labelledby="home-palette" className="home-section">
      <SectionHead
        id="home-palette"
        kicker="Material 3 color architecture"
        title="Five tonal palettes. One cohesive language."
        body="Material Design 3 derives Primary, Secondary, Tertiary, Neutral, and Neutral Variant palettes from one harmonious seed — keeping surfaces quiet while actions and selections stay unmistakable in light and dark."
        to="/foundations/m3/color"
        action="Explore M3 color"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FAMILIES.map(
          ({
            name,
            role,
            containerBg,
            containerFg,
            circleBg,
            circleFg,
            tokenLabel,
            ramp,
            description,
          }) => (
            <article key={role} className="palette-card flex flex-col">
              <div
                className="palette-role"
                style={{
                  backgroundColor: containerBg,
                  color: containerFg,
                }}
              >
                <span className={T_LABEL_LG}>{name}</span>
                <span
                  className="palette-circle"
                  style={{
                    backgroundColor: circleBg,
                    color: circleFg,
                  }}
                >
                  <Icon name="check" size={28} />
                </span>
                <span className={`truncate ${T_CODE}`}>{tokenLabel}</span>
              </div>
              <div
                className="flex h-7 overflow-hidden"
                role="img"
                aria-label={`${name} tonal palette`}
              >
                {Object.entries(ramp).map(([step, value]) => (
                  <span
                    key={step}
                    className="flex-1"
                    title={`${name} ${step}: ${value.srgb}`}
                    style={{ backgroundColor: value.srgb }}
                  />
                ))}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className={`m-0 ${T_SUB}`}>{name}</p>
                <p className={`mt-1.5 mb-0 ${T_BODY_MD} ${INK_SOFT}`}>
                  {description}
                </p>
              </div>
            </article>
          ),
        )}
      </div>

      {/* M3 Surface Container Hierarchy */}
      <div className="mt-6 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
              Neutral Surface Container Ladder
            </p>
            <p className={`m-0 mt-0.5 ${T_BODY_MD} ${INK_SOFT}`}>
              Five tonal container steps separate regions without heavy borders
              or drop shadows.
            </p>
          </div>
          <Link to="/foundations/m3/theme" className={`${T_LABEL_LG} ${LINK}`}>
            Inspect all 58 roles →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5">
          {SURFACE_CONTAINERS.map((step) => (
            <div
              key={step.token}
              className="flex flex-col justify-between gap-3 rounded-(--sys-shape-corner-large) p-3.5"
              style={{
                backgroundColor: `var(${step.token})`,
                color: "var(--sys-color-on-surface)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={T_LABEL_LG}>{step.label}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <code className={`truncate ${T_CODE}`}>{step.token}</code>
                <span className={`${T_BODY_MD} ${INK_SOFT}`}>{step.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-5 flex flex-wrap items-center gap-3 ${T_LABEL_LG}`}>
        <span className={INK_SOFT}>Semantic status roles:</span>
        {["error", "success", "warning", "info"].map((role) => (
          <span
            key={role}
            className="rounded-full px-4 py-1.5 capitalize"
            style={{
              backgroundColor: `var(--sys-color-${role}-container)`,
              color: `var(--sys-color-on-${role}-container)`,
            }}
          >
            {role}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ComponentProof() {
  return (
    <section aria-labelledby="home-components" className="home-section">
      <SectionHead
        id="home-components"
        kicker="A system, not just a kit"
        title="Everything you need. Room to be you."
        body="Start with a component. Understand the foundations. Then make the whole system your own."
        to="/docs"
        action="Explore the docs"
      />
      <div className="home-explore-grid">
        <article className="home-explore-card">
          <div className="home-explore-art home-component-art">
            <Button variant="filled">
              Let's create <Icon name="add" size={18} />
            </Button>
            <div className="flex items-center gap-3">
              <Chip variant="filter" defaultValue>
                Made for you
              </Chip>
              <Switch defaultChecked aria-label="Component preview switch" />
            </div>
            <Button variant="outlined">A different perspective</Button>
          </div>
          <div className="home-explore-copy">
            <Kicker>The building blocks</Kicker>
            <h3 id="home-component-card" className={`mt-2 mb-3 ${T_SUB}`}>
              Components
            </h3>
            <p className={`m-0 ${T_BODY_MD} ${INK_SOFT}`}>
              Accessible, composable controls with real web and native
              implementations.
            </p>
            <Link
              to="/components"
              className={`home-text-link mt-5 ${T_LABEL_LG} ${LINK}`}
            >
              Find your component <Icon name="arrow-forward" size={18} />
            </Link>
          </div>
        </article>
        <article className="home-explore-card">
          <div
            className="home-explore-art home-foundation-art"
            aria-hidden="true"
          >
            <span className="foundation-square" />
            <span className="foundation-circle" />
            <span className="foundation-arch" />
          </div>
          <div className="home-explore-copy">
            <Kicker>The thinking behind it</Kicker>
            <h3 id="home-foundation-card" className={`mt-2 mb-3 ${T_SUB}`}>
              Foundations
            </h3>
            <p className={`m-0 ${T_BODY_MD} ${INK_SOFT}`}>
              Color, typography, shape, and motion. Every detail has a reason to
              be.
            </p>
            <Link
              to="/foundations/m3"
              className={`home-text-link mt-5 ${T_LABEL_LG} ${LINK}`}
            >
              Discover the system <Icon name="arrow-forward" size={18} />
            </Link>
          </div>
        </article>
        <article className="home-explore-card">
          <div className="home-explore-art home-theme-art" aria-hidden="true">
            <div className="theme-art-stack">
              <span />
              <span />
              <span />
              <span />
            </div>
            <Icon name="science" size={44} />
          </div>
          <div className="home-explore-copy">
            <Kicker>A personal touch</Kicker>
            <h3 id="home-studio-card" className={`mt-2 mb-3 ${T_SUB}`}>
              Theme studio
            </h3>
            <p className={`m-0 ${T_BODY_MD} ${INK_SOFT}`}>
              Try a color, explore a scheme, and see your components change
              together.
            </p>
            <Link
              to="/playground"
              className={`home-text-link mt-5 ${T_LABEL_LG} ${LINK}`}
            >
              Make it yours <Icon name="arrow-forward" size={18} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export function GetStartedBand() {
  const [copyState, setCopyState] = useState("Copy command");
  const command = "bun add @xoroh/kern @xoroh/kern-tokens";
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopyState("Copied!");
    } catch {
      setCopyState("Select the command to copy");
    }
  }
  return (
    <section aria-labelledby="home-start" className="home-start">
      <div className="home-start-copy">
        <Kicker className="text-(--sys-color-secondary)">
          From idea to interface
        </Kicker>
        <h2 id="home-start" className={`mt-4 mb-4 ${T_SECTION} ${INK}`}>
          Your next great thing
          <br />
          starts with a small step.
        </h2>
        <p className={`m-0 max-w-[40ch] ${T_BODY} ${INK_SOFT}`}>
          Install Kern, register the Material 3 preset, and ship accessible web
          and React Native screens from one foundation.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/docs/getting-started"
            className={cn(
              buttonVariants({ variant: "filled" }),
              "home-cta w-fit no-underline",
            )}
          >
            Get started <Icon name="arrow-forward" size={20} />
          </Link>
          <Link
            to="/playground"
            className={cn(
              buttonVariants({ variant: "tonal" }),
              "home-cta w-fit no-underline",
            )}
          >
            Open Theme Studio
          </Link>
        </div>
      </div>
      <div className="home-code-panel">
        <div
          className={`flex items-center justify-between gap-3 ${T_LABEL_LG}`}
        >
          <span className="flex items-center gap-2">
            <Icon name="code" size={20} />
            Your first component
          </span>
          <span className="code-language">React</span>
        </div>
        <div className="home-code-lines">
          <code className={T_CODE}>
            <span className="code-comment">
              {"// 01 — Install (source, available now)"}
            </span>
            <br />
            {"bun <checkout>/packages/kern-cli/src/kern.ts init my-app"}
          </code>
          <code className={T_CODE}>
            <span className="code-comment">
              {"// 01b — Registry (available at release)"}
            </span>
            <br />
            {command}
          </code>
          <code className={T_CODE}>
            <span className="code-comment">{"// 02 — Add the theme"}</span>
            <br />
            import <span className="code-accent">"@xoroh/kern/theme"</span>
            {";"}
          </code>
          <code className={T_CODE}>
            <span className="code-comment">{"// 03 — Make it happen"}</span>
            <br />
            import {"{ Button }"} from{" "}
            <span className="code-accent">"@xoroh/kern"</span>;<br />
            <br />
            &lt;Button&gt;Hello, possibility&lt;/Button&gt;
          </code>
        </div>
        <button
          type="button"
          onClick={copyCommand}
          className={`home-copy-button ${T_LABEL_LG}`}
        >
          <Icon name="content-copy" size={18} />
          {copyState}
        </button>
        <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
          Preview: packages are unpublished — install from a checkout; the
          registry command runs at release.
        </p>
        <span className="sr-only" role="status">
          {copyState === "Copied!"
            ? "Install command copied to clipboard."
            : ""}
        </span>
      </div>
    </section>
  );
}
