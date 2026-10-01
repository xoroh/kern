import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";

export const Route = createFileRoute("/components/")({
  component: ComponentsIndex,
});

const PLATFORMS = [
  {
    href: "/components/web" as const,
    title: "Web",
    pkg: "@xoroh/kern",
    body: "React components on Base UI. Compound parts, typed variants, Tailwind-class overrides. DOM elements, SSR-safe.",
  },
  {
    href: "/components/mobile" as const,
    title: "Mobile",
    pkg: "@xoroh/kern-native",
    body: "React Native components. StyleSheet output, single composed API per family. No DOM — phones and tablets only.",
  },
];

function ComponentsIndex() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[56rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <div className="flex flex-col gap-4">
            <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
              Components
            </p>
            <h1
              className="m-0"
              style={{
                fontFamily: "var(--kern-font-family)",
                fontSize: "var(--md-sys-typescale-headline-large-font-size)",
                lineHeight:
                  "var(--md-sys-typescale-headline-large-line-height)",
                letterSpacing:
                  "var(--md-sys-typescale-headline-large-letter-spacing)",
                fontWeight:
                  "var(--md-sys-typescale-headline-large-font-weight)",
              }}
            >
              Two platforms, one contract
            </h1>
            <p className="m-0 max-w-[42rem] text-(--md-sys-color-on-surface-variant)">
              Every component exists twice: once for React (web), once for React
              Native. Same names and same variants — different package,
              different rendering. Pick your platform:
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map((platform) => (
              <Link
                key={platform.href}
                to={platform.href}
                className="rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-8 no-underline transition-colors hover:bg-(--md-sys-color-surface-container-high)"
              >
                <p className="m-0 mb-1 text-lg font-semibold text-(--md-sys-color-on-surface)">
                  {platform.title}
                </p>
                <p className="m-0 mb-3 font-mono text-sm text-(--md-sys-color-secondary)">
                  {platform.pkg}
                </p>
                <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
                  {platform.body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
