import { T_BODY_SM } from "../../domains/shared/systems/type-scale";

/**
 * Preview honesty banner — one slim line above the header.
 *
 * Kern 0.1.0 is a Preview: all packages are still `0.0.0` and unpublished,
 * so every `npm i @xoroh/*` command on the site 404s today and the `kern`
 * binary runs from a checkout only. Rendered once in `SiteLayout` above the
 * sticky header (never per-page), so it scrolls away and the header alone
 * sticks. Deliberately quiet — plain text on the canvas, no tonal badge —
 * so the chrome stays one calm strip.
 */
export function PreviewBanner() {
  return (
    <p
      role="note"
      aria-label="Preview status"
      className={`m-0 px-4 pt-2 pb-1 text-center text-(--sys-color-on-surface-variant) ${T_BODY_SM}`}
    >
      0.1.0 Preview · Packages unpublished — install from a checkout.
    </p>
  );
}
