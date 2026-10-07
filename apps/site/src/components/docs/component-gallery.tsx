/**
 * The component gallery grid — one component used by `/components` and by the
 * two platform-filtered views.
 *
 * Every card is generated from the content registry (WEB_DOCS / MOBILE_DOCS)
 * plus the generated manifest and maturity source. Nothing here is a hand
 * list: adding a content page adds its card (Q5.7 / Q7.5). The cards show the
 * REAL component when a demo exists (Q4.1 — live from package, never a
 * screenshot) and say plainly when one does not, because a blank tile and a
 * missing demo must not look the same.
 */
import { Link } from "@tanstack/react-router";
import {
  Component,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { MOBILE_DOCS, WEB_DOCS } from "../../content";
import {
  FAMILY_GROUPS,
  type FamilyGroupId,
  familyFor,
} from "../../content/families";
import type { ComponentDoc } from "../../content/types";
import { MOBILE_DEMOS, PREVIEW_REASONS } from "../../demos/mobile/registry";
import { demoFor, WEB_PREVIEW_REASONS } from "../../demos/web/registry";
import { maturityForExports } from "../../systems/maturity";
import {
  T_BODY_SM,
  T_LABEL,
  T_LEAD,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../systems/type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CARD =
  "rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface)";
const CHIP = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) px-2 py-0.5 ${T_LABEL}`;

type GalleryCard = {
  slug: string;
  name: string;
  oneLiner: string;
  web?: ComponentDoc;
  mobile?: ComponentDoc;
};

/** True once the component has mounted on the client (SSR renders false). */
function useClientMount(): boolean {
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  return client;
}

/**
 * One boundary per demo, per the blueprint's state rules: a demo error never
 * swallows the page. The fallback says the honest thing — the demo failed,
 * the component didn't. This is what caught (and contained) Base UI error #73
 * instead of the whole gallery going blank.
 */
class DemoBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full items-center justify-center">
          <span className={`${T_BODY_SM} ${INK_SOFT}`}>
            This demo failed — the component didn't.
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

function collect(platform?: "web" | "mobile"): GalleryCard[] {
  const bySlug = new Map<string, GalleryCard>();
  const take = (doc: ComponentDoc, on: "web" | "mobile") => {
    const existing = bySlug.get(doc.slug) ?? {
      slug: doc.slug,
      name: doc.name,
      oneLiner: doc.oneLiner,
    };
    if (on === "web") existing.web = doc;
    else existing.mobile = doc;
    bySlug.set(doc.slug, existing);
  };
  if (platform !== "mobile") for (const doc of WEB_DOCS) take(doc, "web");
  if (platform !== "web") for (const doc of MOBILE_DOCS) take(doc, "mobile");
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** How many families on a platform have at least one live demo. */
export function demoCoverage(platform: "web" | "mobile"): {
  withDemo: number;
  total: number;
} {
  const docs = platform === "web" ? WEB_DOCS : MOBILE_DOCS;
  const withDemo = docs.filter((doc) => findDemo(doc, platform)).length;
  return { withDemo, total: docs.length };
}

function findDemo(
  doc: ComponentDoc,
  platform: "web" | "mobile",
): (() => ReactElement) | undefined {
  for (const part of doc.parts) {
    const demo =
      platform === "web" ? demoFor(part) : (MOBILE_DEMOS[part] as never);
    if (demo) return demo as () => ReactElement;
  }
  return undefined;
}

/**
 * Why this family shows no live preview, or undefined. PLATFORM-GATED on
 * purpose: the mobile map's reasons describe phone-frame constraints ("in a
 * browser frame", "RNW renderer") that are false on a web card. Web lookups
 * stop at WEB_PREVIEW_REASONS (empty until real web reasons are authored),
 * so demo-less web families honestly render "Demo coming". `platform` is
 * REQUIRED — an optional param is how this regressed the first time, and
 * tsc refuses a missing one.
 */
function previewReason(
  doc: ComponentDoc,
  platform: "web" | "mobile",
): string | undefined {
  const reasons = platform === "web" ? WEB_PREVIEW_REASONS : PREVIEW_REASONS;
  for (const part of doc.parts) {
    const reason = reasons[part];
    if (reason) return reason;
  }
  return undefined;
}

function maturityChip(
  doc: ComponentDoc | undefined,
  platform: "web" | "mobile",
): string | undefined {
  if (!doc) return undefined;
  const row = maturityForExports(
    doc.parts,
    platform === "web" ? "web" : "native",
  );
  return row ? `${row.version} · ${row.state}` : undefined;
}

export function ComponentGallery({
  platform,
}: {
  platform?: "web" | "mobile";
}) {
  const cards = collect(platform);
  const groups: { id: FamilyGroupId; cards: GalleryCard[] }[] = [];
  for (const group of FAMILY_GROUPS) {
    const inGroup = cards.filter((c) => familyFor(c.slug) === group.id);
    if (inGroup.length > 0) groups.push({ id: group.id, cards: inGroup });
  }

  return (
    <div className="flex flex-col gap-10">
      <nav
        className={`flex flex-wrap items-center gap-2 ${T_BODY_SM} ${INK_SOFT}`}
        aria-label="Families"
      >
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#family-${g.id}`}
            className={`${CHIP} no-underline ${INK}`}
          >
            {FAMILY_GROUPS.find((x) => x.id === g.id)?.title} ({g.cards.length})
          </a>
        ))}
      </nav>

      {groups.map((g) => {
        const meta = FAMILY_GROUPS.find((x) => x.id === g.id);
        return (
          <section key={g.id} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id={`family-${g.id}`} className={`m-0 ${T_SECTION} ${INK}`}>
                {meta?.title}
              </h2>
              <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
                {meta?.blurb}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.cards.map((card) => (
                <GalleryCardView key={card.slug} card={card} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function GalleryCardView({ card }: { card: GalleryCard }) {
  // Demos are CLIENT-ONLY. The web demo components are not SSR-safe (they
  // abort the server stream — measured: /components and /components/web
  // SSR-truncated to the head until this gate existed), so the thumbnail
  // renders after mount. The card's text, chips and links are server-rendered
  // regardless; only the preview waits.
  const isClient = useClientMount();
  const primary = card.web ?? card.mobile;
  const primaryPlatform = card.web ? "web" : "mobile";
  const demo = card.web
    ? findDemo(card.web, "web")
    : card.mobile
      ? findDemo(card.mobile, "mobile")
      : undefined;
  // Rendered as a JSX COMPONENT below, never called as a function: a demo
  // called inline would run its hooks as part of THIS component's hook list,
  // and the client-mount flip would change the hook count (React #310).
  const Demo = demo;
  const reason = primary
    ? previewReason(primary, card.web ? "web" : "mobile")
    : undefined;
  const maturity =
    maturityChip(card.web, "web") ?? maturityChip(card.mobile, "mobile");

  return (
    <article className={`${CARD} flex flex-col overflow-hidden`}>
      <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-3">
        {Demo ? (
          isClient ? (
            // The preview is a THUMBNAIL: inert to pointer events so it can
            // never swallow the card's links or trap a click on a demo control.
            // Centered, not top-left: a demo taller than the well used to clip
            // mid-text from the top (Button variants cut off), reading as a
            // rendering bug. Centering clips both edges equally when a demo
            // still overflows, and fits everything shorter exactly.
            <div
              className="pointer-events-none flex max-h-full origin-center items-center justify-center overflow-hidden scale-90"
              aria-hidden="true"
            >
              <DemoBoundary>
                <Demo />
              </DemoBoundary>
            </div>
          ) : null
        ) : reason ? (
          // Demo-less WITH a reason (BootSplash, MilestoneTrio): the reason
          // is full sentences, far taller than the h-36 slot — centered text
          // that tall clips mid-sentence top AND bottom and reads as a
          // rendering bug (review-showcase T4 note). Clamp to 4 lines with a
          // fade so it reads as intentionally shortened; the full sentence
          // stays one hover away via title. "Demo coming" (no reason) is two
          // words and never clamps, so it renders plain with no fade.
          <div className="flex h-full items-center justify-center">
            <span
              className={`${T_BODY_SM} ${INK_SOFT} line-clamp-4 text-center [mask-image:linear-gradient(to_bottom,black_70%,transparent)]`}
              title={reason}
            >
              {reason}
            </span>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className={`${T_BODY_SM} ${INK_SOFT}`}>Demo coming</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/components/$platform/$component"
            params={{
              platform: primaryPlatform,
              component: card.slug,
            }}
            className={`m-0 ${T_SMALL_TITLE} ${INK} no-underline`}
          >
            {primary?.name ?? card.name}
          </Link>
          {card.web ? (
            <Link
              to="/components/$platform/$component"
              params={{ platform: "web", component: card.slug }}
              className={`${CHIP} no-underline ${INK_SOFT}`}
            >
              Web
            </Link>
          ) : null}
          {card.mobile ? (
            <Link
              to="/components/$platform/$component"
              params={{ platform: "mobile", component: card.slug }}
              className={`${CHIP} no-underline ${INK_SOFT}`}
            >
              Native
            </Link>
          ) : null}
        </div>
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{card.oneLiner}</p>
        <div className="flex flex-wrap items-center gap-2">
          {maturity ? (
            <span className={`${CHIP} ${INK_SOFT}`}>{maturity}</span>
          ) : null}
          {card.web && !findDemo(card.web, "web") ? (
            <span className={`${CHIP} ${INK_SOFT}`}>Demo coming</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** The lede under the All gallery's H1 — used only by /components. */
export function GalleryLede() {
  // The All view merges both platforms, so it states both coverages rather
  // than one blended number: a blended "X of Y" would double-count families
  // documented on both platforms. Same R4 rule as the platform views — the
  // coverage gap is stated before anything implies parity of polish.
  const web = demoCoverage("web");
  const mobile = demoCoverage("mobile");
  return (
    <div className="flex flex-col gap-2">
      <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
        Every component family, grouped by the job it does. Cards show the real
        component from the package — the same code you install — and name what
        is missing rather than hiding it.
      </p>
      <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
        Live demos for {web.withDemo} of {web.total} web families and{" "}
        {mobile.withDemo} of {mobile.total} native families — the rest say so on
        their card instead of showing an empty tile.
      </p>
    </div>
  );
}
