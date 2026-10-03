/**
 * Site search — build-time index, zero-runtime-backend scoring.
 *
 * The index is derived from registry data that already ships in the bundle
 * (generated manifest + content docs + maturity + token roles), so there is
 * no search backend and nothing to keep in sync by hand. Scoring is a pure
 * function over that index, shared by the ⌘K palette and the deep-linkable
 * `/search?q=` route — one ranking in both surfaces, by construction.
 *
 * Groups follow the blueprint §9 order: Components · Tokens · Guides · API ·
 * Blocks · Pages.
 */
import { resolveThemeDetails } from "@xoroh/kern-tokens";
import type { Platform } from "../content";
import { MOBILE_DOCS, WEB_DOCS } from "../content";
import type { ComponentDoc } from "../content/types";
import { maturityForExports } from "../maturity";

export type SearchGroup =
  | "Components"
  | "Tokens"
  | "Guides"
  | "API"
  | "Blocks"
  | "Pages";

export const SEARCH_GROUP_ORDER: SearchGroup[] = [
  "Components",
  "Tokens",
  "Guides",
  "API",
  "Blocks",
  "Pages",
];

export type SearchEntry = {
  group: SearchGroup;
  /** Display title. */
  title: string;
  /** One-line hint shown under the title. */
  hint: string;
  /** Where Enter/click goes. */
  href: string;
  /** State badge, e.g. "Preview" — rendered inline per blueprint §9. */
  badge?: string;
};

function docEntries(docs: ComponentDoc[], platform: Platform): SearchEntry[] {
  const native = platform === "mobile" ? "native" : "web";
  return docs.map((doc) => ({
    group: "Components" as const,
    title: doc.name,
    hint: doc.oneLiner,
    href: `/components/${platform}/${doc.slug}`,
    badge:
      maturityForExports(doc.parts, native)?.state ??
      (doc.meta.status === "stub" ? "stub" : undefined),
  }));
}

function apiEntries(docs: ComponentDoc[], platform: Platform): SearchEntry[] {
  // One entry per exported symbol, landing on the page's API section — a
  // different destination (and intent) than the Components entry for the
  // family, which lands on the page top.
  //
  // Badged with the same maturity state as the Components entry: an API hit
  // without a state badge reads as stable-by-default, which is exactly the
  // misreading the badge exists to prevent.
  const native = platform === "mobile" ? "native" : "web";
  const out: SearchEntry[] = [];
  for (const doc of docs) {
    for (const part of doc.parts) {
      out.push({
        group: "API",
        title: part,
        hint: `${doc.name} · ${platform === "web" ? "Web" : "Native"} API`,
        href: `/components/${platform}/${doc.slug}#api-reference`,
        badge:
          maturityForExports([part], native)?.state ??
          (doc.meta.status === "stub" ? "stub" : undefined),
      });
    }
  }
  return out;
}

const STATIC_ENTRIES: SearchEntry[] = [
  {
    group: "Guides",
    title: "Get started",
    hint: "From install to a themed component",
    href: "/getting-started",
  },
  {
    group: "Guides",
    title: "Guides",
    hint: "How-to guides for common tasks",
    href: "/docs/guides",
  },
  {
    group: "Guides",
    title: "Public utilities",
    hint: "API reference for the public utility surface",
    href: "/docs/api",
  },
  {
    group: "Pages",
    title: "Documentation",
    hint: "Three ways in, one system underneath",
    href: "/docs",
  },
  {
    group: "Pages",
    title: "Components",
    hint: "Documented family by family",
    href: "/components",
  },
  {
    group: "Pages",
    title: "Styles and tokens",
    hint: "The values everything is built from",
    href: "/styles",
  },
  {
    group: "Pages",
    title: "Theme",
    hint: "Color roles in the active theme",
    href: "/theme",
  },
  {
    group: "Pages",
    title: "Search",
    hint: "Search every registry from one box",
    href: "/search",
  },
];

/** Built once per page load from data already in the bundle — no fetch. */
export function buildSearchIndex(): SearchEntry[] {
  // Role names resolved from the theme package, not hand-copied — the same
  // pattern routes/theme/index.tsx uses.
  const roles = Object.keys(resolveThemeDetails("light").color);
  const tokens: SearchEntry[] = roles.map((role) => ({
    group: "Tokens",
    title: role,
    hint: "Color role · see it on the Color page",
    href: "/styles/color",
  }));
  const blocksDoc = WEB_DOCS.find((d) => d.slug === "search-bar");
  const blocks: SearchEntry[] = (blocksDoc?.parts ?? []).map((part) => ({
    group: "Blocks",
    title: part,
    hint: blocksDoc?.oneLiner ?? "Shell furniture block",
    href: `/components/web/${blocksDoc?.slug ?? "search-bar"}`,
  }));
  return [
    ...docEntries(WEB_DOCS, "web"),
    ...docEntries(MOBILE_DOCS, "mobile"),
    ...tokens,
    ...STATIC_ENTRIES.filter((e) => e.group === "Guides"),
    ...apiEntries(WEB_DOCS, "web"),
    ...apiEntries(MOBILE_DOCS, "mobile"),
    ...blocks,
    ...STATIC_ENTRIES.filter((e) => e.group === "Pages"),
  ];
}

function score(query: string, entry: SearchEntry): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = entry.title.toLowerCase();
  const hint = entry.hint.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 75;
  // Word-boundary start beats a mid-word match ("bar" finds SearchBar
  // before "App bar" finds… nothing — it ranks the boundary first).
  const boundary = new RegExp(`(^|[^a-z])${escapeRegExp(q)}`);
  if (boundary.test(title)) return 50;
  if (title.includes(q)) return 25;
  if (hint.includes(q)) return 10;
  return 0;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type GroupedResults = { group: SearchGroup; entries: SearchEntry[] }[];

const PER_GROUP = 6;

/** Ranked, grouped results. Pure — same output in palette and /search. */
export function searchSite(
  query: string,
  index: SearchEntry[],
): GroupedResults {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const ranked = index
    .map((entry) => ({ entry, s: score(q, entry) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);
  const out: GroupedResults = [];
  for (const group of SEARCH_GROUP_ORDER) {
    const entries = ranked
      .filter((r) => r.entry.group === group)
      .slice(0, PER_GROUP)
      .map((r) => r.entry);
    if (entries.length > 0) out.push({ group, entries });
  }
  return out;
}

/** Suggestions for the empty/no-results states — popular, stable targets. */
export const SEARCH_SUGGESTIONS: SearchEntry[] = [
  {
    group: "Components",
    title: "Button",
    hint: "Start with the most-used family",
    href: "/components/web/button",
  },
  {
    group: "Components",
    title: "Dialog",
    hint: "Modal tasks and decisions",
    href: "/components/web/dialog",
  },
  {
    group: "Tokens",
    title: "primary",
    hint: "Color role · see it on the Color page",
    href: "/styles/color",
  },
  {
    group: "Guides",
    title: "Get started",
    hint: "From install to a themed component",
    href: "/getting-started",
  },
];
