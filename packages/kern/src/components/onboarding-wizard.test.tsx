import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OnboardingServiceStep, OnboardingWizard } from "./onboarding-wizard";

const steps = [
  { id: "org", title: "Workspace", content: "Org form" },
  { id: "services", title: "Services", content: "Service picker" },
  { id: "done", title: "Ready", content: "Done" },
];

describe("OnboardingWizard", () => {
  it("renders the step strip, progress and first panel", () => {
    render(<OnboardingWizard steps={steps} />);
    expect(screen.getByRole("tablist", { name: "Setup steps" })).toBeTruthy();
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    expect(screen.getByText("Org form")).toBeTruthy();
  });

  it("walks forward/back and completes on the last step", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onBack = vi.fn();
    const onComplete = vi.fn();
    render(
      <OnboardingWizard
        steps={steps}
        onValueChange={onValueChange}
        onBack={onBack}
        onComplete={onComplete}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onValueChange).toHaveBeenCalledWith("services");
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledWith("org");
    await user.click(screen.getByRole("tab", { name: "Ready" }));
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("honours a controlled value", () => {
    render(<OnboardingWizard steps={steps} value="services" />);
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
    expect(screen.getByText("Service picker")).toBeTruthy();
  });

  it("renders nothing with no steps", () => {
    const { container } = render(<OnboardingWizard steps={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("OnboardingServiceStep", () => {
  it("offers the injected catalog in plan mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <OnboardingServiceStep
        services={[
          { id: "taxi", name: "Taxi", priceLabel: "metered" },
          { id: "tour", name: "Tour", description: "City loop" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Services" }));
    await user.click(screen.getByRole("option", { name: /Taxi/ }));
    expect(onValueChange).toHaveBeenCalledWith("taxi");
  });
});
