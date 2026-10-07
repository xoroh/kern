/**
 * Trust band — the counts a visitor can verify, read from generated sources.
 *
 * Every number here is computed at build time, never typed: the component
 * total from the generated manifest, the documented-parts count from the
 * content registry (both platforms, the same parts the gallery pages render), the icon total from
 * the icon package's own registry, and the pending-changes count from the
 * repository's changesets. A count that cannot be generated is omitted — the
 * docs hub's missing downloads band follows the same rule.
 */
import { ICON_COUNT } from "@xoroh/kern-icons";
import { ALL_DOCS } from "../../content";
import { RECENT_CHANGES } from "../../generated/changelog";
import { COMPONENT_COUNT } from "../../generated/manifest";
import {
  T_BODY_SM,
  T_DISPLAY,
  T_LABEL,
} from "../../systems/type-scale";

const STATS: { value: number; label: string; href: string }[] = [
  {
    value: COMPONENT_COUNT,
    label: "Component exports across web and native",
    href: "/components",
  },
  {
    value: ALL_DOCS.reduce((n, doc) => n + doc.parts.length, 0),
    label: "Documented parts, web and native",
    href: "/components",
  },
  {
    value: ICON_COUNT,
    label: "Icons in the registry",
    href: "/icons",
  },
  {
    value: RECENT_CHANGES.length,
    label: "Unreleased changes in the changesets",
    href: "/changelog",
  },
];

export function TrustBand() {
  return (
    <section
      className="px-4 py-4 sm:px-6 sm:py-6"
      aria-labelledby="trust-heading"
    >
      <div className="rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
        <p className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}>
          Proof, not promises
        </p>
        <h2
          id="trust-heading"
          className={`m-0 mt-3 ${T_DISPLAY} text-(--md-sys-color-on-surface)`}
        >
          Counted, not claimed
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="flex flex-col gap-1 no-underline"
            >
              <span
                className={`${T_DISPLAY} text-(--md-sys-color-primary) tabular-nums`}
              >
                {stat.value}
              </span>
              <span
                className={`${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
              >
                {stat.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
