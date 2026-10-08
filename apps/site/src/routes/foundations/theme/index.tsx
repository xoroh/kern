/**
 * /foundations/theme — the theme REFERENCE page (theory, not configuration).
 *
 * Foundations/G split: this page answers "what do the roles resolve to" —
 * every swatch read from the package, both schemes, both platforms. It does
 * not configure: seed, presets, contrast authoring and radius scaling live
 * in the theme configurator (Playground), linked from the "Configure it"
 * section below. Role MEANING and role→surface usage live on
 * /foundations/color; this page renders the resolved VALUES, grouped by the
 * same role-grammar bands.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Chip } from "@xoroh/kern";
import { resolveThemeDetails } from "@xoroh/kern-tokens";
import { Text, View } from "react-native";
import { CopyMarkdownButton } from "../../../components/chrome/copy-markdown-button";
import { Kicker } from "../../../components/chrome/kicker";
import { PhonePreview } from "../../../components/preview/phone";
import { Preview, PreviewGrid } from "../../../components/preview/preview";
import { COLOR_GROUPS } from "../../../content/foundations/color";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import { routeHead } from "../../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_MD,
  T_CODE,
  T_LABEL,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/foundations/theme/")({
  head: () =>
    routeHead(
      "Theme",
      "Color roles in the active theme, read from the package",
    ),
  component: ThemePage,
});

/** Resolved from the theme package, not hand-copied: these are the real schemes. */
const LIGHT = resolveThemeDetails("light");
const DARK = resolveThemeDetails("dark");
const SHAPE_KEYS = Object.keys(LIGHT.shape) as (keyof typeof LIGHT.shape)[];
const ROLE_COUNT = Object.keys(LIGHT.color).length;
const CONTRAST_MODES = ["standard", "medium", "high"] as const;

function Swatch({
  role,
  value,
  kern,
}: {
  role: string;
  value: string;
  kern?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-7 shrink-0 rounded-(--md-sys-shape-corner-extra-small) border border-(--md-sys-color-outline-variant)"
        style={{ background: value }}
      />
      <span className="flex min-w-0 flex-col">
        <span className={`truncate ${T_BODY_MD}`}>
          {role}
          {kern ? (
            <span
              className={`ml-1 rounded-full bg-(--md-sys-color-tertiary-container) px-1.5 py-px ${T_CODE} text-(--md-sys-color-on-tertiary-container)`}
            >
              kern
            </span>
          ) : null}
        </span>
        <span className={`${T_CODE} text-(--md-sys-color-on-surface-variant)`}>
          {value}
        </span>
      </span>
    </li>
  );
}

/** Renders resolved roles natively, so this page proves both platforms agree. */
function RoleProof({ mode }: { mode: "light" | "dark" }) {
  const scheme = mode === "light" ? LIGHT : DARK;
  return (
    <View
      style={{
        gap: 10,
        backgroundColor: scheme.color.surface,
        padding: 12,
        borderRadius: Number.parseFloat(scheme.shape.medium),
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "600" }}>
        Roles resolve natively
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["primary", "secondary", "tertiary", "error"] as const).map(
          (role) => (
            <View
              key={role}
              style={{
                flex: 1,
                height: 40,
                borderRadius: Number.parseFloat(scheme.shape.small),
                backgroundColor: scheme.color[role],
              }}
            />
          ),
        )}
      </View>
    </View>
  );
}

function ThemePage() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div
          className="mx-auto flex max-w-[64rem] flex-col gap-10 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14"
          data-copy-md-root
        >
          <header className="flex flex-col gap-3">
            <Kicker>Theme</Kicker>
            <h1 className={`m-0 ${T_PAGE} text-(--md-sys-color-on-surface)`}>
              One theme source, both platforms
            </h1>
            <p
              className={`m-0 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
            >
              <code>@xoroh/kern-tokens</code> is platform-free: no React, no
              DOM. Web reads OKLCH CSS variables, native reads compiled sRGB,
              and both resolve the same {ROLE_COUNT} roles. Every swatch on this
              page is read from the package, not copied into the site. This page
              is the reference — what the roles resolve to. What the roles MEAN
              and where each one goes lives on{" "}
              <a
                href="/foundations/color"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                Foundations — Color
              </a>
              ; changing the values lives in the{" "}
              <a
                href="/theme-configurator"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                theme configurator
              </a>
              .
            </p>
            <div>
              <CopyMarkdownButton />
            </div>
          </header>

          <section className="flex flex-col gap-4">
            <h2 id="color-roles" className={`m-0 ${T_SECTION}`}>
              Color roles
            </h2>
            <p
              className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
            >
              A role is a decision, not a color. <code>primary</code> means
              &ldquo;the brand accent&rdquo;; the value behind it can change
              without a component knowing. All {ROLE_COUNT} roles, grouped by
              the role-grammar bands — the same bands the Color page renders,
              read from the same source, so the two pages cannot disagree. Roles
              marked kern are kern additions, not Material 3&apos;s.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {COLOR_GROUPS.map((band) => (
                <div key={band.group} className="flex flex-col gap-2">
                  <h3
                    id={`role-group-${band.group}`}
                    className={`m-0 ${T_SMALL_TITLE} text-(--md-sys-color-on-surface)`}
                  >
                    {band.label} · {band.roles.length}
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {band.roles.map((role) => (
                      <Swatch
                        key={role.name}
                        role={role.name}
                        value={
                          (LIGHT.color as Record<string, string>)[role.name] ??
                          "—"
                        }
                        kern={role.kernExtra}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 id="shape-ladder" className={`m-0 ${T_SECTION}`}>
              Shape ladder
            </h2>
            <p
              className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
            >
              {SHAPE_KEYS.length} corner roles, from <code>none</code> to{" "}
              <code>full</code>. Components reference the role, never a literal
              radius.
            </p>
            <PreviewGrid>
              {SHAPE_KEYS.map((key) => (
                <Preview key={key} label={`${key} · ${LIGHT.shape[key]}`}>
                  <div
                    className="size-16 bg-(--md-sys-color-primary-container)"
                    style={{ borderRadius: LIGHT.shape[key] }}
                  />
                </Preview>
              ))}
            </PreviewGrid>
          </section>

          <section className="flex flex-col gap-4">
            <h2 id="contrast-levels" className={`m-0 ${T_SECTION}`}>
              Contrast levels
            </h2>
            <p
              className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
            >
              A contrast level resolves to a whole scheme, not a filter. Each
              tile below is read straight from the theme package.
            </p>
            <PreviewGrid>
              {CONTRAST_MODES.map((level) => {
                const resolved = resolveThemeDetails("light", level);
                return (
                  <Preview key={level} label={`contrast — ${level}`}>
                    <div
                      className="flex h-24 w-full flex-col justify-center gap-2 rounded-(--md-sys-shape-corner-medium) p-3"
                      style={{
                        background: resolved.color.surface,
                        border: `1px solid ${resolved.color.outline}`,
                      }}
                    >
                      <span
                        className={`rounded-(--md-sys-shape-corner-full) px-3 py-1 text-center ${T_LABEL}`}
                        style={{
                          background: resolved.color.primaryContainer,
                          color: resolved.color.onPrimaryContainer,
                        }}
                      >
                        primaryContainer
                      </span>
                      <span
                        className={`rounded-(--md-sys-shape-corner-full) px-3 py-1 text-center ${T_LABEL}`}
                        style={{
                          background: resolved.color.errorContainer,
                          color: resolved.color.onErrorContainer,
                        }}
                      >
                        errorContainer
                      </span>
                    </div>
                  </Preview>
                );
              })}
            </PreviewGrid>
          </section>

          <section className="flex flex-col gap-4">
            <h2 id="the-same-roles-rendering" className={`m-0 ${T_SECTION}`}>
              The same roles, rendering
            </h2>
            <p
              className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
            >
              These components read the roles above and nothing else.
            </p>
            <PreviewGrid>
              <Preview label="Button — every variant" span={3}>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button>Primary</Button>
                  <Button variant="tonal">Tonal</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
                    Error
                  </Button>
                </div>
              </Preview>
              <Preview label="Card · Chip · Badge" span={3}>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Card variant="elevated" className="p-5">
                    <p className={`m-0 ${T_BODY_MD}`}>Card surface</p>
                  </Card>
                  <Chip variant="filter" defaultSelected>
                    Filter
                  </Chip>
                  <Badge>7</Badge>
                </div>
              </Preview>
            </PreviewGrid>
          </section>

          <section className="flex flex-col gap-4">
            <h2 id="and-on-mobile" className={`m-0 ${T_SECTION}`}>
              And on mobile
            </h2>
            <p
              className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
            >
              The native side resolves the identical scheme, so a role means the
              same thing on both platforms.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PhonePreview label="light scheme" scheme="light">
                <RoleProof mode="light" />
              </PhonePreview>
              <PhonePreview label="dark scheme" scheme="dark">
                <RoleProof mode="dark" />
              </PhonePreview>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 id="configure-it" className={`m-0 ${T_SECTION}`}>
              Configure it
            </h2>
            <p
              className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
            >
              This page resolves; it does not configure. Seed, presets, contrast
              levels, radius authoring and preset export live in the{" "}
              <a
                href="/theme-configurator"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                theme configurator
              </a>{" "}
              — every token there is also a CSS variable, so a project can read
              one without importing anything, e.g.{" "}
              <code>--md-sys-color-primary</code>.
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
