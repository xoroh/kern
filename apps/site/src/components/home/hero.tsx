/**
 * Hero — the homepage opening, painted in the M3 palette.
 *
 * Quiet tonal paper, editorial display type, and two graphic specimens
 * beside a live composition of real package controls. The specimens are
 * decorative; the controls have their actual selection and feedback states.
 *
 * Ink is `on-primary-container` for the same reason: it is the role paired
 * with the primary container; the page repaints in both light and dark modes.
 */
import { Button, buttonVariants, Chip, cn, Switch } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  T_BODY,
  T_HERO,
  T_LABEL_LG,
  T_SUB,
} from "../../domains/shared/systems/type-scale";
import { Kicker } from "../chrome/kicker";

const INK = "text-(--sys-color-on-primary-container)";

/** A static Material-inspired rosette, painted entirely with semantic roles. */
export function MaterialBloom() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" className="material-bloom">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <ellipse
          key={angle}
          cx="120"
          cy="75"
          rx="29"
          ry="64"
          transform={`rotate(${angle} 120 120)`}
          fill="var(--sys-color-primary)"
        />
      ))}
      <circle
        cx="120"
        cy="120"
        r="41"
        fill="var(--sys-color-tertiary-container)"
      />
      <path
        d="M101 120h38m-19-19v38"
        stroke="var(--sys-color-on-tertiary-container)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Real controls: selection, state, and feedback are not painted imitations. */
function LiveCluster() {
  const [saved, setSaved] = useState(false);
  return (
    <section className="hero-art" aria-label="Try Kern components">
      <div className="hero-bloom-tile">
        <MaterialBloom />
        <span className={T_LABEL_LG}>Shape your ideas</span>
        <span aria-hidden="true" className="hero-tile-arrow">
          ↗
        </span>
      </div>
      <div className="hero-type-tile">
        <span aria-hidden="true" className="hero-aa">
          Aa
        </span>
        <div className={`flex justify-between ${T_LABEL_LG}`}>
          <span>Type with character</span>
          <span aria-hidden="true">↗</span>
        </div>
      </div>
      <div className="hero-control-tile">
        <div className="flex items-center justify-between gap-4">
          <span className={`flex items-center gap-2 ${T_LABEL_LG}`}>
            <Icon name="science" size={20} /> A little playground
          </span>
          <span className="hero-live-dot" aria-hidden="true" />
        </div>
        <p className={`my-4 ${T_SUB}`}>Small details. Big difference.</p>
        <div className="flex flex-wrap gap-2">
          <Chip variant="filter" defaultValue>
            Design
          </Chip>
          <Chip variant="filter">Develop</Chip>
          <Chip variant="filter">Make it yours</Chip>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div
            className={`flex cursor-pointer items-center gap-3 ${T_LABEL_LG}`}
          >
            <Switch defaultChecked aria-label="Express yourself" />
            Express yourself
          </div>
          <Button variant="filled" onClick={() => setSaved(!saved)}>
            <Icon name={saved ? "check" : "add"} size={18} />
            {saved ? "Made it yours" : "Make something"}
          </Button>
        </div>
        <span className="sr-only" role="status">
          {saved ? "Your idea is saved in this demo." : ""}
        </span>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-grid">
        <div className="flex flex-col justify-center">
          <Kicker className={INK}>Material 3. Made for you.</Kicker>
          <h1 className={`my-6 ${T_HERO} ${INK}`}>
            Make it
            <br />
            <span className="text-(--sys-color-primary)">feel right.</span>
          </h1>
          <p className={`m-0 max-w-[38ch] text-pretty ${T_BODY} ${INK}`}>
            Thoughtful components. Expressive color. A shared foundation for
            beautiful experiences on web and native.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/docs/getting-started"
              className={cn(
                buttonVariants({ variant: "filled" }),
                "home-cta no-underline",
              )}
            >
              Start building <Icon name="arrow-forward" size={20} />
            </a>
            <a
              href="/components"
              className={cn(
                buttonVariants({ variant: "outlined" }),
                "home-cta no-underline",
              )}
            >
              Explore components
            </a>
          </div>
          <div
            className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 ${T_LABEL_LG} ${INK}`}
          >
            <span className="flex items-center gap-1.5">
              <Icon name="check" size={16} />
              React + React Native
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="check" size={16} />
              Open source
            </span>
          </div>
        </div>
        <LiveCluster />
      </div>
    </section>
  );
}
