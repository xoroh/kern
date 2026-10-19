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
    ramp: tokens.palettes.primary,
    description: "The signature. Actions that stand out.",
  },
  {
    name: "Secondary",
    role: "secondary",
    ramp: tokens.palettes.m3violet,
    description: "The balance. A softer kind of emphasis.",
  },
  {
    name: "Tertiary",
    role: "tertiary",
    ramp: tokens.palettes.m3rose,
    description: "The accent. A little unexpected delight.",
  },
] as const;

export function PaletteBand() {
  return (
    <section aria-labelledby="home-palette" className="home-section">
      <SectionHead
        id="home-palette"
        kicker="Color with purpose"
        title="Not just purple. A whole language."
        body="Three tonal families, one harmonious system. Semantic roles bring every surface, action, and state together—in light and dark."
        to="/foundations/m3/color"
        action="Meet the palette"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {FAMILIES.map(({ name, role, ramp, description }) => (
          <article key={role} className="palette-card">
            <div
              className="palette-role"
              style={{
                backgroundColor: `var(--sys-color-${role}-container)`,
                color: `var(--sys-color-on-${role}-container)`,
              }}
            >
              <span className={T_LABEL_LG}>{name} container</span>
              <span
                className="palette-circle"
                style={{
                  backgroundColor: `var(--sys-color-${role})`,
                  color: `var(--sys-color-on-${role})`,
                }}
              >
                <Icon name="check" size={32} />
              </span>
              <span className={T_CODE}>--sys-color-{role}</span>
            </div>
            <div
              className="flex h-8 overflow-hidden"
              role="img"
              aria-label={`${name} tonal palette`}
            >
              {Object.entries(ramp).map(([step, value]) => (
                <span
                  key={step}
                  className="flex-1"
                  style={{ backgroundColor: value.srgb }}
                />
              ))}
            </div>
            <div className="p-5">
              <p className={`m-0 ${T_SUB}`}>{name}</p>
              <p className={`mt-2 mb-0 ${T_BODY_MD} ${INK_SOFT}`}>
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className={`mt-5 flex flex-wrap items-center gap-3 ${T_LABEL_LG}`}>
        <span className={INK_SOFT}>And meaning when it matters:</span>
        {["error", "success", "warning", "info"].map((role) => (
          <span
            key={role}
            className="rounded-full px-4 py-2 capitalize"
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
            <Button variant="primary">
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
        <Kicker className="text-(--sys-color-on-primary-container)">
          From idea to interface
        </Kicker>
        <h2 id="home-start" className={`mt-4 mb-4 ${T_SECTION}`}>
          Your next great thing
          <br />
          starts with a small step.
        </h2>
        <p className={`m-0 max-w-[40ch] ${T_BODY}`}>
          Install Kern, bring in the theme, and make something worth using.
        </p>
        <Link
          to="/docs/getting-started"
          className={cn(
            buttonVariants({ variant: "primary" }),
            "home-cta mt-7 w-fit no-underline",
          )}
        >
          Get started <Icon name="arrow-forward" size={20} />
        </Link>
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
