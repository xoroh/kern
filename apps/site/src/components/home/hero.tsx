import { buttonVariants, cn } from "@xoroh/kern";
import { useState } from "react";

const COMMAND = "bun add @xoroh/kern";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
      {children}
    </p>
  );
}

function InstallChip() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(COMMAND).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="inline-flex cursor-pointer items-center gap-3 rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) px-5 py-2.5 font-mono text-sm text-(--md-sys-color-on-surface) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
      aria-label={`Copy install command: ${COMMAND}`}
    >
      <span aria-hidden="true" className="text-(--md-sys-color-secondary)">
        $
      </span>
      <span>{COMMAND}</span>
      <span className="text-(--md-sys-color-on-surface-variant)">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}

/**
 * Kern art card: brand-shape composition (triangle · circle · square — the
 * feedback brand trio) on the secondary panel. Decorative; one floating
 * live-chip docks on top.
 */
function ArtCard() {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[420px] overflow-hidden rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-secondary) lg:min-h-[560px]"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 600 600"
      >
        <rect fill="var(--md-sys-color-secondary)" height="600" width="600" />
        <path
          d="M40 600 L40 240 C40 110 140 40 260 40 C380 40 450 140 450 280 L450 600 Z"
          fill="var(--md-sys-color-on-secondary)"
          opacity="0.16"
        />
        <rect
          fill="var(--md-sys-color-inverse-surface)"
          height="600"
          width="190"
          x="410"
        />
        <circle
          cx="430"
          cy="180"
          fill="var(--md-sys-color-secondary-container)"
          r="120"
        />
        {/* brand trio: triangle · circle · square */}
        <path
          d="M150 420 L206 520 H94 Z"
          fill="var(--md-sys-color-on-secondary)"
        />
        <circle
          cx="320"
          cy="470"
          fill="var(--md-sys-color-on-secondary-container)"
          r="52"
        />
        <rect
          fill="var(--md-sys-color-on-secondary)"
          height="88"
          width="88"
          x="450"
          y="430"
          rx="8"
        />
        <path
          d="M60 380 C 200 300, 320 320, 430 360"
          fill="none"
          stroke="var(--md-sys-color-on-secondary)"
          strokeDasharray="2 16"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.7"
        />
      </svg>
      <div className="absolute right-6 bottom-6 left-6 flex flex-wrap items-center gap-2">
        <span className="rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface) px-4 py-1.5 text-sm font-medium text-(--md-sys-color-on-surface)">
          45 roles
        </span>
        <span className="rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface) px-4 py-1.5 text-sm font-medium text-(--md-sys-color-on-surface)">
          Web + Native
        </span>
        <span className="rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface) px-4 py-1.5 text-sm font-medium text-(--md-sys-color-on-surface)">
          Agent-ready
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="px-4 py-4 sm:px-6 sm:py-6">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex flex-col justify-center rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14 lg:min-h-[560px] lg:p-16">
          <Kicker>Kern by Xoroh</Kicker>
          <h1
            className="mt-4 max-w-xl text-balance text-(--md-sys-color-on-surface)"
            style={{
              fontFamily: "var(--kern-font-family)",
              fontSize: "var(--md-sys-typescale-display-large-font-size)",
              lineHeight: "var(--md-sys-typescale-display-large-line-height)",
              letterSpacing:
                "var(--md-sys-typescale-display-large-letter-spacing)",
              fontWeight: "var(--md-sys-typescale-display-large-font-weight)",
            }}
          >
            Components, tokens, and docs from one source
          </h1>
          <p
            className="mt-5 max-w-xl text-pretty text-(--md-sys-color-on-surface-variant) sm:text-lg"
            style={{
              fontSize: "var(--md-sys-typescale-body-large-font-size)",
              lineHeight: "var(--md-sys-typescale-body-large-line-height)",
            }}
          >
            A Material 3 design system for React and React Native — with the
            reference, tokens, and agent skills built in.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/getting-started"
              className={cn(
                buttonVariants({ variant: "primary" }),
                "no-underline",
              )}
            >
              Get started
            </a>
            <InstallChip />
          </div>
        </div>
        <ArtCard />
      </div>
    </section>
  );
}
