/**
 * /styles/$page — one of the seven Foundations pages.
 *
 * The family is generated from the token package (../../foundations/data),
 * and each page renders its own values: the Type page renders each style with
 * its OWN tokens, the Color page draws each role with its OWN value, the
 * Elevation page casts each level's OWN shadow. A wrong token is therefore
 * visible rather than merely wrong.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteLayout } from "../../components/chrome/site-layout";
import {
  COLOR_ROLES,
  ELEVATION_LEVELS,
  KERN_EXTRA_COUNT,
  M3_ROLE_COUNT,
  MOTION_DURATION,
  MOTION_EASING,
  MOTION_SPRING,
  ROLE_BY_NAME,
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
          <li>Elevation — {ELEVATION_LEVELS.length} levels (dp and shadow)</li>
          <li>Motion — easings, durations, springs and two schemes</li>
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

      <FSection id="the-pairing-law" title="The pairing law">
        <FProse>
          Text on a role uses that role's on-companion. Putting a role on top of
          itself is the one pairing the system cannot promise — the two values
          can converge, and the text disappears. The samples below are painted
          with the real role values from the theme.
        </FProse>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        </div>
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

/** One pairing-law sample, painted with the theme's own role values. */
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
  const fillRole = ROLE_BY_NAME.get(fill);
  const inkRole = ROLE_BY_NAME.get(ink);
  return (
    <div className={`${F_CARD} flex flex-col gap-2 p-3`}>
      <span className={`m-0 ${T_SMALL_TITLE} ${F_INK}`}>
        {verdict} — {ink} on {fill}
      </span>
      <div
        className="rounded-(--md-sys-shape-corner-small) p-3"
        style={{ background: fillRole?.light, color: inkRole?.light }}
      >
        The quick brown fox
      </div>
      <span className={`m-0 ${T_BODY_SM} ${F_INK_SOFT}`}>{note}</span>
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
        you are looking at. Resting states live on levels 0 to +3; +4 and +5 are
        reserved for hover and for dragged, so an idle surface never sits at the
        top of the stack.
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
          The easing grid, each bar eased by its own curve over a{" "}
          <code>duration.long2</code> step, looping.
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
              <div className="relative mt-2 h-6 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-container-highest)">
                <div
                  className="kern-f-march absolute top-0 h-6 w-6 rounded-full bg-(--md-sys-color-primary)"
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
      className="relative mt-2 h-6 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-container-highest)"
    >
      <div
        ref={dotRef}
        className="absolute top-0 h-6 w-6 rounded-full bg-(--md-sys-color-primary)"
        aria-hidden="true"
      />
    </div>
  );
}

// ------------------------------------------------------------------- states
function StatesPage() {
  return (
    <FSection id="state-layers" title="State layers">
      <FProse>
        A state layer is an overlay that says the surface is doing something.
        Material 3 defines exactly five opacities; kern ships all five. Each
        swatch below paints the layer at its own token opacity — the overlay is
        the value, not a picture of it.
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
              <div className="relative h-8 w-14 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface)">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "var(--md-sys-color-primary)",
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
  );
}
