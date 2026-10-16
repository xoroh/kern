/**
 * /foundations/m3/$page — one Material 3 Foundations page.
 *
 * The family is generated from the token package (content/systems/m3, the
 * M3 system barrel over content/foundations), and each page renders its own
 * values: the Type page renders each style with its OWN tokens, the Color
 * page draws each role with its OWN value, the Elevation page casts each
 * level's OWN shadow. A wrong token is therefore visible rather than merely
 * wrong.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import type { Mode } from "@xoroh/kern-tokens";
import { useEffect, useRef, useState } from "react";
import {
  BASE_ANCHORS,
  COLOR_GROUPS,
  COLOR_ROLES,
  type ColorRole,
  ELEVATION_LEVELS,
  KERN_EXTRA_COUNT,
  M3_ROLE_COUNT,
  MOTION_DURATION,
  MOTION_EASING,
  MOTION_SPRING,
  PALETTES,
  ROLE_COUNT,
  SHAPE,
  SPACING,
  SPECTRUM,
  STATES,
  SURFACE_SLOT_COUNT,
  SURFACE_SLOTS,
  type SurfaceSlot,
  TYPE_STYLE_COUNT,
  TYPE_STYLES,
  USAGE_RULE_COUNT,
  USAGE_RULES,
  USAGE_SCENE_COUNT,
  USAGE_SCENES,
  type UsageRule,
  type UsageScene,
} from "../../../content/systems/m3/foundations";
import { PageCard } from "../../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import { routeHead } from "../../../domains/shared/systems/seo";
import {
  T_BODY_SM,
  T_LABEL,
  T_SMALL_TITLE,
} from "../../../domains/shared/systems/type-scale";
import {
  F_CARD,
  F_INK,
  F_INK_SOFT,
  FControlRow,
  FOUNDATIONS,
  FoundationLayout,
  FProse,
  FSection,
  FSegmented,
  roleVar,
  SchemeScope,
  useScheme,
} from "../../../foundations/shell";

/** The scheme switcher's two segments, in reading order. */
const SCHEMES: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const Route = createFileRoute("/foundations/m3/$page")({
  // Per-page metadata (Phase 3 grammar): the title names the foundations
  // page and the description is its registry one-liner, not the generic
  // sentence shared by all seven. Unknown slugs fall back (the component
  // 404s below).
  head: ({ params }) => {
    const page = FOUNDATIONS.find((p) => p.slug === params.page);
    return routeHead(
      page ? `Material 3 — ${page.title}` : `Material 3 — ${params.page}`,
      page?.oneLiner ??
        "One Material 3 Foundations page, rendered from its own tokens.",
    );
  },
  component: FoundationPage,
});

function FoundationPage() {
  const { page } = Route.useParams();
  if (!FOUNDATIONS.some((p) => p.slug === page)) throw notFound();

  return (
    <SiteLayout>
      <PageCard>
        <FoundationLayout slug={page}>
          {page === "color" ? <ColorPage /> : null}
          {page === "type" ? <TypePage /> : null}
          {page === "tokens" ? <TokensPage /> : null}
          {page === "elevation" ? <ElevationPage /> : null}
          {page === "shape" ? <ShapePage /> : null}
          {page === "motion" ? <MotionPage /> : null}
          {page === "states" ? <StatesPage /> : null}
        </FoundationLayout>
      </PageCard>
    </SiteLayout>
  );
}

// ------------------------------------------------------------------- tokens
function TokensPage() {
  return (
    <>
      <FSection id="what-a-token-is" title="What a token is">
        <FProse>
          A token is a named value. Components reference the name; the value
          lives in one place. Change the value and every component that reads it
          changes together — that is the entire argument for the layer.
        </FProse>
      </FSection>
      <FSection id="groups" title="What kern ships">
        <ul className="m-0 flex flex-col gap-1 pl-5">
          <li>Colour — {ROLE_COUNT} roles per scheme</li>
          <li>Type — {TYPE_STYLE_COUNT} styles</li>
          <li>Shape — {SHAPE.length} corner roles</li>
          <li>Elevation — {ELEVATION_LEVELS.length} levels (dp and shadow)</li>
          <li>Motion — easings, durations, springs and two schemes</li>
          <li>States — {STATES.length} layer opacities</li>
          <li>Spacing — {SPACING.length} steps (this page, below)</li>
        </ul>
      </FSection>

      <FSection id="dtcg-projection" title="DTCG interchange notes">
        <FProse>
          The DTCG document (<code>@xoroh/kern-tokens/dtcg.json</code>, DTCG
          2025.10) is the interchange contract, not the storage — three
          projections are deliberate and documented, not silent. Elevation{" "}
          <code>shadow</code> projects the first layer only (the full CSS plus{" "}
          <code>shadowDark</code> live in extensions), motion scheme selections
          emit as string names to avoid dangling refs, and only
          standard-contrast sys tokens are emitted (contrast overlays are a
          theme-catalog concern). See <code>dtcg/export.ts</code>.
        </FProse>
      </FSection>

      <FSection id="spacing-scale" title="Spacing scale">
        <FProse>
          {SPACING.length} steps, each drawn at its own width — the bar IS the
          token, so a wrong value shows as a wrong bar rather than a wrong
          number beside a right one.
        </FProse>
        <FProse>
          One note on where this lives: Material 3 documents spacing as a page
          of its own (<code>styles/spacing.md</code>), and kern ships the same
          scale — but as a token group, not a foundation of its own. So it is
          folded into Tokens here, deliberately rather than forgotten: shape,
          elevation, motion and states each get a page because they carry rules,
          while spacing carries values, and the values are read from this one
          table.
        </FProse>
        <div className="flex flex-col gap-2">
          {SPACING.map((leaf) => (
            <div key={leaf.key} className="flex items-center gap-3">
              <span
                className={`w-24 shrink-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}
              >
                {leaf.key}
              </span>
              <div
                aria-hidden="true"
                className="h-4 rounded-(--sys-shape-corner-small) bg-(--sys-color-primary)"
                style={{ width: String(leaf.value) }}
              />
              <span className={`font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                {String(leaf.value)}
              </span>
            </div>
          ))}
        </div>
      </FSection>
    </>
  );
}

// -------------------------------------------------------------------- color
function ColorPage() {
  // The switcher repaints the SPECIMENS, not the site: every swatch group
  // below sits in a SchemeScope, which resolves this mode and writes the role
  // table on as CSS variables — so the matrix, the pairing samples, the slot
  // fills and the scene cards all paint the selected scheme's real values.
  const [mode, setMode] = useState<Mode>("light");
  // ROLE-COUNT-CORRECTION, folded in. The counts below are computed from the
  // theme, never typed. kern ships ROLE_COUNT roles; M3_ROLE_COUNT of them are
  // Material 3's and KERN_EXTRA_COUNT are registered kern deviations (K2
  // status roles, K3 surfaceTonal). Prose claiming "45 roles" would assert
  // something the package does not contain.
  return (
    <>
      <FControlRow
        label="Scheme"
        note="Every swatch group below is painted by this control — card, fill, ink and hairline all read the selected scheme's roles, not a screenshot of them."
      >
        <FSegmented
          label="Scheme"
          value={mode}
          options={SCHEMES}
          onChange={setMode}
        />
      </FControlRow>

      <FSection
        id="roles-are-decisions"
        title="Roles are decisions, not colours"
      >
        <FProse>
          A role is a job, not a hue. <code>primary</code> means "the brand
          accent"; the value behind it can change without a single component
          changing. kern ships {ROLE_COUNT} roles per scheme — {M3_ROLE_COUNT}{" "}
          are Material 3's, and {KERN_EXTRA_COUNT} are kern's own, each
          registered with an id in the deviations registry rather than quietly
          non-standard.
        </FProse>
      </FSection>

      <FSection id="the-pairing-law" title="The pairing law">
        <FProse>
          Text on a role uses that role's on-companion. Putting a role on top of
          itself is the one pairing the system cannot promise — the two values
          can converge, and the text disappears. The samples below are painted
          with the real role values of the selected scheme.
        </FProse>
        <SchemeScope
          mode={mode}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <PairingSample
            verdict="Do"
            fill="primary"
            ink="onPrimary"
            note="The pair Material 3 defines: primary behind, onPrimary in front."
          />
          <PairingSample
            verdict="Do"
            fill="error"
            ink="onError"
            note="Same law on the error pair — the on-role is the only promised ink."
          />
          <PairingSample
            verdict="Don't"
            fill="primary"
            ink="primary"
            note="The same role on both sides. Nothing guarantees these two ever separate."
          />
        </SchemeScope>
      </FSection>

      <FSection id="where-roles-go" title="Where roles go">
        <FProse>
          The matrix below answers what roles exist; this map answers where each
          one goes. {SURFACE_SLOT_COUNT} surface slots, from the page itself up
          the container ladder to brand, status and inverse — every one of the{" "}
          {ROLE_COUNT} roles appears as a fill or an ink somewhere in it, so no
          role ships without guidance. Slots marked kern are the{" "}
          {KERN_EXTRA_COUNT} roles Material 3 does not have.
        </FProse>
        <SchemeScope mode={mode} className="flex flex-col gap-2">
          {SURFACE_SLOTS.map((slot) => (
            <SlotCard key={slot.slot} slot={slot} />
          ))}
        </SchemeScope>
      </FSection>

      <FSection id="usage-rules" title="Usage rules">
        <FProse>
          {USAGE_RULE_COUNT} laws, each demonstrated live with the theme's own
          values. Contrast pairs and tonal pairing are rules here, not advice —
          each names the exact roles the law binds.
        </FProse>
        <SchemeScope mode={mode} className="flex flex-col gap-6">
          {USAGE_RULES.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </SchemeScope>
      </FSection>

      <FSection id="usage-examples" title="Assemblies, live">
        <FProse>
          Rules show pairs; assemblies show the roles doing one job together —
          the backdrop a page gives, the panel a container gives, the accent
          that acts on it. {USAGE_SCENE_COUNT} scenes, every swatch the real
          role value of the scheme selected at the top of this page.
        </FProse>
        <SchemeScope
          mode={mode}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {USAGE_SCENES.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </SchemeScope>
      </FSection>

      <FSection id="the-role-matrix" title="The role matrix">
        <FProse>
          Every role, painted in the scheme you select, with both of its values
          printed beside it — the swatch is the selected one, the muted value is
          the other scheme, so nothing is hidden either way. These are the
          theme's values rendered directly — not a picture of them. The matrix
          is grouped by the role grammar Material 3 names its roles by, so each
          family&apos;s <code>on*</code> pairs sit beside the role they pair
          with. The kern band at the end is the {KERN_EXTRA_COUNT} roles
          Material 3 does not have — kept visibly apart rather than merged into
          the alphabet.
        </FProse>

        <SchemeScope mode={mode} className="flex flex-col">
          {COLOR_GROUPS.map((band) => (
            <div key={band.group} className="mt-6">
              <div className="mb-2 flex items-baseline gap-2">
                <h3
                  className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}
                  id={`band-${band.group}`}
                >
                  {band.label}
                </h3>
                <span className={`m-0 ${T_LABEL} ${F_INK_SOFT}`}>
                  {band.roles.length} roles
                </span>
              </div>
              <div
                className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${band.isKern ? "rounded-(--sys-shape-corner-medium) bg-(--sys-color-tertiary-container)/15 p-2" : ""}`}
              >
                {band.roles.map((role) => (
                  <MatrixRow key={role.name} role={role} />
                ))}
              </div>
            </div>
          ))}
        </SchemeScope>
      </FSection>

      <FSection id="the-kern-extras" title="The kern additions">
        <FProse>
          {KERN_EXTRA_COUNT} roles are kern's, not Material 3's: twelve status
          colours (info, success, warning — each with its on/container pair) and
          one tonal surface role. They exist because product surfaces need to
          say "this went wrong" and "this went right" without borrowing the
          error role, and Material 3 has no vocabulary for it. Each is
          registered, so the departure is auditable rather than invisible. The
          tonal role, <code>surfaceTonal</code>, stands in for M3's
          primary-tinted <code>surface-tint</code> (which kern does not ship): a
          neutral emphasis fill pairing with <code>on-surface</code>, used for
          navigation-bar hovers and stage accents — never for text.
        </FProse>
        <ul className="m-0 flex flex-col gap-1 pl-5">
          {COLOR_ROLES.filter((r) => r.kernExtra).map((r) => (
            <li key={r.name} className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
              {r.name}
            </li>
          ))}
        </ul>
      </FSection>

      <FSection id="where-roles-come-from" title="Where roles come from">
        <FProse>
          Roles are decisions; ramps are the material they are decided from.{" "}
          {BASE_ANCHORS.length} anchors name the starting colors,{" "}
          {PALETTES.length} curated ramps feed the roles, and the{" "}
          {SPECTRUM.length}-hue spectrum is the full tonal field — all three
          generated from the token package, each step carrying its canonical
          oklch and its compiled srgb. This is the same construction the theme
          configurator&apos;s seed walks when it repaints a primary family. They
          sit outside the scheme switcher on purpose: a ramp is what a scheme is
          decided FROM, so it paints the same in both schemes.
        </FProse>
        <h3 className={`m-0 ${T_SMALL_TITLE} ${F_INK}`} id="base-anchors">
          Base anchors — {BASE_ANCHORS.length}
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BASE_ANCHORS.map((a) => (
            <div
              key={a.name}
              className={`${F_CARD} flex items-center gap-3 p-3`}
            >
              <div
                className="h-10 w-14 shrink-0 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant)"
                style={{ background: a.srgb }}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-0.5">
                <span className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}>
                  {a.name}
                </span>
                <span className={`m-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                  {a.srgb}
                </span>
                <span className={`m-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                  {a.oklch}
                </span>
              </div>
            </div>
          ))}
        </div>
        {[
          { id: "palettes", title: "Palettes", ramps: PALETTES },
          { id: "spectrum", title: "Spectrum", ramps: SPECTRUM },
        ].map((group) => (
          <div key={group.id} className="mt-6">
            <h3 className={`m-0 mb-2 ${T_SMALL_TITLE} ${F_INK}`} id={group.id}>
              {group.title} — {group.ramps.length} ramps
            </h3>
            <div className="flex flex-col gap-3">
              {group.ramps.map((ramp) => (
                <div key={ramp.name}>
                  <p className={`m-0 mb-1 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                    {ramp.name}
                  </p>
                  <div
                    role="img"
                    aria-label={`${ramp.name} ramp, ${ramp.steps.length} steps light to dark`}
                    className="flex overflow-hidden rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant)"
                  >
                    {ramp.steps.map((s) => (
                      <div
                        key={s.step}
                        title={`${ramp.name} ${s.step}: ${s.srgb} · ${s.oklch}`}
                        aria-hidden="true"
                        className="h-8 flex-1"
                        style={{ background: s.srgb }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </FSection>
    </>
  );
}

/**
 * One row of the role matrix: the swatch painted by the scope's live role
 * variable, both printed values, and the selected scheme named first so the
 * reader can tell which number the swatch is showing.
 */
function MatrixRow({ role }: { role: ColorRole }) {
  const { mode } = useScheme();
  const other: Mode = mode === "light" ? "dark" : "light";
  return (
    <div className={`${F_CARD} flex items-center gap-3 p-3`}>
      <div
        className="h-10 w-14 shrink-0 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant)"
        style={{ background: roleVar(role.name) }}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}>{role.name}</span>
        <span className={`m-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
          <span className={F_INK}>
            {mode} {mode === "light" ? role.light : role.dark}
          </span>
          <span className="opacity-70">
            {" "}
            · {other} {other === "light" ? role.light : role.dark}
          </span>
        </span>
      </div>
      {role.kernExtra ? (
        <span
          className={`ml-auto shrink-0 rounded-full bg-(--sys-color-tertiary-container) px-2 py-0.5 ${T_LABEL} text-(--sys-color-on-tertiary-container)`}
        >
          kern
        </span>
      ) : null}
    </div>
  );
}

/** One pairing-law sample, painted with the selected scheme's role values. */
function PairingSample({
  verdict,
  fill,
  ink,
  note,
}: {
  verdict: "Do" | "Don't";
  fill: string;
  ink: string;
  note: string;
}) {
  return (
    <div className={`${F_CARD} flex flex-col gap-2 p-3`}>
      <span className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}>
        {verdict} — {ink} on {fill}
      </span>
      <div
        className="rounded-(--sys-shape-corner-small) p-3"
        style={{ background: roleVar(fill), color: roleVar(ink) }}
      >
        The quick brown fox
      </div>
      <span className={`m-0 ${T_BODY_SM} ${F_INK_SOFT}`}>{note}</span>
    </div>
  );
}

/** One surface slot: its fills painted with the selected scheme's values. */
function SlotCard({ slot }: { slot: SurfaceSlot }) {
  const { colors } = useScheme();
  return (
    <div className={`${F_CARD} flex flex-col gap-2 p-3`}>
      <div className="flex flex-wrap items-baseline gap-2">
        <h3
          className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}
          id={`slot-${slot.slot}`}
        >
          {slot.title}
        </h3>
        {slot.kernExtra ? (
          <span
            className={`shrink-0 rounded-full bg-(--sys-color-tertiary-container) px-2 py-0.5 ${T_LABEL} text-(--sys-color-on-tertiary-container)`}
          >
            kern
          </span>
        ) : null}
      </div>
      <span className={`m-0 ${T_BODY_SM} ${F_INK_SOFT}`}>{slot.body}</span>
      <div className="flex flex-wrap gap-2">
        {slot.fills.map((fill) => (
          <div
            key={fill}
            className="flex min-w-36 flex-1 items-center gap-2 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) p-2"
            style={{
              background: roleVar(fill),
              color: slot.ink ? roleVar(slot.ink) : undefined,
            }}
          >
            <span className={`font-mono ${T_LABEL}`}>{fill}</span>
            <span className={`ml-auto ${T_LABEL}`}>
              {slot.ink ? `on ${slot.ink}` : "no ink"}
            </span>
          </div>
        ))}
      </div>
      {slot.inkAlt ? (
        <span className={`m-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
          second ink {slot.inkAlt} · {colors[slot.inkAlt]}
        </span>
      ) : null}
    </div>
  );
}

/** One usage rule: the law, then its live do and don't. */
function RuleCard({ rule }: { rule: UsageRule }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={`m-0 ${T_SMALL_TITLE} ${F_INK}`} id={`rule-${rule.id}`}>
        {rule.title}
      </h3>
      <span className={`m-0 max-w-[62ch] ${T_BODY_SM} ${F_INK_SOFT}`}>
        {rule.body}
      </span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PairingSample
          verdict="Do"
          fill={rule.do.fill}
          ink={rule.do.ink}
          note={rule.do.label}
        />
        <PairingSample
          verdict="Don't"
          fill={rule.dont.fill}
          ink={rule.dont.ink}
          note={rule.dont.label}
        />
      </div>
    </div>
  );
}

/** One composed scene: backdrop, panel, accent — all real role values. */
function SceneCard({ scene }: { scene: UsageScene }) {
  return (
    <div className={`${F_CARD} flex flex-col gap-2 p-3`}>
      <h3 className={`m-0 ${T_SMALL_TITLE} ${F_INK}`} id={`scene-${scene.id}`}>
        {scene.title}
      </h3>
      <div
        className="flex flex-col gap-2 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) p-3"
        style={{ background: roleVar(scene.backdrop) }}
      >
        <div
          className="flex flex-col gap-2 rounded-(--sys-shape-corner-small) p-3"
          style={{
            background: roleVar(scene.panel),
            color: roleVar(scene.panelInk),
          }}
        >
          <span className={`m-0 ${T_SMALL_TITLE}`}>
            {scene.panel} · {scene.panelInk}
          </span>
          <span className={`m-0 ${T_BODY_SM}`}>The quick brown fox</span>
          <span
            className={`self-start rounded-(--sys-shape-corner-full) px-3 py-1 ${T_LABEL}`}
            style={{
              background: roleVar(scene.accent),
              color: roleVar(scene.accentInk),
            }}
          >
            {scene.accent}
          </span>
        </div>
        <span className={`m-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
          {scene.backdrop} behind · {scene.panel} holding · {scene.accent}{" "}
          acting
        </span>
      </div>
      <span className={`m-0 ${T_BODY_SM} ${F_INK_SOFT}`}>{scene.body}</span>
    </div>
  );
}

// --------------------------------------------------------------------- type
function TypePage() {
  // The specimens render with their OWN tokens — each style is set with the
  // same values the token package declares, so a wrong token shows as a wrong
  // specimen rather than hiding behind a hardcoded size.
  return (
    <>
      <FSection id="the-scale" title="The scale">
        <FProse>
          {TYPE_STYLE_COUNT} styles — a baseline and an emphasized tier, each
          carrying family, size, weight, line-height and letter-spacing. Every
          specimen below is set with its own tokens.
        </FProse>
      </FSection>

      <FSection
        id="emphasized-is-opt-in"
        title="Emphasized is opt-in, and you use a subset"
      >
        <FProse>
          Two rules decide how the thirty styles are actually used. Both are
          Material 3&apos;s own, recorded in{" "}
          <code>.agents/skills/kern/references/typography-and-shape.md</code>.
        </FProse>
        <FProse>
          <strong className={F_INK}>
            Emphasized is opt-in, never default.
          </strong>{" "}
          Material components do not use the emphasized tier until a token is
          swapped explicitly — baseline is the default and emphasized is the
          deliberate exception, used for selection, actions, headlines and other
          editorial treatments. Swap the matching style (
          <code>display-large</code> for <code>emphasized.display-large</code>)
          rather than hand-bolding a baseline token: the emphasized tier changes
          weight and tracking together, and hand-bolding only changes one of
          them.
        </FProse>
        <FProse>
          <strong className={F_INK}>The subset rule.</strong> Do not use all
          {TYPE_STYLE_COUNT} styles. Pick a subset with clear size contrast
          between roles — Material anchors on a Major Second scale, base 14 —
          because too many similar sizes destroy hierarchy: a page where every
          role is 16, 18 and 20 is a page with no hierarchy at all. When
          customizing, change the typeface tokens and the line-height and
          tracking around them, never a size — a size change breaks reflow and
          component metrics, and every change is mirrored into both tiers.
        </FProse>
      </FSection>

      <FSection id="specimens" title="Specimens">
        <div className="flex flex-col gap-6">
          {TYPE_STYLES.map((s) => (
            <div key={s.role} className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: s.fontFamily || undefined,
                  fontSize: s.fontSize || undefined,
                  fontWeight: s.fontWeight || undefined,
                  lineHeight: s.lineHeight || undefined,
                  letterSpacing: s.letterSpacing || undefined,
                }}
                className={F_INK}
              >
                The quick brown fox
              </span>
              <span className={`font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                {s.role} · {s.fontSize} · {s.fontWeight} · {s.lineHeight}
              </span>
            </div>
          ))}
        </div>
      </FSection>
    </>
  );
}

// ---------------------------------------------------------------- elevation
function ElevationPage() {
  return (
    <FSection id="levels" title="The levels">
      <FProse>
        {ELEVATION_LEVELS.length} levels, read from the token package. Level 0
        is no shadow at all — that is a decision, not an absence of one. Each
        card below is raised by its OWN shadow value, so the level is the thing
        you are looking at. Resting states live on levels 0 to +3; levels 4 and
        5 are interaction-only — reserved for hover and for dragged — so an idle
        surface never sits at the top of the stack.
      </FProse>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ELEVATION_LEVELS.map((level) => (
          <div key={level.level} className="flex flex-col gap-2">
            <div
              className={`${F_CARD} flex h-24 items-center justify-center p-3`}
              style={{ boxShadow: String(level.shadow) }}
            >
              <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                {level.level} · {String(level.dp)}
              </span>
            </div>
            <span className={`font-mono ${T_LABEL} ${F_INK_SOFT}`}>
              {String(level.shadow)}
            </span>
          </div>
        ))}
      </div>
    </FSection>
  );
}

// -------------------------------------------------------------------- shape
function ShapePage() {
  return (
    <>
      <FSection id="corner-scale" title="The corner scale">
        <FProse>
          {SHAPE.length} corner roles, from none to full. Components reference
          the role, never a literal corner radius. The Expressive additions —
          large-increased 20px, extra-large-increased 32px, extra-extra-large
          48px — are Material 3's own May-2025 tokens, adopted per D-026.4.
          Adopting them is conformity, not a kern decision; the recorded
          decision is the adoption itself. kern's own shape decision is the
          pill-heavy defaults.
        </FProse>
      </FSection>
      <FSection id="ladder" title="The ladder">
        <div className="flex flex-wrap items-end gap-4">
          {SHAPE.map((leaf) => (
            <div key={leaf.key} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 border border-(--sys-color-outline-variant) bg-(--sys-color-primary-container)"
                style={{ borderRadius: String(leaf.value) }}
                aria-hidden="true"
              />
              <span className={`font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                {leaf.key}
              </span>
              <span className={`font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                {String(leaf.value)}
              </span>
            </div>
          ))}
        </div>
      </FSection>
    </>
  );
}

// ------------------------------------------------------------------- motion
/**
 * The easing demos: one bar per easing curve, animated by that curve's OWN
 * value against a real duration token, looping forever (parked under
 * prefers-reduced-motion). The keyframes live in one style block so the demo
 * stays data — the timing is always the token's.
 */
const MOTION_STYLE = `
@keyframes kern-f-march {
  from { left: 0; }
  to { left: calc(100% - 1.5rem); }
}
@media (prefers-reduced-motion: reduce) {
  .kern-f-march { animation: none !important; left: calc(50% - 0.75rem); }
}
`;

function MotionPage() {
  const duration = String(
    MOTION_DURATION.find((l) => l.key === "duration.long2")?.value ??
      MOTION_DURATION[0]?.value ??
      "0ms",
  );
  return (
    <>
      <style>{MOTION_STYLE}</style>
      <FSection id="scheme" title="Spring first, easing as the fallback">
        <FProse>
          kern animates with springs as the primary scheme and easing curves as
          the fallback — a registered decision (K7), not a default nobody chose.
          The full grid ships: {MOTION_SPRING.length} springs,{" "}
          {MOTION_EASING.length} easings, {MOTION_DURATION.length} durations and
          two named schemes. Every demo below runs on the token value shown
          beside it.
        </FProse>
      </FSection>

      <FSection id="foundations-only" title="Foundations only, by decision">
        <FProse>
          Motion lives here and nowhere else: the token grammar carries no
          per-component motion slot, so a component never names its own curve,
          duration or spring. Shared motion keeps every surface moving on the
          same physics; a component that needs to move differently reaches for
          this grid, not for a private vocabulary.
        </FProse>
      </FSection>

      <FSection id="springs" title="Springs, live">
        <FProse>
          Each dot is integrated by its own spring — stiffness and damping
          straight from the token package. Watch the settle: a fast spring
          snaps, a slow one overshoots and eases in.
        </FProse>
        <ul className="m-0 flex flex-col gap-2">
          {MOTION_SPRING.map((s) => (
            <li key={s.name} className={`${F_CARD} p-3`}>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                  spring.{s.name}
                </span>
                <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
                  stiffness {s.stiffness} · damping {s.damping}
                </span>
              </div>
              <SpringTrack stiffness={s.stiffness} damping={s.damping} />
            </li>
          ))}
        </ul>
      </FSection>

      <FSection id="easings" title="Easing curves, live">
        <FProse>
          The easing grid. Every bar is a real animation — its timing function
          is the easing token printed beside it, over a{" "}
          <code>duration.long2</code> step, looping. Seven tokens resolve to six
          curves — <code>standard</code> and <code>emphasized</code> share
          <code>cubic-bezier(0.2, 0, 0, 1)</code> — so the bars are
          one-per-token rather than one-per-distinct-curve. Under{" "}
          <code>prefers-reduced-motion</code> the bars stop and rest centred.
        </FProse>
        <ul className="m-0 flex flex-col gap-2">
          {MOTION_EASING.map((leaf) => (
            <li key={leaf.key} className={`${F_CARD} p-3`}>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                  {leaf.key}
                </span>
                <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
                  {String(leaf.value)} · {duration}
                </span>
              </div>
              <div className="relative mt-2 h-6 rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-highest)">
                <div
                  className="kern-f-march absolute top-0 h-6 w-6 rounded-full bg-(--sys-color-primary)"
                  style={{
                    animationName: "kern-f-march",
                    animationDuration: duration,
                    animationTimingFunction: String(leaf.value),
                    animationIterationCount: "infinite",
                    animationDirection: "alternate",
                  }}
                  aria-hidden="true"
                />
              </div>
            </li>
          ))}
        </ul>
      </FSection>

      <FSection id="durations" title="The duration ladder">
        <ul className="m-0 flex flex-col gap-2">
          {MOTION_DURATION.map((leaf) => (
            <li
              key={leaf.key}
              className={`${F_CARD} flex items-center justify-between gap-4 p-3`}
            >
              <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                {leaf.key}
              </span>
              <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
                {String(leaf.value)}
              </span>
            </li>
          ))}
        </ul>
      </FSection>
    </>
  );
}

/**
 * One live spring: a dot integrated by `stiffness`/`damping` against a target
 * that flips on a timer. The physics is the token's — if a spring value is
 * wrong, the motion is wrong in exactly the way the token is.
 */
function SpringTrack({
  stiffness,
  damping,
}: {
  stiffness: number;
  damping: number;
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const track = trackRef.current;
    if (!dot || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dot.style.transform = "translateX(50%)";
      return;
    }

    let x = 0;
    let v = 0;
    let target = 1;
    let last = performance.now();
    let raf = 0;
    const flip = window.setInterval(() => {
      target = target === 1 ? 0 : 1;
    }, 1600);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      // A unit-mass damped spring: F = k(target - x) - c·v.
      const a = stiffness * (target - x) - damping * v;
      v += a * dt;
      x += v * dt;
      const travel = track.clientWidth - dot.offsetWidth;
      dot.style.transform = `translateX(${(Math.max(0, Math.min(1, x)) * travel).toFixed(1)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(flip);
    };
  }, [stiffness, damping]);

  return (
    <div
      ref={trackRef}
      className="relative mt-2 h-6 rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-highest)"
    >
      <div
        ref={dotRef}
        className="absolute top-0 h-6 w-6 rounded-full bg-(--sys-color-primary)"
        aria-hidden="true"
      />
    </div>
  );
}

// ------------------------------------------------------------------- states
function StatesPage() {
  return (
    <>
      <FSection id="state-layers" title="State layers">
        <FProse>
          A state layer is an overlay that says the surface is doing something.
          Material 3 defines exactly five opacities; kern ships all five. Each
          swatch below paints the layer at its own token opacity — the overlay
          is the value, not a picture of it.
        </FProse>
        <ul className="m-0 flex flex-col gap-2">
          {STATES.map((leaf) => (
            <li
              key={leaf.key}
              className={`${F_CARD} flex items-center justify-between gap-4 p-3`}
            >
              <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                {leaf.key}
              </span>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-14 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface)">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: "var(--sys-color-primary)",
                      opacity:
                        Number.parseInt(String(leaf.value), 10) / 100 ||
                        undefined,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
                  {String(leaf.value)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </FSection>

      <FSection id="state-layer-semantics" title="What each state means">
        <FProse>
          Six states exist — enabled, disabled, hover, focus, press, drag — and
          the layer is one <code>on-color</code> overlay at a fixed opacity. The
          numbers above are the law, not a preference: Material 3&apos;s four
          are published in{" "}
          <code>docs/design-systems/m3-usable/tokens/state.md</code> and kern
          ships them verbatim (hover 8%, focus 10%, press 10%, drag 16%) plus
          its disabled 38%. <code>check:kern</code> asserts all five and rejects
          a sixth — a sixth would be a kern extension, not an M3 state. The full
          interaction reading lives in{" "}
          <code>.agents/skills/kern/references/interaction-states.md</code>.
        </FProse>
        <ul className="m-0 flex flex-col gap-2 pl-5">
          <li>
            <strong className={F_INK}>Hover, 8%</strong> — the cursor paused on
            a target. It fades in and only one layer is on at a time.
          </li>
          <li>
            <strong className={F_INK}>Focus, 10%</strong> — tab or voice focus.
            Focus also needs a VISIBLE RING, and a ring is not an opacity: it is
            an outline treatment (a colour role plus a width), so it spends{" "}
            <code>--sys-color-secondary</code> and never a state token. On this
            site that ring is 2px with a 2px offset, the same ring every control
            in the chrome carries.
          </li>
          <li>
            <strong className={F_INK}>Press, 10%</strong> — the target is held
            down; the layer reads as the press landing.
          </li>
          <li>
            <strong className={F_INK}>Drag, 16%</strong> — the surface is being
            moved, on cards, chips, lists and sliders only.
          </li>
          <li>
            <strong className={F_INK}>Disabled, 38%</strong> — colour and
            elevation change instead of a layer. Disabled is exempt from the
            contrast requirement and is not focusable, hoverable or draggable.
          </li>
        </ul>
        <FProse>
          Two sizes govern the mechanic: the layer is drawn at 40dp and the
          target under it is 48dp — the layer is the feedback, the target is the
          floor. One layer at a time, combinable with a selected or activated
          state.
        </FProse>
        <FProse>
          <strong className={F_INK}>Inheritance is not blanket.</strong> Hover
          and press inherit to buttons, cards, chips, lists and inputs. They do
          not inherit to app bars, badges, dialogs, menus, navigation shells,
          tabs or sheets — only the actionable control INSIDE those gets a
          layer. When you are auditing a screen, check the inner control, not
          the container: a hovered dialog is wrong, a hovered dialog button is
          right.
        </FProse>
      </FSection>
    </>
  );
}
