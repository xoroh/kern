/**
 * /foundations/m3/theme — the Material 3 theme REFERENCE page (theory, not
 * configuration).
 *
 * Foundations/G split: this page answers "what do the roles resolve to" —
 * every swatch read from the package, both schemes, both platforms. It does
 * not configure: seed, presets, contrast authoring and radius scaling live
 * in the theme configurator (Playground), linked from the "Configure it"
 * section below. Role MEANING and role→surface usage live on
 * /foundations/m3/color; this page renders the resolved VALUES, grouped by
 * the same role-grammar bands.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Card, Chip } from "@xoroh/kern";
import {
  type Contrast,
  type Mode,
  resolveThemeDetails,
} from "@xoroh/kern-tokens";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { CopyMarkdownButton } from "../../../components/chrome/copy-markdown-button";
import { Kicker } from "../../../components/chrome/kicker";
import { PhonePreview } from "../../../components/preview/phone";
import { Preview, PreviewGrid } from "../../../components/preview/preview";
import { COLOR_GROUPS } from "../../../content/systems/m3/foundations";
import { PageCard } from "../../../domains/shared/chrome/page-card";
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
import { LINK } from "../../../domains/shared/systems/ui";
import {
  FControlRow,
  FSegmented,
  roleVar,
  SchemeScope,
} from "../../../foundations/shell";

export const Route = createFileRoute("/foundations/m3/theme")({
  head: () =>
    routeHead(
      "Material 3 — Theme",
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

const SCHEME_OPTIONS: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];
const CONTRAST_OPTIONS: { value: Contrast; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function Swatch({
  role,
  active,
  other,
  kern,
}: {
  role: string;
  /** The selected scheme's value, named — painted by the swatch. */
  active: string;
  /** The other scheme's value, named — printed muted, never hidden. */
  other: string;
  kern?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-7 shrink-0 rounded-(--sys-shape-corner-extra-small) border border-(--sys-color-outline-variant)"
        style={{ background: roleVar(role) }}
      />
      <span className="flex min-w-0 flex-col">
        <span className={`truncate ${T_BODY_MD}`}>
          {role}
          {kern ? (
            <span
              className={`ml-1 rounded-full bg-(--sys-color-tertiary-container) px-1.5 py-px ${T_CODE} text-(--sys-color-on-tertiary-container)`}
            >
              kern
            </span>
          ) : null}
        </span>
        <span className={`${T_CODE} text-(--sys-color-on-surface-variant)`}>
          <span className="text-(--sys-color-on-surface)">{active}</span>
          <span className="opacity-70"> · {other}</span>
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
  // The switchers repaint the SWATCHES on this page, never the site chrome:
  // the matrix below is scoped to the selected scheme + contrast, so what it
  // shows is exactly what `resolveThemeDetails(mode, contrast)` ships rather
  // than a light-scheme screenshot with a dark-scheme caption.
  const [mode, setMode] = useState<Mode>("light");
  const [contrast, setContrast] = useState<Contrast>("standard");
  const scheme = useMemo(
    () => resolveThemeDetails(mode, contrast),
    [mode, contrast],
  );
  const schemeColors = scheme.color as Record<string, string>;
  const otherMode: Mode = mode === "light" ? "dark" : "light";
  const otherColors = useMemo(
    () =>
      resolveThemeDetails(otherMode, contrast).color as Record<string, string>,
    [otherMode, contrast],
  );

  return (
    <SiteLayout>
      <PageCard gap={10} copyMd>
        <header className="flex flex-col gap-3">
          <Kicker>Theme</Kicker>
          <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
            One theme source, both platforms
          </h1>
          <p className={`m-0 ${T_BODY} text-(--sys-color-on-surface-variant)`}>
            <code>@xoroh/kern-tokens</code> is platform-free: no React, no DOM.
            Web reads OKLCH CSS variables, native reads compiled sRGB, and both
            resolve the same {ROLE_COUNT} roles. Every swatch on this page is
            read from the package, not copied into the site, and the two
            controls below repaint them live — scheme and contrast are resolved
            the same way an app resolves them. This page is the reference — what
            the roles resolve to. What the roles MEAN and where each one goes
            lives on{" "}
            <Link
              to="/foundations/m3/$page"
              params={{ page: "color" }}
              className={LINK}
            >
              Material 3 — Color
            </Link>
            ; changing the values lives in the{" "}
            <Link to="/theme-configurator" className={LINK}>
              theme configurator
            </Link>
            .
          </p>
          <div>
            <CopyMarkdownButton />
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <FControlRow
            label="Scheme"
            note="Repaints the role matrix below with the selected scheme's resolved values."
          >
            <FSegmented
              label="Scheme"
              value={mode}
              options={SCHEME_OPTIONS}
              onChange={setMode}
            />
          </FControlRow>
          <FControlRow
            label="Contrast"
            note="A contrast level resolves to a whole scheme, not a filter — the matrix repaints with that level's overlay applied."
          >
            <FSegmented
              label="Contrast"
              value={contrast}
              options={CONTRAST_OPTIONS}
              onChange={setContrast}
            />
          </FControlRow>
        </div>

        <section className="flex flex-col gap-4">
          <h2 id="color-roles" className={`m-0 ${T_SECTION}`}>
            Color roles
          </h2>
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            A role is a decision, not a color. <code>primary</code> means
            &ldquo;the brand accent&rdquo;; the value behind it can change
            without a component knowing. All {ROLE_COUNT} roles, grouped by the
            role-grammar bands — the same bands the Color page renders, read
            from the same source, so the two pages cannot disagree. Roles marked
            kern are kern additions, not Material 3&apos;s. The swatch paints
            the selected scheme and contrast; both the selected value and the
            other scheme&apos;s value are printed beneath it, so nothing is
            hidden by the switcher.
          </p>
          <SchemeScope
            mode={mode}
            contrast={contrast}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {COLOR_GROUPS.map((band) => (
              <div key={band.group} className="flex flex-col gap-2">
                <h3
                  id={`role-group-${band.group}`}
                  className={`m-0 ${T_SMALL_TITLE} text-(--sys-color-on-surface)`}
                >
                  {band.label} · {band.roles.length}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {band.roles.map((role) => (
                    <Swatch
                      key={role.name}
                      role={role.name}
                      active={`${mode} ${schemeColors[role.name] ?? "—"}`}
                      other={`${otherMode} ${otherColors[role.name] ?? "—"}`}
                      kern={role.kernExtra}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </SchemeScope>
        </section>

        <section className="flex flex-col gap-4">
          <h2 id="shape-ladder" className={`m-0 ${T_SECTION}`}>
            Shape ladder
          </h2>
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            {SHAPE_KEYS.length} corner roles, from <code>none</code> to{" "}
            <code>full</code>. Components reference the role, never a literal
            radius. Shape does not move with the scheme — a corner is a decision
            about geometry, so the ladder renders the same in both schemes and
            at every contrast level.
          </p>
          <PreviewGrid>
            {SHAPE_KEYS.map((key) => (
              <Preview key={key} label={`${key} · ${LIGHT.shape[key]}`}>
                <div
                  className="size-16 bg-(--sys-color-primary-container)"
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
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            A contrast level resolves to a whole scheme, not a filter. The three
            tiles below are read straight from the theme package in the scheme
            selected above, and the level the rest of this page is showing is
            marked.
          </p>
          <PreviewGrid>
            {CONTRAST_MODES.map((level) => {
              const resolved = resolveThemeDetails(mode, level);
              return (
                <Preview
                  key={level}
                  label={`contrast — ${level}${level === contrast ? " · active" : ""}`}
                >
                  <div
                    className="flex h-24 w-full flex-col justify-center gap-2 rounded-(--sys-shape-corner-medium) p-3"
                    style={{
                      background: resolved.color.surface,
                      border: `1px solid ${resolved.color.outline}`,
                    }}
                  >
                    <span
                      className={`rounded-(--sys-shape-corner-full) px-3 py-1 text-center ${T_LABEL}`}
                      style={{
                        background: resolved.color.primaryContainer,
                        color: resolved.color.onPrimaryContainer,
                      }}
                    >
                      primaryContainer
                    </span>
                    <span
                      className={`rounded-(--sys-shape-corner-full) px-3 py-1 text-center ${T_LABEL}`}
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
          <h2 id="divergences" className={`m-0 ${T_SECTION}`}>
            Divergences from Material 3
          </h2>
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            Strict to the spec by default; every deliberate departure owned here
            with its rationale, so a reviewer finds decisions, not deviations.
            Component pages register their own departures under Spec — this
            section owns the token-layer ones.
          </p>
          <ul
            className={`m-0 flex list-disc flex-col gap-2 pl-5 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            <li>
              <strong className="text-(--sys-color-on-surface)">
                OKLCH engine, not HCT (ADR-016).
              </strong>{" "}
              Shipped ramps are OKLCH on 50–950 steps and{" "}
              <code>themeFromSeed</code> repaints 12 accent roles; M3 dynamic
              color is HCT with 0–100 ramps, key-color palettes, and full-scheme
              mapping. The spec-correct engine ships as an additive spike (
              <code>hctTonalRamp</code>, <code>hctSchemeRoles</code> in{" "}
              <code>@xoroh/kern-tokens</code>) until the review-gated cutover.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                <code>surfaceTonal</code>, not <code>surface-tint</code> (K3).
              </strong>{" "}
              M3&apos;s primary-tinted <code>surface-tint</code> is not shipped;
              kern&apos;s tonal emphasis fill pairs with <code>on-surface</code>{" "}
              and carries navigation-bar hovers and stage accents.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                <code>FixedDim</code> roles.
              </strong>{" "}
              Tone-invariant fixed dims exist in the MCU scheme tables and are
              kept as kern extensions with the same fill-only contract as fixed
              accents.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                Fixed accents are reference roles.
              </strong>{" "}
              They render in the matrix above and nowhere in production UI —
              prefer non-fixed containers in UI; fixed colors never change tone,
              so they cannot be made contrast-safe per scheme.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                No <code>surface-variant</code>.
              </strong>{" "}
              Absent by design: it is not a current-spec role (only{" "}
              <code>surface</code> / <code>on-surface</code> /{" "}
              <code>on-surface-variant</code>).
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                FAB defaults to <code>surface</code>.
              </strong>{" "}
              The spec default is <code>primary-container</code>; kern&apos;s
              default sits quieter, documented on the FAB&apos;s own page.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                No resting shadow; tonal separation instead.
              </strong>{" "}
              Cards separate by container tone, elevation renders only on
              floating layers — the site law in{" "}
              <code>domains/shared/systems/ui.ts</code>.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                DTCG projection notes.
              </strong>{" "}
              Elevation <code>shadow</code> projects the first layer only (full
              CSS plus <code>shadowDark</code> in extensions), motion scheme
              selections emit as string names, and only standard-contrast sys
              tokens are emitted — see <code>dtcg/export.ts</code>.
            </li>
            <li>
              <strong className="text-(--sys-color-on-surface)">
                Docs chrome is site convention, not M3.
              </strong>{" "}
              Sidebars, code blocks, tables, search palette, breadcrumbs,
              PlatformTabs, pagination cards, admonitions, and the On-this-page
              rail have no M3 counterpart; they compose roles, shape, type, and
              state layers correctly but are catalogued, not conformed.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 id="the-same-roles-rendering" className={`m-0 ${T_SECTION}`}>
            The same roles, rendering
          </h2>
          <p
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            These components read the roles above and nothing else.
          </p>
          <PreviewGrid>
            <Preview label="Button — every variant" span={3}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button>Primary</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="ghost">Ghost</Button>
                <Button className="bg-(--sys-color-error) text-(--sys-color-on-error) hover:bg-(--sys-color-error)/90">
                  Error
                </Button>
              </div>
            </Preview>
            <Preview label="Card · Chip · Badge" span={3}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Card variant="elevated" className="p-6">
                  <p className={`m-0 ${T_BODY_MD}`}>Card surface</p>
                </Card>
                <Chip variant="filter" defaultValue>
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
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            The native side resolves the identical scheme, so a role means the
            same thing on both platforms. Both phones below render the scheme
            natively — no CSS variables involved — at the standard contrast
            level, side by side rather than switched.
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
            className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}
          >
            This page resolves; it does not configure. Seed, presets, contrast
            levels, radius authoring and preset export live in the{" "}
            <Link to="/theme-configurator" className={LINK}>
              theme configurator
            </Link>{" "}
            — every token there is also a CSS variable, so a project can read
            one without importing anything, e.g.{" "}
            <code>--sys-color-primary</code>.
          </p>
        </section>
      </PageCard>
    </SiteLayout>
  );
}
