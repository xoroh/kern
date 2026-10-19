/**
 * Prev/next for the component page — M3 family order, extracted so the
 * system-scoped rule is unit-tested, not just rendered.
 *
 * One component, one page (`/components/m3/<name>`, 018): siblings come from
 * the generated `FAMILIES` union order and every href is system-scoped, so
 * walking prev/next stays on the family page — there is no platform segment
 * to hop (the old platform-preserving rule died with the platform segment,
 * and per 020 it keeps no redirect). Each link carries the target page's
 * TITLE alongside its href so the link names the page it goes to; a bare
 * href would render "Previous"/"Next" with no hint of the destination.
 *
 * The title resolution is INJECTED, not imported: the content registry is
 * Vite-only (`import.meta.glob`), and this module stays Node-safe so
 * `scripts/check-component-nav.mjs` can import the real function. The route
 * already imports the content lookup for its canonical-slug redirect, so it
 * passes the same lookup down.
 */
import { FAMILIES } from "../generated/manifest.ts";

export type SiblingLink = { href: string; title: string };

export function siblingNavSystem(
  system: string,
  slug: string,
  titleFor: (slug: string) => string = (s) => s,
): {
  prev?: SiblingLink;
  next?: SiblingLink;
} {
  const index = FAMILIES.indexOf(slug);
  const linkFor = (s: string): SiblingLink => ({
    href: `/components/${system}/${s}`,
    title: titleFor(s),
  });
  return {
    ...(index > 0 ? { prev: linkFor(FAMILIES[index - 1]) } : {}),
    ...(index >= 0 && index < FAMILIES.length - 1
      ? { next: linkFor(FAMILIES[index + 1]) }
      : {}),
  };
}
