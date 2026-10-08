/**
 * Version selector — the one the shell was missing.
 *
 * Every package is 0.0.0, so the pill reads "Preview", not a version number:
 * a v0.0.0 badge next to a changelog link would read as a released version
 * that does not exist. The real number still lives in the accessible name
 * (read from the generated maturity table, never typed), and the pill links
 * to /changelog, which is where "what changed" lives.
 */
import { MATURITY } from "../../systems/maturity";
import { T_CODE } from "../../domains/shared/systems/type-scale";

const VERSION = MATURITY[0]?.version ?? "0.0.0";

export function VersionSelector() {
  return (
    <a
      href="/changelog"
      aria-label={`Kern version ${VERSION}, preview release. See the changelog.`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) px-3 py-1 ${T_CODE} text-(--md-sys-color-on-surface-variant) no-underline hover:border-(--md-sys-color-outline) hover:text-(--md-sys-color-on-surface)`}
    >
      <span
        aria-hidden="true"
        className="inline-block size-1.5 rounded-full bg-(--md-sys-color-tertiary)"
      />
      Preview
    </a>
  );
}
