import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";

export const Route = createFileRoute("/theme/")({ component: ThemeIndex });

function ThemeIndex() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-5 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
            Theme
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
            One theme source, both platforms
          </h1>
          <p className="m-0 font-mono text-sm text-(--md-sys-color-secondary)">
            @xoroh/kern-theme
          </p>
          <p className="m-0 text-(--md-sys-color-on-surface-variant)">
            The platform-free core: 45 color roles, type scale, shape ladder,
            presets (m3 / sharp / brand). Web reads OKLCH CSS variables, mobile
            reads compiled sRGB — both resolve the same values. Role swatches,
            type scale, and preset previews land here.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
