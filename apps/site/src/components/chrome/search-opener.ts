/**
 * Search opener — dependency-free.
 *
 * Split out of `search-palette.tsx` so the header, drawer and layout can
 * dispatch/listen without pulling the palette (and through it, the whole
 * content corpus) into the entry chunk. The palette itself loads on first
 * open — see `SearchPaletteMount` in `site-layout.tsx`.
 */
export const OPEN_SEARCH_EVENT = "kern:open-search";

export function openSearch() {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
}
