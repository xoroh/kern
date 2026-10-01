import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";

export const Route = createFileRoute("/getting-started")({
  component: GettingStarted,
});

function GettingStarted() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-6 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
            Getting started
          </p>
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--kern-font-family)",
              fontSize: "var(--md-sys-typescale-headline-large-font-size)",
              lineHeight: "var(--md-sys-typescale-headline-large-line-height)",
              letterSpacing:
                "var(--md-sys-typescale-headline-large-letter-spacing)",
              fontWeight: "var(--md-sys-typescale-headline-large-font-weight)",
            }}
          >
            Install Kern
          </h1>
          <p className="m-0 text-(--md-sys-color-on-surface-variant)">
            Add the package, load the theme stylesheet, import a component. The
            full guide lands here next.
          </p>
          <pre className="overflow-x-auto rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-surface-container) p-5 font-mono text-sm text-(--md-sys-color-on-surface)">
            {`bun add @xoroh/kern

/* styles.css */
@import "@xoroh/kern/theme";

// app.tsx
import { Button } from "@xoroh/kern";`}
          </pre>
        </div>
      </section>
    </SiteLayout>
  );
}
