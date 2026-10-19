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
import { cn } from "@xoroh/kern";
import {
  Component,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
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
import {
  T_BODY_SM,
  T_LABEL,
  T_LABEL_LG,
  T_LEAD,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  INK,
  INK_SOFT,
  PILL_ACTIVE,
  STAGE,
  STATE_LAYERS,
  TRANSITION,
} from "../../domains/shared/systems/ui";
import { maturityForExports } from "../../systems/maturity";

const CHIP = `inline-flex items-center rounded-(--sys-shape-corner-full) border border-(--sys-color-outline) px-2 py-0.5 ${T_LABEL}`;

/**
 * Platform switcher — All / Web / Native, on the one gallery route.
 *
 * One control instead of three hand-rolled chip navs: a 48dp pill row where
 * the active view carries the selected pair (secondary-container /
 * on-secondary-container) and the rest carry the M3 state layers. The active
 * item stays a LINK with `aria-current` — it navigates to itself rather than
 * posing as a non-interactive tab, so every item is a destination. Filtering
 * is view state (`?platform=`, 018): one gallery URL, not one route per
 * platform — the former platform index routes are deleted
 * outright (D-051, no redirects).
 */
export type GalleryPlatform = "web" | "mobile";

export function PlatformSwitcher({ platform }: { platform?: GalleryPlatform }) {
  const items = [
    {
      label: "All",
      to: "/components",
      search: {},
      active: !platform,
    },
    {
      label: "Web",
      to: "/components",
      search: { platform: "web" },
      active: platform === "web",
    },
    {
      label: "Native",
      to: "/components",
      search: { platform: "mobile" },
      active: platform === "mobile",
    },
  ];
  return (
    <nav
      aria-label="Platform"
      className="flex w-fit flex-wrap items-center gap-1 rounded-full bg-(--sys-color-surface-container) p-1"
    >
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          search={item.search}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            `inline-flex min-h-12 items-center rounded-(--sys-shape-corner-full) px-5 no-underline ${T_LABEL_LG} ${TRANSITION} ${FOCUS_RING}`,
            item.active
              ? `${PILL_ACTIVE}`
              : `text-(--sys-color-on-surface-variant) ${STATE_LAYERS} hover:text-(--sys-color-on-surface)`,
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

type GalleryCard = {
  slug: string;
  name: string;
  oneLiner: string;
  web?: ComponentDoc;
  mobile?: ComponentDoc;
};

/**
 * Width-fit wrapper for gallery thumbnails.
 *
 * A live demo composed for a full-width family page is often wider than
 * the ~260px card well (nav bars, pagination windows, tab rows, footers).
 * Cropping those reads as a broken demo; this measures once after mount
 * (and again after webfonts land) and `zoom`s the demo to the well width
 * when it overflows. Height still crops with the well's fade — width is
 * guaranteed, height is a thumbnail. `zoom` scales layout (unlike
 * transform), so no compensation math; engines without it ignore the
 * style and keep the crop.
 */
function FitWidth({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let alive = true;
    const fit = () => {
      if (!alive || !el.parentElement) return;
      const avail = el.parentElement.clientWidth;
      // Max over the subtree: an inner scroller (chip rows, tab lists)
      // clips without growing the wrapper's own scrollWidth.
      let need = el.scrollWidth;
      for (const d of el.querySelectorAll("*")) {
        const w = (d as HTMLElement).scrollWidth;
        if (w > need) need = w;
      }
      // `input.scrollWidth` reports the box, not the text — canvas-measure
      // field text (value, else placeholder) plus its padding instead.
      const canvas = document.createElement("canvas").getContext("2d");
      if (canvas) {
        for (const f of el.querySelectorAll("input, textarea")) {
          const field = f as HTMLInputElement;
          const cs = getComputedStyle(field);
          canvas.font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
          const text = field.value || field.placeholder || "";
          const textW =
            canvas.measureText(text).width +
            Number.parseFloat(cs.letterSpacing || "0") * text.length;
          const fieldNeed =
            textW +
            Number.parseFloat(cs.paddingLeft || "0") +
            Number.parseFloat(cs.paddingRight || "0") +
            2;
          if (fieldNeed > need) need = fieldNeed;
        }
      }
      if (avail > 0 && need > avail + 8) setZoom(avail / need);
    };
    fit();
    if (typeof document !== "undefined" && "fonts" in document) {
      void document.fonts.ready.then(() => fit());
    }
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div ref={ref} style={zoom < 1 ? { zoom } : undefined}>
      {children}
    </div>
  );
}

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
    // `m-auto` in the flex well below: centers a fitting demo, and
    // top/left-aligns an overflowing one (negative free space floors auto
    // margins to zero) so the first preview stays readable instead of the
    // stack's middle being cropped on both edges.
    return <div className="m-auto min-h-0 w-full min-w-0">{this.props.children}</div>;
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
        className={`flex flex-wrap items-center gap-1 ${T_BODY_SM}`}
        aria-label="Families"
      >
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#family-${g.id}`}
            className={`inline-flex min-h-12 items-center rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-low) px-4 no-underline ${T_LABEL_LG} text-(--sys-color-on-surface) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
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
  // abort the server stream — measured: /components SSR-truncated to the
  // head until this gate existed), so the thumbnail
  // renders after mount. The card's text, chips and links are server-rendered
  // regardless; only the preview waits.
  const isClient = useClientMount();
  const primary = card.web ?? card.mobile;
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
    <article
      className={`${CARD} site-gallery-card flex flex-col overflow-hidden`}
    >
      <div
        className={`site-gallery-stage relative m-2 flex h-44 items-center justify-center overflow-hidden p-4 ${STAGE}`}
      >
        {Demo ? (
          isClient ? (
            // The preview is a THUMBNAIL: inert to pointer events so it can
            // never swallow the card's links or trap a click on a demo control.
            // A fitting demo centers exactly (m-auto); an overflowing one
            // top/left-aligns so the first preview stays readable instead of
            // the stack's middle cropping on both edges. Rendered at natural
            // size: the old scale-90 popped on mount. Figure chrome compacts
            // in thumbnails (figure p-4→p-2, stage p-6→p-2) so narrow wells
            // don't clip demo text — scoped to descendants, the well and
            // the family pages keep full chrome.
            <div
              className="pointer-events-none m-auto flex max-h-full max-w-full min-h-0 min-w-0 origin-center overflow-hidden [mask-image:linear-gradient(to_bottom,black_82%,transparent_98%)] [&_.site-card]:p-2 [&_.site-stage]:p-2"
              aria-hidden="true"
              inert
            >
              <DemoBoundary>
                <FitWidth>
                  <Demo />
                </FitWidth>
              </DemoBoundary>
            </div>
          ) : (
            // SSR skeleton: the same h-36 well, filled with container-high
            // blocks, so the mount swap changes texture, not layout. Static
            // on purpose — a shimmer would spend motion on a frame that
            // resolves in the same tick as hydration.
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              aria-hidden="true"
            >
              <div className="h-8 w-2/3 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)" />
              <div className="h-8 w-1/2 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)" />
            </div>
          )
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
      <div className="flex flex-col gap-3 px-5 pt-2 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/components/$system/$component"
            params={{
              system: "m3",
              component: card.slug,
            }}
            className={`m-0 ${T_SMALL_TITLE} ${INK} no-underline hover:underline ${TRANSITION} ${FOCUS_RING}`}
          >
            {primary?.name ?? card.name}
          </Link>
          {card.web ? (
            <Link
              to="/components/$system/$component"
              params={{ system: "m3", component: card.slug }}
              search={{ tab: "web" }}
              className={`${CHIP} no-underline text-(--sys-color-on-surface-variant) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING} hover:text-(--sys-color-on-surface)`}
            >
              Web
            </Link>
          ) : null}
          {card.mobile ? (
            <Link
              to="/components/$system/$component"
              params={{ system: "m3", component: card.slug }}
              search={{ tab: "mobile" }}
              className={`${CHIP} no-underline text-(--sys-color-on-surface-variant) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING} hover:text-(--sys-color-on-surface)`}
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
  // The All view merges both platforms, so keep coverage separate rather than
  // double-counting families documented on both platforms.
  const web = demoCoverage("web");
  const mobile = demoCoverage("mobile");
  return (
    <div className="flex flex-col gap-2">
      <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
        Browse components by the job they do, try a live example, then open a
        family page for its API, tokens, and install path.
      </p>
      <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
        Live examples cover {web.withDemo} of {web.total} web families and{" "}
        {mobile.withDemo} of {mobile.total} native families; every other family
        still has a reference page.
      </p>
    </div>
  );
}
