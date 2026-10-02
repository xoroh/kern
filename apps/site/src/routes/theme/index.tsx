import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Chip, Kbd } from "@xoroh/kern";
import { resolveThemeDetails, resolveThemeLayers } from "@xoroh/kern-tokens";
import { Text, View } from "react-native";
import { SiteLayout } from "../../components/chrome/site-layout";
import { Code } from "../../components/docs/code";
import { PhonePreview } from "../../components/preview/phone";
import { Preview, PreviewGrid } from "../../components/preview/preview";
import { ThemeSwitcher } from "../../components/theme/theme-switcher";

export const Route = createFileRoute("/theme/")({ component: ThemePage });

/** Resolved from the theme package, not hand-copied: these are the real schemes. */
const LIGHT = resolveThemeDetails("light");
const DARK = resolveThemeDetails("dark");
const BRAND_LAYERS = resolveThemeLayers("light", "standard", "brand");
const SHAPE_KEYS = Object.keys(LIGHT.shape) as (keyof typeof LIGHT.shape)[];
const ROLE_COUNT = Object.keys(LIGHT.color).length;
const CONTRAST_MODES = ["standard", "medium", "high"] as const;

const ROLE_GROUPS: { title: string; roles: string[] }[] = [
  {
    title: "Primary",
    roles: ["primary", "onPrimary", "primaryContainer", "onPrimaryContainer"],
  },
  {
    title: "Secondary",
    roles: [
      "secondary",
      "onSecondary",
      "secondaryContainer",
      "onSecondaryContainer",
    ],
  },
  {
    title: "Tertiary",
    roles: [
      "tertiary",
      "onTertiary",
      "tertiaryContainer",
      "onTertiaryContainer",
    ],
  },
  {
    title: "Error",
    roles: ["error", "onError", "errorContainer", "onErrorContainer"],
  },
  { title: "Status", roles: ["success", "warning", "info"] },
  {
    title: "Surface",
    roles: [
      "surface",
      "onSurface",
      "onSurfaceVariant",
      "surfaceContainer",
      "surfaceContainerHigh",
      "surfaceTonal",
    ],
  },
  { title: "Outline", roles: ["outline", "outlineVariant"] },
  {
    title: "Inverse",
    roles: ["inverseSurface", "inverseOnSurface", "inversePrimary"],
  },
];

const PRESET = `import { applyKernTheme, defineThemePreset } from "@xoroh/kern";

const acme = defineThemePreset({
  id: "acme",
  extends: "kern",
  overrides: { color: { light: { primary: "#1e3a8a" } } },
});

applyKernTheme(document.documentElement, "dark", "standard", acme);`;

function Swatch({ role, value }: { role: string; value: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-7 shrink-0 rounded-(--md-sys-shape-corner-extra-small) border border-(--md-sys-color-outline-variant)"
        style={{ background: value }}
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm">{role}</span>
        <span className="font-mono text-xs text-(--md-sys-color-on-surface-variant)">
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
        <div className="mx-auto flex max-w-[64rem] flex-col gap-10 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
              Theme
            </p>
            <h1 className="m-0 text-3xl font-semibold text-(--md-sys-color-on-surface)">
              One theme source, both platforms
            </h1>
            <p className="m-0 text-(--md-sys-color-on-surface-variant)">
              <code>@xoroh/kern-tokens</code> is platform-free: no React, no
              DOM. Web reads OKLCH CSS variables, native reads compiled sRGB,
              and both resolve the same {ROLE_COUNT} roles. Every swatch on this
              page is read from the package, not copied into the site.
            </p>
          </header>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-lg font-semibold">Switch it yourself</h2>
            <ThemeSwitcher />
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-lg font-semibold">Color roles</h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              A role is a decision, not a color. <code>primary</code> means
              &ldquo;the brand accent&rdquo;; the value behind it can change
              without a component knowing.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {ROLE_GROUPS.map((group) => (
                <div key={group.title} className="flex flex-col gap-2">
                  <h3 className="m-0 text-sm font-semibold text-(--md-sys-color-on-surface)">
                    {group.title}
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {group.roles
                      .filter((role) => role in LIGHT.color)
                      .map((role) => (
                        <Swatch
                          key={role}
                          role={role}
                          value={
                            (LIGHT.color as Record<string, string>)[role] ?? "—"
                          }
                        />
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-lg font-semibold">Shape ladder</h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
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
            <h2 className="m-0 text-lg font-semibold">Contrast levels</h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
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
                        className="rounded-(--md-sys-shape-corner-full) px-3 py-1 text-center text-xs"
                        style={{
                          background: resolved.color.primaryContainer,
                          color: resolved.color.onPrimaryContainer,
                        }}
                      >
                        primaryContainer
                      </span>
                      <span
                        className="rounded-(--md-sys-shape-corner-full) px-3 py-1 text-center text-xs"
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
            <h2 className="m-0 text-lg font-semibold">Preset deltas</h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              The <code>brand</code> preset changes{" "}
              {Object.keys(BRAND_LAYERS.deltas).length} of {ROLE_COUNT} roles
              against the <code>m3</code> base. A variant that changes nothing
              is still valid, and still says so here.
            </p>
            <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(BRAND_LAYERS.deltas).map(([role, value]) => (
                <li key={role} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-7 shrink-0 rounded-(--md-sys-shape-corner-extra-small) border border-(--md-sys-color-outline-variant)"
                    style={{ background: value }}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{role}</span>
                    <span className="font-mono text-xs text-(--md-sys-color-on-surface-variant)">
                      {value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-lg font-semibold">
              The same roles, rendering
            </h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
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
                    <p className="m-0 text-sm">Card surface</p>
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
            <h2 className="m-0 text-lg font-semibold">And on mobile</h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              The native side resolves the identical scheme, so a role means the
              same thing on both platforms.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PhonePreview label="light scheme">
                <RoleProof mode="light" />
              </PhonePreview>
              <PhonePreview label="dark scheme">
                <RoleProof mode="dark" />
              </PhonePreview>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-lg font-semibold">Author a theme</h2>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              <code>defineThemePreset</code> rejects unknown roles, reserved
              ids, and non-hex values before anything renders, so a customer
              theme cannot silently break contrast.
            </p>
            <Code>{PRESET}</Code>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              Every token is also a CSS variable, so a project can read one
              without importing anything: <Kbd>--md-sys-color-primary</Kbd>.
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
