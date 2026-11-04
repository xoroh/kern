import { Button } from "@xoroh/kern";
import {
  CtaBanner,
  FeatureGrid,
  Hero,
  MarketingSections,
  PricingTable,
  TestimonialList,
} from "@xoroh/kern/start";
import type { ExampleSpec } from "../example";

/**
 * MarketingSections examples — hero (start Hero slot) plus feature,
 * pricing, testimonial and CTA sections for the base SITE.
 */
export const MARKETING_SECTIONS_EXAMPLES: ExampleSpec[] = [
  {
    id: "marketing-sections",
    title: "Hero, features, pricing, testimonials, CTA",
    description:
      "Sections render only when given data; the hero is always the host-composed start Hero — never re-implemented.",
    package: "@xoroh/kern/start",
    render: () => (
      <MarketingSections
        hero={
          <Hero
            eyebrow="Kern"
            title="One design system"
            lede="M3 structure, operator pace."
          />
        }
        featuresTitle="Everything runs on tokens"
        features={[
          {
            id: "a",
            title: "Tokens",
            description: "One role table, both platforms.",
          },
          {
            id: "b",
            title: "Parity",
            description: "Web and native share contracts.",
          },
          {
            id: "c",
            title: "Blocks",
            description: "Compose, never re-implement.",
          },
        ]}
        pricingTitle="Pricing"
        plans={[
          {
            id: "starter",
            name: "Starter",
            price: "€0",
            features: ["5 seats"],
          },
          {
            id: "growth",
            name: "Growth",
            price: "€29",
            features: ["Unlimited seats", "Priority support"],
            highlighted: true,
            badge: "Popular",
          },
          {
            id: "scale",
            name: "Scale",
            price: "Custom",
            features: ["SSO", "Audit log"],
          },
        ]}
        testimonialsTitle="Loved by ops"
        testimonials={[
          {
            id: "t",
            quote: "It just works.",
            author: "Sam",
            role: "Dispatcher",
          },
        ]}
        cta={{ title: "Start today", description: "Free trial, no card." }}
      />
    ),
    code: `<MarketingSections
  hero={<Hero eyebrow="Kern" title="One" lede="M3 structure." />}
  features={[{ id: "a", title: "Tokens" }]}
  plans={[{ id: "pro", name: "Pro", price: "€29 / mo", features: [] }]}
/>`,
  },
];
export const FEATURE_GRID_EXAMPLES: ExampleSpec[] = [
  {
    id: "marketing-feature-grid",
    title: "Feature grid",
    description:
      "Items are data — id, title, description, icon — rendered as cards. No items, no section.",
    package: "@xoroh/kern/start",
    render: () => (
      <FeatureGrid
        title="Everything runs on tokens"
        items={[
          { id: "a", title: "Tokens", description: "One role table." },
          {
            id: "b",
            title: "Parity",
            description: "Web and native share contracts.",
          },
        ]}
      />
    ),
    code: `<FeatureGrid
  title="Features"
  items={[{ id: "a", title: "Tokens", description: "One role table." }]}
/>`,
  },
];
export const PRICING_TABLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "marketing-pricing-table",
    title: "Pricing table",
    description:
      "Plans are data with an optional highlighted plan; picking is a notification, checkout stays host-owned.",
    package: "@xoroh/kern/start",
    render: () => (
      <PricingTable
        title="Plans"
        plans={[
          {
            id: "base",
            name: "Base",
            price: "€0 / mo",
            features: ["Dispatch"],
          },
          {
            id: "pro",
            name: "Pro",
            price: "€29 / mo",
            features: ["Dispatch", "Analytics"],
            highlighted: true,
          },
        ]}
      />
    ),
    code: `<PricingTable
  title="Plans"
  plans={[{ id: "pro", name: "Pro", price: "€29 / mo", features: ["Analytics"] }]}
  onSelect={() => {}}
/>`,
  },
];
export const TESTIMONIAL_LIST_EXAMPLES: ExampleSpec[] = [
  {
    id: "marketing-testimonial-list",
    title: "Testimonials",
    description:
      "Quotes are data — id, quote, author, role — rendered as figure cards.",
    package: "@xoroh/kern/start",
    render: () => (
      <TestimonialList
        title="Operators"
        items={[
          {
            id: "q1",
            quote: "Dispatch got quiet.",
            author: "Ada",
            role: "Owner",
          },
        ]}
      />
    ),
    code: `<TestimonialList
  title="Operators"
  items={[{ id: "q1", quote: "Quiet dispatch.", author: "Ada", role: "Owner" }]}
/>`,
  },
];
export const CTA_BANNER_EXAMPLES: ExampleSpec[] = [
  {
    id: "marketing-cta-banner",
    title: "CTA banner",
    description:
      "Title plus host-owned actions. The banner positions controls, never builds them.",
    package: "@xoroh/kern/start",
    render: () => (
      <CtaBanner
        title="Start today"
        description="Free trial, no card."
        actions={<Button variant="filled">Get started</Button>}
      />
    ),
    code: `<CtaBanner
  title="Start today"
  actions={<button type="button">Get started</button>}
/>`,
  },
];
