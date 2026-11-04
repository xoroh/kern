import type { ComponentPropsWithRef, ReactNode } from "react";
import { Card } from "../components/card";
import { StatusPill } from "../components/status-pill";
import { cn } from "../utils/cn";

/**
 * MarketingSections — hero/feature/pricing/testimonial/CTA page sections
 * (D951 WP4; base SITE needs).
 *
 * Composes ONLY `Card` + `StatusPill` + text/type roles over the start
 * `Hero` (D925 — the hero lives in `./marketing` and is composed here as a
 * slot, never re-implemented). Q3 split: a platform composition designed
 * here as a Kern-component composition, never Xoroh-specific logic — copy,
 * plans and testimonials arrive as data from the host.
 *
 * M3: no M3 marketing component — page pattern on M3 type/shape/color
 * roles (https://m3.material.io/styles/typography/overview).
 *
 * Port sources (OSI only): material-tailwind section composition ONLY,
 * never M2 visuals (MIT,
 * https://github.com/creativetimofficial/material-tailwind/blob/main/LICENSE.md);
 * Flutter M3 type/shape values (BSD-3-Clause,
 * https://github.com/flutter/flutter/blob/master/LICENSE).
 */

export type MarketingFeature = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Leading slot: a KernIcon-registry icon. */
  icon?: ReactNode;
};

export type FeatureGridProps = Omit<
  ComponentPropsWithRef<"section">,
  "title" | "children"
> & {
  /** Section heading. */
  title?: ReactNode;
  description?: ReactNode;
  items: MarketingFeature[];
};

export function FeatureGrid({
  title,
  description,
  items,
  className,
  ...props
}: FeatureGridProps) {
  return (
    <section
      data-slot="marketing-features"
      aria-label={typeof title === "string" ? title : "Features"}
      className={cn("kern-feature-grid", className)}
      {...props}
    >
      {title ? (
        <h2 className="text-(length:--sys-typescale-headline-small-font-size) leading-(--sys-typescale-headline-small-line-height) font-(--sys-typescale-headline-small-font-weight) text-(--sys-color-on-surface)">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-1 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
          {description}
        </p>
      ) : null}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} data-slot="marketing-feature" className="p-4">
            {item.icon ? (
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-(--sys-shape-corner-full) bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
              >
                {item.icon}
              </span>
            ) : null}
            <h3 className="mt-3 text-(length:--sys-typescale-title-medium-font-size) leading-(--sys-typescale-title-medium-line-height) font-(--sys-typescale-title-medium-font-weight) text-(--sys-color-on-surface)">
              {item.title}
            </h3>
            {item.description ? (
              <p className="mt-1 text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
                {item.description}
              </p>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}

export type MarketingPlan = {
  id: string;
  name: ReactNode;
  /** Localised price line ("€29 / mo"). Node so the host owns locales. */
  price: ReactNode;
  blurb?: ReactNode;
  features: ReactNode[];
  /** Highlighted (most-popular) plan: primary border + badge. */
  highlighted?: boolean;
  badge?: ReactNode;
};

export type PricingTableProps = Omit<
  ComponentPropsWithRef<"section">,
  "title" | "children" | "onSelect"
> & {
  title?: ReactNode;
  description?: ReactNode;
  plans: MarketingPlan[];
  /** Plan pick notification (R2 lexicon: allowlisted DOMAIN action). */
  onSelect?: (plan: string) => void;
  selectLabel?: string;
};

export function PricingTable({
  title,
  description,
  plans,
  onSelect,
  selectLabel = "Choose plan",
  className,
  ...props
}: PricingTableProps) {
  return (
    <section
      data-slot="marketing-pricing"
      aria-label={typeof title === "string" ? title : "Pricing"}
      className={cn("kern-pricing-table", className)}
      {...props}
    >
      {title ? (
        <h2 className="text-(length:--sys-typescale-headline-small-font-size) leading-(--sys-typescale-headline-small-line-height) font-(--sys-typescale-headline-small-font-weight) text-(--sys-color-on-surface)">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-1 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
          {description}
        </p>
      ) : null}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.highlighted ? "outlined" : "filled"}
            data-slot="marketing-plan"
            data-highlighted={plan.highlighted ? "true" : undefined}
            className={cn(
              "flex flex-col p-6",
              plan.highlighted && "border-2 border-(--sys-color-primary)",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-(length:--sys-typescale-title-medium-font-size) leading-(--sys-typescale-title-medium-line-height) font-(--sys-typescale-title-medium-font-weight) text-(--sys-color-on-surface)">
                {plan.name}
              </span>
              {plan.badge ? (
                <StatusPill tone={plan.highlighted ? "primary" : "neutral"}>
                  {plan.badge}
                </StatusPill>
              ) : null}
            </span>
            <span className="mt-2 text-(length:--sys-typescale-headline-medium-font-size) leading-(--sys-typescale-headline-medium-line-height) font-(--sys-typescale-headline-medium-font-weight) text-(--sys-color-on-surface)">
              {plan.price}
            </span>
            {plan.blurb ? (
              <span className="mt-1 text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
                {plan.blurb}
              </span>
            ) : null}
            <ul className="mt-4 flex flex-col gap-2">
              {plan.features.map((feature, index) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: static host marketing copy with no identity — never reordered.
                  key={index}
                  className="flex items-start gap-2 text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface)"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-(--sys-shape-corner-full) bg-(--sys-color-primary)"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            {onSelect ? (
              <span className="mt-6">
                <button
                  type="button"
                  onClick={() => onSelect(String(plan.id))}
                  className={cn(
                    "kern-pricing-select inline-flex min-h-12 w-full items-center justify-center rounded-(--sys-shape-corner-full) px-6 text-sm leading-5 font-medium",
                    plan.highlighted
                      ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                      : "border border-(--sys-color-outline) text-(--sys-color-primary)",
                  )}
                >
                  {selectLabel}
                </button>
              </span>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}

export type MarketingTestimonial = {
  id: string;
  quote: ReactNode;
  author: ReactNode;
  role?: ReactNode;
};

export type TestimonialListProps = Omit<
  ComponentPropsWithRef<"section">,
  "title" | "children"
> & {
  title?: ReactNode;
  items: MarketingTestimonial[];
};

export function TestimonialList({
  title,
  items,
  className,
  ...props
}: TestimonialListProps) {
  return (
    <section
      data-slot="marketing-testimonials"
      aria-label={typeof title === "string" ? title : "Testimonials"}
      className={cn("kern-testimonial-list", className)}
      {...props}
    >
      {title ? (
        <h2 className="text-(length:--sys-typescale-headline-small-font-size) leading-(--sys-typescale-headline-small-line-height) font-(--sys-typescale-headline-small-font-weight) text-(--sys-color-on-surface)">
          {title}
        </h2>
      ) : null}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card
            key={item.id}
            as="figure"
            data-slot="marketing-testimonial"
            className="p-6"
          >
            <blockquote className="text-(length:--sys-typescale-body-large-font-size) leading-(--sys-typescale-body-large-line-height) text-(--sys-color-on-surface)">
              {item.quote}
            </blockquote>
            <figcaption className="mt-4 text-(length:--sys-typescale-label-large-font-size) leading-(--sys-typescale-label-large-line-height) font-(--sys-typescale-label-large-font-weight) text-(--sys-color-on-surface-variant)">
              {item.author}
              {item.role ? (
                <span className="font-normal"> · {item.role}</span>
              ) : null}
            </figcaption>
          </Card>
        ))}
      </div>
    </section>
  );
}

export type CtaBannerProps = Omit<
  ComponentPropsWithRef<"section">,
  "title" | "children"
> & {
  title: ReactNode;
  description?: ReactNode;
  /** CTA actions slot (host Buttons). */
  actions?: ReactNode;
};

export function CtaBanner({
  title,
  description,
  actions,
  className,
  ...props
}: CtaBannerProps) {
  return (
    <section
      data-slot="marketing-cta"
      aria-label={typeof title === "string" ? title : "Get started"}
      className={cn(
        "kern-cta-banner rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-primary) p-6 text-(--sys-color-on-primary) sm:p-10",
        className,
      )}
      {...props}
    >
      <h2 className="max-w-[20ch] text-(length:--sys-typescale-headline-medium-font-size) leading-(--sys-typescale-headline-medium-line-height) font-(--sys-typescale-headline-medium-font-weight)">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-prose text-(length:--sys-typescale-body-large-font-size) leading-(--sys-typescale-body-large-line-height) opacity-90">
          {description}
        </p>
      ) : null}
      {actions ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </section>
  );
}

export type MarketingSectionsProps = {
  /** Hero slot — the host passes the start `Hero` (never re-implemented). */
  hero?: ReactNode;
  features?: MarketingFeature[];
  featuresTitle?: ReactNode;
  plans?: MarketingPlan[];
  pricingTitle?: ReactNode;
  onSelect?: (plan: string) => void;
  testimonials?: MarketingTestimonial[];
  testimonialsTitle?: ReactNode;
  cta?: Omit<CtaBannerProps, "title"> & { title?: ReactNode };
  className?: string;
};

/**
 * MarketingSections — hero slot + feature grid + pricing + testimonials +
 * CTA banner: the base SITE page pattern. Sections render only when given
 * data; the hero is always host-composed (start `Hero`).
 */
export function MarketingSections({
  hero,
  features = [],
  featuresTitle,
  plans = [],
  pricingTitle,
  onSelect,
  testimonials = [],
  testimonialsTitle,
  cta,
  className,
}: MarketingSectionsProps) {
  return (
    <div
      data-slot="marketing-sections"
      className={cn(
        "kern-marketing-sections mx-auto flex w-full max-w-6xl flex-col gap-12 p-4 sm:p-6",
        className,
      )}
    >
      {hero}
      {features.length > 0 ? (
        <FeatureGrid title={featuresTitle} items={features} />
      ) : null}
      {plans.length > 0 ? (
        <PricingTable title={pricingTitle} plans={plans} onSelect={onSelect} />
      ) : null}
      {testimonials.length > 0 ? (
        <TestimonialList title={testimonialsTitle} items={testimonials} />
      ) : null}
      {cta?.title ? <CtaBanner {...cta} title={cta.title} /> : null}
    </div>
  );
}
