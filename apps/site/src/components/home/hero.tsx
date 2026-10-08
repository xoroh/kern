import { buttonVariants, cn } from "@xoroh/kern";
import { useState } from "react";
import { LiveHero } from "./live-hero";

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
        // `navigator.clipboard` is undefined on insecure origins (plain
        // http, some previews) — `undefined.then` would hard-crash the
        // click. No clipboard, no copy affordance change; the command text
        // itself stays readable and selectable.
        const pending = navigator.clipboard?.writeText(COMMAND);
        if (!pending) return;
        void pending.then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          },
          () => {
            // Denied (permissions policy, headless) — leave the chip alone.
          },
        );
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
            Components, tokens and docs from one source
          </h1>
          <p
            className="mt-5 max-w-xl text-pretty text-(--md-sys-color-on-surface-variant) sm:text-lg"
            style={{
              fontSize: "var(--md-sys-typescale-body-large-font-size)",
              lineHeight: "var(--md-sys-typescale-body-large-line-height)",
            }}
          >
            A Material 3 system for React and React Native. Every departure from
            the Material 3 spec is declared and registered as a deviation id, so
            strictness is something you can audit rather than something we ask
            you to trust.
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
        <LiveHero />
      </div>
    </section>
  );
}
