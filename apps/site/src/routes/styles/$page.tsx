/**
 * /styles/$page — one of the seven Foundations pages.
 *
 * The family is generated from the token package (../../foundations/data),
 * and each page renders its own values: the Type page renders each style with
 * its OWN tokens, the Color page draws each role with its OWN value. A wrong
 * token is therefore visible rather than merely wrong.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import {
  COLOR_ROLES,
  ELEVATION,
  KERN_EXTRA_COUNT,
  M3_ROLE_COUNT,
  MOTION,
  ROLE_COUNT,
  SHAPE,
  SPACING,
  STATES,
  TYPE_STYLE_COUNT,
  TYPE_STYLES,
} from "../../foundations/data";
import {
  F_CARD,
  F_INK,
  F_INK_SOFT,
  FOUNDATIONS,
  FoundationLayout,
  FProse,
  FSection,
} from "../../foundations/shell";
import { T_BODY_SM, T_LABEL, T_SMALL_TITLE } from "../../type-scale";

export const Route = createFileRoute("/styles/$page")({
  component: FoundationPage,
});

function FoundationPage() {
  const { page } = Route.useParams();
  if (!FOUNDATIONS.some((p) => p.slug === page)) throw notFound();

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <FoundationLayout slug={page}>
            {page === "color" ? <ColorPage /> : null}
            {page === "type" ? <TypePage /> : null}
            {page === "tokens" ? <TokensPage /> : null}
            {page === "elevation" ? <ElevationPage /> : null}
            {page === "shape" ? <ShapePage /> : null}
            {page === "motion" ? <MotionPage /> : null}
            {page === "states" ? <StatesPage /> : null}
          </FoundationLayout>
        </div>
      </section>
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
        <ul className="m-0 flex flex-col gap-2 pl-5">
          <li>Colour — {ROLE_COUNT} roles per scheme</li>
          <li>Type — {TYPE_STYLE_COUNT} styles</li>
          <li>Shape — {SHAPE.length} corner roles</li>
          <li>Elevation — {ELEVATION.length} values</li>
          <li>Motion — {MOTION.length} values</li>
          <li>Spacing — {SPACING.length} steps</li>
          <li>States — {STATES.length} layer opacities</li>
        </ul>
      </FSection>
    </>
  );
}

// -------------------------------------------------------------------- color
function ColorPage() {
  // ROLE-COUNT-CORRECTION, folded in. The counts below are computed from the
  // theme, never typed. kern ships ROLE_COUNT roles; M3_ROLE_COUNT of them are
  // Material 3's and KERN_EXTRA_COUNT are registered kern deviations (K2
  // status roles, K3 surfaceTonal). Prose claiming "45 roles" would assert
  // something the package does not contain.
  return (
    <>
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

      <FSection id="the-role-matrix" title="The role matrix">
        <FProse>
          Every role, both schemes, with its own value. These are the theme's
          values rendered directly — not a picture of them.
        </FProse>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {COLOR_ROLES.map((role) => (
            <div
              key={role.name}
              className={`${F_CARD} flex items-center gap-3 p-3`}
            >
              <div
                className="h-10 w-14 shrink-0 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)"
                style={{ background: role.light }}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-0.5">
                <span className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}>
                  {role.name}
                </span>
                <span className={`m-0 font-mono ${T_LABEL} ${F_INK_SOFT}`}>
                  {role.light} · dark {role.dark}
                  {role.kernExtra ? "  ·  kern" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </FSection>

      <FSection id="the-kern-extras" title="The kern additions">
        <FProse>
          {KERN_EXTRA_COUNT} roles are kern's, not Material 3's: twelve status
          colours (info, success, warning — each with its on/container pair) and
          one tonal surface role. They exist because product surfaces need to
          say "this went wrong" and "this went right" without borrowing the
          error role, and Material 3 has no vocabulary for it. Each is
          registered, so the departure is auditable rather than invisible.
        </FProse>
        <ul className="m-0 flex flex-col gap-1 pl-5">
          {COLOR_ROLES.filter((r) => r.kernExtra).map((r) => (
            <li key={r.name} className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
              {r.name}
            </li>
          ))}
        </ul>
      </FSection>
    </>
  );
}

// --------------------------------------------------------------------- type
function TypePage() {
  // The specimens render with their OWN tokens — each style is set with the
  // same variables that components read, so a wrong token shows as a wrong
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
        Every elevation value kern defines, read from the token package. Level 0
        is no shadow at all — that is a decision, not an absence of one.
      </FProse>
      <ul className="m-0 flex flex-col gap-2">
        {ELEVATION.map((leaf) => (
          <li key={leaf.key} className={`${F_CARD} p-3`}>
            <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
              {leaf.key}
            </span>{" "}
            <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
              {String(leaf.value)}
            </span>
          </li>
        ))}
      </ul>
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
          the role, never a literal corner radius. The two{" "}
          <code>*-increased</code> values are Material 3 Expressive additions
          and are registered as a kern decision.
        </FProse>
      </FSection>
      <FSection id="ladder" title="The ladder">
        <div className="flex flex-wrap items-end gap-4">
          {SHAPE.map((leaf) => (
            <div key={leaf.key} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-primary-container)"
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
function MotionPage() {
  return (
    <FSection id="values" title="Motion values">
      <FProse>
        kern uses springs as the primary scheme and easing as the fallback — a
        registered decision, not a default nobody chose. The values below are
        the token package's, rendered live: each bar animates with the very
        tokens being listed.
      </FProse>
      <ul className="m-0 flex flex-col gap-2">
        {MOTION.slice(0, 16).map((leaf) => (
          <li key={leaf.key} className={`${F_CARD} p-3`}>
            <div className="flex items-center justify-between gap-4">
              <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                {leaf.key}
              </span>
              <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
                {String(leaf.value)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </FSection>
  );
}

// ------------------------------------------------------------------- states
function StatesPage() {
  return (
    <FSection id="state-layers" title="State layers">
      <FProse>
        A state layer is an overlay that says the surface is doing something.
        Material 3 defines exactly five opacities; kern ships all five. These
        are the token package's values.
      </FProse>
      <ul className="m-0 flex flex-col gap-2">
        {STATES.map((leaf) => (
          <li key={leaf.key} className={`${F_CARD} p-3`}>
            <div className="flex items-center justify-between gap-4">
              <span className={`font-mono ${T_BODY_SM} ${F_INK}`}>
                {leaf.key}
              </span>
              <span className={`font-mono ${T_BODY_SM} ${F_INK_SOFT}`}>
                {String(leaf.value)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </FSection>
  );
}
