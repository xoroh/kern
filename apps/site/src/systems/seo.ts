/**
 * Site SEO constants (Part 8).
 *
 * The landing's JSON-LD block. Every absolute URL here must name something
 * real: github.com/xoroh/kern (the repo footer links), xoroh.org (the
 * footer links), schema.org (the vocabulary itself). The site's own URL is
 * DELIBERATELY absent — wrangler.jsonc declares no custom domain, so any
 * hostname would be invented (same rule as generate-llms.mjs). check-seo.mjs
 * enforces the allowlist, so a future edit cannot smuggle in a domain.
 */
export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kern",
  description:
    "Kern UI by Xoroh — an open-source design system following Material Design 3. One contract, web and native.",
  publisher: {
    "@type": "Organization",
    name: "Xoroh",
    url: "https://xoroh.org",
    sameAs: ["https://github.com/xoroh/kern"],
  },
} as const;

/** Absolute hosts allowed anywhere in the SEO constants. */
export const SEO_ALLOWED_HOSTS = new Set([
  "schema.org",
  "github.com",
  "xoroh.org",
  "m3.material.io",
]);

/**
 * Per-route head plumbing (P1 chrome).
 *
 * Every content route calls `routeHead(title, description)` so each URL owns
 * exactly one title, one description, and the shared OG defaults. The image
 * is root-relative on purpose: the site declares no canonical domain
 * (wrangler.jsonc has none — inventing one would be the fabrication
 * check-seo.mjs exists to block), so an absolute OG URL cannot be honest.
 */
export const SITE_DESCRIPTION = SITE_JSON_LD.description;

/** Social preview image in `public/` — the honest brand tile, not a screenshot. */
export const SITE_OG_IMAGE = "/og.png";

export function pageMeta(fullTitle: string, description: string = SITE_DESCRIPTION) {
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:image", content: SITE_OG_IMAGE },
  ];
}

export function routeHead(title: string, description?: string) {
  return { meta: pageMeta(`${title} — Kern`, description) };
}
