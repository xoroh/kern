/**
 * /foundations/accessibility — the accessibility statement for kern.
 *
 * Honest content only. What the repository can evidence today: a contrast
 * gate over the token pairs (`bun run check:contrast`), and the verified
 * limits of the suite (no e2e/browser layer, no visual regression — see
 * `docs/verification-limits.md`, quoted on /docs/contributing). What it
 * cannot evidence: a WCAG conformance level. That claim needs an audit
 * first, so this page makes none — it states the target, the check that
 * runs, the known gap, and where to report barriers.
 *
 * The "what to build to" section below is operational rather than aspirational:
 * every number in it is read from the same files the gates read (the contrast
 * script, tokens.json, the site's own focus and skip-link chrome), so the
 * page cannot drift from what the tree actually asserts.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Kicker } from "../../components/chrome/kicker";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_CODE,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import { INK, INK_SOFT, LINK } from "../../domains/shared/systems/ui";

export const Route = createFileRoute("/foundations/accessibility")({
  head: () =>
    routeHead(
      "Accessibility",
      "Kern targets WCAG 2.2 AA — what is checked, what is not, and how to report a barrier.",
    ),
  component: Accessibility,
});

const REPO = "https://github.com/xoroh/kern";
const CODE = `rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high) px-1.5 py-0.5 ${T_CODE}`;
const PROSE = `m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`;

/** One "build to this" rule: the law, then the evidence for it. */
function Rule({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 id={id} className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
        {title}
      </h3>
      <div className="flex max-w-[62ch] flex-col gap-2">{children}</div>
    </div>
  );
}

function Accessibility() {
  return (
    <SiteLayout>
      <PageCard gap={12}>
        <header className="flex flex-col gap-3">
          <Kicker className={INK_SOFT}>Accessibility</Kicker>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Accessibility statement</h1>
          <p className={PROSE}>
            Kern targets WCAG 2.2 AA for everything it ships. This page states
            what is checked today, what is not yet checked, and how to report a
            barrier. It claims no conformance level — that needs an audit first.
          </p>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 id="build-to-this" className={`m-0 ${T_SECTION} ${INK}`}>
              What everything is built to
            </h2>
            <p className={PROSE}>
              The rules below are not aspirations — they are the thresholds the
              tokens are gated on and the chrome is built with, so they can be
              checked against this site rather than taken on trust.
            </p>
          </div>

          <Rule id="the-pairing-law" title="The colour pairing law">
            <p className={PROSE}>
              Body text needs <strong className={INK}>4.5:1</strong> against its
              background; large text and UI components need{" "}
              <strong className={INK}>3:1</strong>. In practice that means every
              text role ships with the ink it was gated against — a fill role is
              lettered by its on-companion, and pairing a role with itself is
              the one combination the system cannot promise. The rules and their
              live samples are on{" "}
              <Link
                to="/foundations/m3/$page"
                params={{ page: "color" }}
                hash="the-pairing-law"
                className={LINK}
              >
                Material 3 — Color, the pairing law
              </Link>
              .
            </p>
          </Rule>

          <Rule id="targets" title="48dp targets">
            <p className={PROSE}>
              Controls are built to Material 3&apos;s{" "}
              <strong className={INK}>48dp target floor</strong>: a 24dp glyph
              sits on a 48dp button, never the other way round. WCAG exempts
              inline links from a sentence (they are part of the text flow), and
              pointer-only targets may drop to 44dp. A control here that sits
              under the floor is a bug rather than a density decision — the
              report link at the bottom is the right place for it.
            </p>
          </Rule>

          <Rule id="focus" title="Visible focus, and a way past the chrome">
            <p className={PROSE}>
              Keyboard focus is drawn, not assumed: links and buttons carry a{" "}
              <strong className={INK}>2px secondary ring at 2px offset</strong>{" "}
              on <code className={CODE}>:focus-visible</code>. The first
              tabbable element on every page is a skip link that reveals itself
              when focused and jumps to <code className={CODE}>#main</code>, so
              a keyboard or screen-reader reader is never trapped in the header,
              the rail or the footer.
            </p>
          </Rule>

          <Rule id="reduced-motion" title="Reduced motion is honoured">
            <p className={PROSE}>
              Under <code className={CODE}>prefers-reduced-motion: reduce</code>{" "}
              the site sets every transition and animation duration to its
              floor, and the live motion specimens park themselves rather than
              looping. Motion is never the only carrier of a state change.
            </p>
          </Rule>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="checked-today" className={`m-0 ${T_SECTION} ${INK}`}>
            Checked today
          </h2>
          <p className={PROSE}>
            Every token pair ships under a contrast gate:{" "}
            <code className={CODE}>bun run check:contrast</code> asserts the
            colour pairs in the theme meet their ratios, and it runs as a
            required per-PR gate (see{" "}
            <Link to="/docs/contributing" className={LINK}>
              contributing
            </Link>
            ). The M3 state-layer opacities — including the 38% disabled layer —
            are asserted by <code className={CODE}>check:kern</code>.
          </p>
          <p className={PROSE}>What that contrast gate actually asserts:</p>
          <ul className="m-0 flex flex-col gap-2 pl-5">
            <li className={T_BODY}>
              The pairs are <strong className={INK}>generated</strong> from the
              role families, not hand-listed:{" "}
              <strong className={INK}>53 text pairs</strong> — each{" "}
              <code className={CODE}>on&lt;role&gt;</code> on its role, each{" "}
              <code className={CODE}>on&lt;role&gt;Container</code> on its
              container, both content roles across all nine surface roles, the
              inverse pair, each accent base on{" "}
              <code className={CODE}>surface</code>, and the fixed-accent pairs
              — and <strong className={INK}>16 UI pairs</strong>:
              <code className={CODE}>outline</code> against every surface role,
              and each accent family against{" "}
              <code className={CODE}>surface</code>.
            </li>
            <li className={T_BODY}>
              They are measured in every shipped context: 4 theme presets × 2
              schemes × 3 contrast levels —{" "}
              <strong className={INK}>24 contexts, 1,656 checks</strong>. Text
              pairs must clear <strong className={INK}>4.5:1</strong>, and{" "}
              <strong className={INK}>7:1</strong> in the high-contrast
              overlays; UI pairs must clear <strong className={INK}>3:1</strong>
              .
            </li>
            <li className={T_BODY}>
              The <strong className={INK}>orphan law</strong> makes the gate
              falsifiable: a role that exists in a scheme but is reached by no
              generated pair fails unless it is waived BY NAME. Three roles are
              waived today, each with a written reason —{" "}
              <code className={CODE}>scrim</code> (an alpha overlay with no
              fixed backdrop), <code className={CODE}>shadow</code> (an
              elevation tint, never text or a boundary), and{" "}
              <code className={CODE}>outlineVariant</code> (M3&apos;s decorative
              tier, exempt by spec — use <code className={CODE}>outline</code>{" "}
              where a boundary must be perceivable).
            </li>
            <li className={T_BODY}>
              Every colour in every preset must resolve to a canonical token
              from <code className={CODE}>tokens.json</code> — a hand-typed hex
              in a theme is a failure, not a customization.
            </li>
          </ul>
          <p className={PROSE}>
            The gate output states the same thing in one line: 53 text + 16 UI
            generated role pairs across 4 presets × 2 modes × 3 contrast levels,
            0 orphan roles, all colours canonical.
          </p>
        </section>

        <div className="flex flex-col gap-3">
          <h2 id="known-gaps" className={`m-0 ${T_SECTION} ${INK}`}>
            Known gaps
          </h2>
          <p className={PROSE}>
            The test suite has{" "}
            <strong className={INK}>no e2e/browser layer</strong> and no visual
            regression coverage (
            <a
              href={`${REPO}/blob/main/docs/verification-limits.md`}
              className={LINK}
            >
              docs/verification-limits.md
            </a>
            ). Keyboard order, focus visibility, and screen-reader behaviour are
            therefore reviewed by hand, not proven by a gate. The contrast gate
            measures the TOKEN pairs; it does not measure every rendered pixel
            of every page, so a foreground painted from a role the gate does not
            pair is still a judgement call. Until an independent audit happens,
            treat this statement as intent plus the contrast gate — not
            certification.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 id="report-a-barrier" className={`m-0 ${T_SECTION} ${INK}`}>
            Report a barrier
          </h2>
          <p className={PROSE}>
            Found an accessibility barrier in kern or this site?{" "}
            <a href={`${REPO}/issues`} className={LINK}>
              File it on the GitHub issue tracker
            </a>{" "}
            using the bug template — say what you used (keyboard, screen reader
            and version, browser) and what blocked you. For a security-sensitive
            report, see{" "}
            <a href={`${REPO}/blob/main/SECURITY.md`} className={LINK}>
              SECURITY.md
            </a>{" "}
            instead of a public issue.
          </p>
        </div>
      </PageCard>
    </SiteLayout>
  );
}
