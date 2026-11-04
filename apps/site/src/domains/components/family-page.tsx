/**
 * The shared family page body (D1003/D1004) — one component, two doors.
 *
 * `/components/m3/<slug>` (composite families) and `/core/<slug>`
 * (pure-core families) render the same page with different chrome: the nav
 * door, the tab-link base, and the prev/next scope. The route files own the
 * URL, the canonical-tier redirect, and the 404; everything else lives
 * here so the two doors cannot drift.
 */
import { CatchNotFound, Link, notFound } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import {
  ComponentPage as ComponentDocPage,
  familyTier,
} from "../../components/docs/component-page";
import { docForExport, getDoc, type Platform } from "../../content";
import { COMPONENTS } from "../../generated/manifest";
import { siblingNavTier } from "../../systems/component-nav";
import { familyHref } from "../../systems/tier-nav";
import { PageCard } from "../shared/chrome/page-card";
import { SiteLayout } from "../shared/chrome/site-layout";
import {
  T_BODY,
  T_BODY_MD,
  T_CODE,
  T_PAGE,
  T_SECTION,
} from "../shared/systems/type-scale";

export function FamilyPage({
  slug,
  requestedTab,
  door,
  familyBase,
  siblingBase,
  siblingSlugs,
  systemLabel,
}: {
  slug: string;
  requestedTab: Platform | undefined;
  /** Nav door this page belongs to (Components or Core). */
  door: { label: string; href: string };
  /** URL base for tab links ("components/m3" or "core"). */
  familyBase: string;
  /** URL base for prev/next links (same vocabulary as familyBase). */
  siblingBase: string;
  /** Slug order prev/next walks (full FAMILIES or the core subset). */
  siblingSlugs: string[];
  /** System label for the header chip (e.g. "M3"). */
  systemLabel: string;
}) {
  return (
    <CatchNotFound fallback={() => <UnknownComponent slug={slug} />}>
      <FamilyBody
        slug={slug}
        requestedTab={requestedTab}
        door={door}
        familyBase={familyBase}
        siblingBase={siblingBase}
        siblingSlugs={siblingSlugs}
        systemLabel={systemLabel}
      />
    </CatchNotFound>
  );
}

function FamilyBody({
  slug,
  requestedTab,
  door,
  familyBase,
  siblingBase,
  siblingSlugs,
  systemLabel,
}: {
  slug: string;
  requestedTab: Platform | undefined;
  door: { label: string; href: string };
  familyBase: string;
  siblingBase: string;
  siblingSlugs: string[];
  systemLabel: string;
}) {
  const webDoc = getDoc("web", slug);
  const mobileDoc = getDoc("mobile", slug);

  // Manifest rows with no content on either renderer and no part claim are
  // a gap in the site, not in the package — stated rather than papered over.
  if (!webDoc && !mobileDoc) {
    const entries = COMPONENTS.filter((c) => c.name === slug);
    const pkg =
      entries[0]?.platform === "mobile" ? "@xoroh/kern-native" : "@xoroh/kern";
    return (
      <SiteLayout>
        <PageCard>
          <Undocumented
            entries={entries.map((e) => ({
              name: e.name,
              export: e.export,
              status: e.status,
              tier: e.tier,
            }))}
            pkg={pkg}
          />
        </PageCard>
      </SiteLayout>
    );
  }

  const available: Platform[] = [
    ...(webDoc ? (["web"] as const) : []),
    ...(mobileDoc ? (["mobile"] as const) : []),
  ];
  const active: Platform =
    requestedTab && available.includes(requestedTab)
      ? requestedTab
      : available[0];
  const doc = (active === "web" ? webDoc : mobileDoc) ?? webDoc ?? mobileDoc;
  if (!doc) {
    throw notFound();
  }

  // Same component under another name on the other renderer (web `link`
  // vs native `LinkButton`): the tabs cannot reach it, so the page names it
  // instead of stranding the reader. The link goes to the peer's canonical
  // tier home (D1003: one family, one URL).
  const peerPlatform: Platform = active === "web" ? "mobile" : "web";
  const crossPeer = doc.meta.nativePeer
    ? docForExport(peerPlatform, doc.meta.nativePeer)
    : undefined;
  const peerNote =
    crossPeer && crossPeer.slug !== slug
      ? {
          label: `${crossPeer.name} (${peerPlatform === "web" ? "Web" : "React Native"})`,
          href: familyHref(crossPeer.slug),
        }
      : undefined;

  const titleFor = (s: string) =>
    getDoc("web", s)?.name ?? getDoc("mobile", s)?.name ?? s;
  const { prev, next } = siblingNavTier(
    siblingBase,
    siblingSlugs,
    slug,
    titleFor,
  );

  return (
    <SiteLayout>
      <PageCard>
        <ComponentDocPage
          doc={doc}
          platform={active}
          familySlug={slug}
          systemLabel={systemLabel}
          tabs={available}
          peerNote={peerNote}
          tiers={{
            web: webDoc ? familyTier(webDoc.parts, "web") : null,
            mobile: mobileDoc ? familyTier(mobileDoc.parts, "mobile") : null,
          }}
          door={door}
          familyBase={familyBase}
          prev={prev}
          next={next}
        />
      </PageCard>
    </SiteLayout>
  );
}

function UnknownComponent({ slug }: { slug: string }) {
  return (
    <SiteLayout>
      <PageCard width="narrow">
        <Kicker>404</Kicker>
        <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
          No such component
        </h1>
        <p className={`m-0 ${T_BODY} text-(--sys-color-on-surface-variant)`}>
          <code>{slug}</code> is not a documented family. The route set comes
          from <code>src/content/</code>, so if this export exists in a package
          the content page is missing — not this page.
        </p>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          <Link to="/components">Browse components</Link>
        </p>
      </PageCard>
    </SiteLayout>
  );
}

/**
 * A manifest row with no content page.
 *
 * This is a gap in the site, not in the package, and it is stated rather
 * than hidden. `scripts/check:docs` counts these and fails when a family
 * that claims a page is missing one of its parts, so the list shrinks under
 * the gate instead of growing quietly.
 */
function Undocumented({
  entries,
  pkg,
}: {
  entries: { name: string; export: string; status: string; tier: string }[];
  pkg: string;
}) {
  const first = entries[0];
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
          <code>{first?.export ?? "Unknown export"}</code>
        </h1>
        <p className={`m-0 ${T_CODE} text-(--sys-color-secondary)`}>{pkg}</p>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          Tier:{" "}
          {first?.tier === "component"
            ? "Component (composite)"
            : "Core (M3 primitive)"}
        </p>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          {first?.status === "real"
            ? "Implemented and exported from the platform entry point."
            : "Planned placeholder — not exported yet."}
        </p>
      </header>
      <div className="flex flex-col gap-2 rounded-(--sys-shape-corner-medium) border border-(--sys-color-outline) bg-(--sys-color-surface-container) p-6">
        <h2 id="no-documentation-page-yet" className={`m-0 ${T_SECTION}`}>
          No documentation page yet
        </h2>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          This export is in the generated inventory but no family documents it
          under <code>src/content/</code>. That is a gap in the site, not in the
          package — it is tracked by <code>check:docs</code> rather than hidden
          here.
        </p>
      </div>
    </div>
  );
}
