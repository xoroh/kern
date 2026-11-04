import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import {
  T_BODY,
  T_BODY_SM,
  T_KICKER,
  T_LABEL_LG,
  T_LABEL_MD,
  T_PAGE,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  INK,
  INK_SOFT,
  PILL_ACTIVE,
  PILL_REST,
  STRIP,
  TRANSITION,
} from "../../domains/shared/systems/ui";

export type ShowcaseSectionLink = {
  id: string;
  label: string;
  badge?: string;
};

export type ShowcaseStatPill = {
  label: string;
  value: string;
};

export type CategoryShowcaseShellProps = {
  kicker: string;
  title: string;
  subtitle: string;
  stats: ShowcaseStatPill[];
  sections: ShowcaseSectionLink[];
  activeSection?: string;
  children: ReactNode;
};

/**
 * Reusable Category Showcase Shell (D1024 C5).
 *
 * Provides a cohesive M3 Expressive category showcase layout built 100% from
 * Kern system tokens (`--sys-*`) and the site type scale (`T_*`). Designed to
 * scale across Buttons, Inputs, Dialogs, Navigation, Tables, and Cards.
 */
export function CategoryShowcaseShell({
  kicker,
  title,
  subtitle,
  stats,
  sections,
  children,
}: CategoryShowcaseShellProps) {
  return (
    <SiteLayout>
      <PageCard width="wide" gap={12}>
        <header className={`${CARD} flex flex-col gap-6 p-6 sm:p-8`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-(--sys-shape-corner-full) bg-(--sys-color-primary-container) px-3.5 py-1 uppercase text-(--sys-color-on-primary-container) ${T_KICKER}`}
            >
              {kicker}
            </span>
            <Link
              to="/core"
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-high) px-4 text-(--sys-color-on-surface) no-underline hover:bg-(--sys-color-surface-container-highest) ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING}`}
            >
              ← All Core primitives
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>{title}</h1>
            <p className={`m-0 max-w-[72ch] ${T_BODY} ${INK_SOFT}`}>
              {subtitle}
            </p>
          </div>

          <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${STRIP} flex flex-col gap-1 px-4 py-3`}
              >
                <dt className={`${T_BODY_SM} ${INK_SOFT}`}>{stat.label}</dt>
                <dd className={`m-0 ${T_LABEL_LG} ${INK}`}>{stat.value}</dd>
              </div>
            ))}
          </dl>

          <nav
            aria-label="Showcase sections"
            className="flex flex-wrap items-center gap-1.5 pt-1"
          >
            {sections.map(({ id, label, badge }, idx) => (
              <a
                key={id}
                href={`#showcase-section-${id}`}
                className={`inline-flex min-h-10 items-center gap-2 px-3.5 no-underline ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
                  idx === 0 ? PILL_ACTIVE : PILL_REST
                }`}
              >
                <span>{label}</span>
                {badge ? (
                  <span
                    className={`rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-highest) px-2 py-0.5 text-(--sys-color-on-surface-variant) ${T_BODY_SM}`}
                  >
                    {badge}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </header>

        <div className="flex flex-col gap-12">{children}</div>
      </PageCard>
    </SiteLayout>
  );
}

export function ShowcaseSection({
  id,
  kicker,
  title,
  description,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`showcase-section-${id}`}
      aria-labelledby={`${id}-heading`}
      className={`${CARD} flex flex-col gap-6 p-6 sm:p-8`}
    >
      <header className="flex flex-col gap-2">
        <span className={`uppercase text-(--sys-color-primary) ${T_KICKER}`}>
          {kicker}
        </span>
        <h2 id={`${id}-heading`} className={`m-0 ${T_SECTION} ${INK}`}>
          {title}
        </h2>
        <p className={`m-0 max-w-[74ch] ${T_BODY} ${INK_SOFT}`}>
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}
