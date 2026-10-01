import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../../components/chrome/site-layout";

export const Route = createFileRoute("/components/mobile/")({
  component: MobileComponents,
});

function MobileComponents() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-5 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
            Components / Mobile
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
            Mobile components
          </h1>
          <p className="m-0 font-mono text-sm text-(--md-sys-color-secondary)">
            @xoroh/kern-native
          </p>
          <p className="m-0 text-(--md-sys-color-on-surface-variant)">
            React Native + StyleSheet. One composed component per family with a{" "}
            <code>*Styles</code> helper — no DOM, no Tailwind. Per-component
            pages land here, with native screenshots or Expo previews.
          </p>
          <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
            <Link to="/components">← All platforms</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
