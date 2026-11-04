import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "./marketing";
import {
  CtaBanner,
  FeatureGrid,
  MarketingSections,
  PricingTable,
  TestimonialList,
} from "./marketing-sections";

describe("MarketingSections", () => {
  it("renders features, pricing, testimonials and CTA around a host hero", () => {
    render(
      <MarketingSections
        hero={
          <Hero
            eyebrow="Kern"
            title="One design system"
            lede="M3 structure, operator pace."
          />
        }
        featuresTitle="Features"
        features={[
          { id: "a", title: "Tokens", description: "One role table." },
          { id: "b", title: "Parity", description: "Web + native." },
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
            features: ["Unlimited seats"],
            highlighted: true,
            badge: "Popular",
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
        cta={{ title: "Start today", description: "Free trial." }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "One design system" }),
    ).toBeTruthy();
    expect(screen.getByText("Tokens")).toBeTruthy();
    expect(screen.getByText("€29")).toBeTruthy();
    expect(screen.getByText("Popular")).toBeTruthy();
    expect(screen.getByText("It just works.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Start today" })).toBeTruthy();
  });

  it("reports plan picks without duplicating the hero", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PricingTable
        plans={[{ id: "growth", name: "Growth", price: "€29", features: [] }]}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Choose plan" }));
    expect(onSelect).toHaveBeenCalledWith("growth");
  });

  it("renders sections only when given data", () => {
    const { container } = render(<MarketingSections />);
    expect(
      container.querySelector('[data-slot="marketing-sections"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-slot="marketing-pricing"]'),
    ).toBeNull();
  });
});

describe("marketing section parts", () => {
  it("FeatureGrid, TestimonialList and CtaBanner compose standalone", () => {
    render(
      <>
        <FeatureGrid title="F" items={[{ id: "a", title: "Tokens" }]} />
        <TestimonialList
          title="T"
          items={[{ id: "t", quote: "Great.", author: "Jo" }]}
        />
        <CtaBanner title="Go" actions={<button type="button">Start</button>} />
      </>,
    );
    expect(screen.getByText("Tokens")).toBeTruthy();
    expect(screen.getByText("Great.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Start" })).toBeTruthy();
  });
});
