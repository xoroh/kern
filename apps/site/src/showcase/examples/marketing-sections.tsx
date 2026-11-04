import { Hero, MarketingSections } from "@xoroh/kern/start";
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
  hero={<Hero eyebrow="…" title="…" lede="…" />}
  features={[…]}
  plans={[…]}
/>`,
  },
];
