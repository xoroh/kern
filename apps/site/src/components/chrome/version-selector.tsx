/**
 * Version status — the one the shell was missing.
 *
 * Every package is 0.0.0, so the status reads "Preview", not a version
 * number: a v0.0.0 badge next to a changelog link would read as a released
 * version that does not exist. The real number still lives in the
 * accessible name (read from the generated maturity table, never typed),
 * and the link goes to /changelog, which is where "what changed" lives.
 *
 * Deliberately NOT a chip or pill: it is a status line, not a selectable
 * option, so it wears no border, no fill and no pill radius — muted text
 * with a tertiary dot, lifting to on-surface on hover.
 */

import { T_CODE } from "../../domains/shared/systems/type-scale";
import { FOCUS_RING, TRANSITION } from "../../domains/shared/systems/ui";
import { MATURITY } from "../../systems/maturity";

const VERSION = MATURITY[0]?.version ?? "0.0.0";

export function VersionSelector() {
  return (
    <a
      href="/changelog"
      aria-label={`Kern version ${VERSION}, preview release. See the changelog.`}
      className={`inline-flex min-h-12 items-center gap-1.5 px-2 ${T_CODE} text-(--sys-color-on-surface-variant) no-underline ${TRANSITION} hover:text-(--sys-color-on-surface) ${FOCUS_RING}`}
    >
      <span
        aria-hidden="true"
        className="inline-block size-1.5 rounded-full bg-(--sys-color-tertiary)"
      />
      Preview
    </a>
  );
}
