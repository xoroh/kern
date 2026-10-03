/**
 * Version selector — the one the shell was missing.
 *
 * Every package is 0.0.0, so this renders a single current version, not a menu
 * of releases that do not exist. A dropdown of one invented entry would be the
 * fabricated-artefact failure; a single truthful line with a path to the
 * changelog is the honest control.
 *
 * The version is READ from the generated maturity table (the D-038 source),
 * never typed: when a package bumps past 0.x the selector changes with no edit.
 * It links to /changelog, which is where "what changed" lives.
 */
import { MATURITY } from "../../generated/maturity";

const VERSION = MATURITY[0]?.version ?? "0.0.0";

export function VersionSelector() {
  return (
    <a
      href="/changelog"
      aria-label={`Kern version ${VERSION}, preview release. See the changelog.`}
      className="inline-flex items-center gap-1.5 rounded-full border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) px-3 py-1 font-mono text-xs text-(--md-sys-color-on-surface-variant) no-underline hover:border-(--md-sys-color-outline) hover:text-(--md-sys-color-on-surface)"
    >
      <span
        aria-hidden="true"
        className="inline-block size-1.5 rounded-full bg-(--md-sys-color-tertiary)"
      />
      v{VERSION}
    </a>
  );
}
