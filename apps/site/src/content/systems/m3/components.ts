/**
 * M3 components — the system-scoped import surface for Material 3 families.
 *
 * kern ships one renderer set today (web + React Native), so this barrel
 * re-exports the shared registries rather than duplicating them. When a
 * second system ships its own components, this is where its docs diverge
 * from the shared gallery — and the routes nest to
 * `/components/<id>/<name>` beside it.
 */
export { MOBILE_DOCS, WEB_DOCS } from "../..";
