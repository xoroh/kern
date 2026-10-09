/**
 * Registry → playground wiring (demo DX).
 *
 * WHAT IT IS: the three hrefs that make every registry entry openable from
 * the playground side. The CLI registry (`kern add <name>`, web-only in
 * Mode 1) and the site search share one key — the package export name — so a
 * registry entry resolves through the deep-linkable `/search?q=` route to
 * its component page demo, and from there to the theme configurator. No new
 * routes: these are hrefs into routes that already exist, which is why no
 * nav/llms gate needs updating.
 *
 * The theme configurator repaints the token layer globally (seed/preset/
 * radius), not one component, so its href carries no component param — a
 * query string promising per-component state would be a lie the page cannot
 * keep.
 */
import type { Platform } from "../content/index";

/** Playground search pre-filled with the export name — the entry's address. */
export function registrySearchHref(exportName: string): string {
  return `/search?q=${encodeURIComponent(exportName)}`;
}

/**
 * The theme studio. Global knobs, so no component param by design. The
 * studio absorbed the old /theme-configurator route (one customizer app) —
 * this constant stays global so component pages keep linking without a
 * sweep; /theme-configurator itself redirects here.
 */
export const THEME_CONFIGURATOR_HREF = "/playground";

/** A component page scrolled to its live demo section. Segments are encoded so shared links survive slugs with special characters. */
export function componentDemoHref(platform: Platform, slug: string): string {
  return `/components/${encodeURIComponent(platform)}/${encodeURIComponent(slug)}#demo`;
}
