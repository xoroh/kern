import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import {
  CtaBanner,
  FeatureGrid,
  MarketingSections,
  PricingTable,
  TestimonialList,
} from "./marketing-sections";

describe("native MarketingSections", () => {
  it("renders features, pricing, testimonials and CTA", async () => {
    await render(
      <MarketingSections
        featuresTitle="Features"
        features={[
          { id: "a", title: "Tokens", description: "One role table." },
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
    expect(screen.getByTestId("kern-marketing-sections")).toBeTruthy();
    expect(screen.getByText("Tokens")).toBeTruthy();
    expect(screen.getByText("€29")).toBeTruthy();
    expect(screen.getByText("Popular")).toBeTruthy();
    expect(screen.getByText("It just works.")).toBeTruthy();
    expect(screen.getByText("Start today")).toBeTruthy();
  });

  it("reports plan picks", async () => {
    const onSelect = jest.fn();
    await render(
      <PricingTable
        plans={[{ id: "growth", name: "Growth", price: "€29", features: [] }]}
        onSelect={onSelect}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-pricing-select-growth"));
    });
    expect(onSelect).toHaveBeenCalledWith("growth");
  });

  it("renders sections only when given data", async () => {
    await render(<MarketingSections />);
    expect(screen.getByTestId("kern-marketing-sections")).toBeTruthy();
    expect(screen.queryByTestId("kern-marketing-pricing")).toBeNull();
  });

  it("FeatureGrid, TestimonialList and CtaBanner compose standalone", async () => {
    await render(
      <>
        <FeatureGrid title="F" items={[{ id: "a", title: "Tokens" }]} />
        <TestimonialList
          title="T"
          items={[{ id: "t", quote: "Great.", author: "Jo" }]}
        />
        <CtaBanner title="Go" />
      </>,
    );
    expect(screen.getByText("Tokens")).toBeTruthy();
    expect(screen.getByText("Great.")).toBeTruthy();
    expect(screen.getByText("Go")).toBeTruthy();
  });
});
