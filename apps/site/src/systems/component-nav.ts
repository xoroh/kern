/**
 * Prev/next for the component page — manifest sibling order, extracted so the
 * platform-preserving rule is unit-tested, not just rendered.
 *
 * One component, one page: siblings come from `componentsOn(entry.platform)`
 * and every href is platform-qualified (`/components/web/button`), so walking
 * prev/next can never hop renderers. Each link carries the target page's
 * TITLE alongside its href so the link names the page it goes to; a bare
 * href would render "Previous"/"Next" with no hint of the destination.
 *
 * The title resolution is INJECTED, not imported: the content registry is
 * Vite-only (`import.meta.glob`), and this module stays Node-safe so
 * `scripts/check-component-nav.mjs` can import the real function. The route
 * already imports `docForExport` for its canonical-slug redirect, so it
 * passes the same lookup down.
 */
import { componentsOn, type ComponentEntry } from "../generated/manifest.ts";

export type SiblingLink = { href: string; title: string };

export function siblingNav(
  entry: ComponentEntry,
  titleFor: (e: ComponentEntry) => string = (e) => e.export,
): {
  prev?: SiblingLink;
  next?: SiblingLink;
} {
  const siblings = componentsOn(entry.platform);
  const index = siblings.findIndex((c) => c.slug === entry.slug);
  const linkFor = (e: ComponentEntry): SiblingLink => ({
    href: `/components/${e.slug}`,
    title: titleFor(e),
  });
  return {
    ...(index > 0 ? { prev: linkFor(siblings[index - 1]) } : {}),
    ...(index >= 0 && index < siblings.length - 1
      ? { next: linkFor(siblings[index + 1]) }
      : {}),
  };
}
