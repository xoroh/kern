import { T_LABEL_LG } from "../../domains/shared/systems/type-scale";

/**
 * Preview honesty banner — one line, every page.
 *
 * Kern 0.1.0 is a Preview: all packages are still `0.0.0` and unpublished,
 * so every `npm i @xoroh/*` command on the site 404s today and the `kern`
 * binary runs from a checkout only. The banner states the working route
 * (checkout) and marks the registry commands as arriving at release, so no
 * page teaches a failing command silently. Rendered once in `SiteLayout`
 * below the header; never per-page.
 */
export function PreviewBanner() {
  return (
    <p
      role="note"
      aria-label="Preview status"
      className={`m-0 bg-(--sys-color-secondary-container) px-4 py-2 text-center text-(--sys-color-on-secondary-container) ${T_LABEL_LG}`}
    >
      Kern 0.1.0 Preview — packages are unpublished (
      <code>0.0.0</code>
      ). Install from a checkout; <code>npm i</code> and <code>kern add</code>{" "}
      commands run at release.
    </p>
  );
}
