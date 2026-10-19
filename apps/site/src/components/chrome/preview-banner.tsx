import { Icon } from "@xoroh/kern-icons";
import { T_BODY_SM, T_CODE } from "../../domains/shared/systems/type-scale";

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
    <div
      role="note"
      aria-label="Preview status"
      className={`m-0 flex items-center justify-center gap-2 bg-(--sys-color-surface-container) px-4 py-1.5 text-center text-(--sys-color-on-surface-variant) ${T_BODY_SM}`}
    >
      <span className="inline-flex items-center gap-1 rounded-full bg-(--sys-color-secondary-container) px-2 py-0.5 text-(--sys-color-on-secondary-container)">
        <Icon name="science" size={14} />
        <span>0.1.0 Preview</span>
      </span>
      <span className="sm:hidden">Install from a checkout.</span>
      <span className="hidden sm:inline">
        Packages are unpublished (<code className={T_CODE}>0.0.0</code>).
        Install from a checkout; <code className={T_CODE}>npm i</code> and{" "}
        <code className={T_CODE}>kern add</code> commands run at release.
      </span>
    </div>
  );
}
