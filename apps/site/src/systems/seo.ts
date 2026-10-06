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
