/**
 * M3 foundations — the system-scoped import surface for Material 3 values.
 *
 * The token modules stay canonical at `content/foundations` (one package,
 * one source); this barrel is the per-system address. Routes under
 * `/foundations/m3/` import from here, never past it — so a second system
 * adds `content/systems/<id>/foundations.ts` beside this file instead of
 * forking the token modules. Kern-level resources shared across systems
 * (icons, the accessibility statement) deliberately live outside any system
 * barrel.
 */
export * from "../../foundations";
