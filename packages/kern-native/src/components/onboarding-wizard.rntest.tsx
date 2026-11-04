import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { OnboardingServiceStep, OnboardingWizard } from "./onboarding-wizard";

const steps = [
  { id: "org", title: "Workspace", content: <Text>Org form</Text> },
  { id: "services", title: "Services", content: <Text>Service picker</Text> },
  { id: "done", title: "Ready", content: <Text>Done</Text> },
];

describe("native OnboardingWizard", () => {
  it("renders the step strip, progress and first panel", async () => {
    await render(<OnboardingWizard steps={steps} />);
    expect(screen.getByTestId("kern-onboarding-wizard")).toBeTruthy();
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    expect(screen.getByText("Org form")).toBeTruthy();
  });

  it("walks forward/back and completes on the last step", async () => {
    const onValueChange = jest.fn();
    const onBack = jest.fn();
    const onComplete = jest.fn();
    await render(
      <OnboardingWizard
        steps={steps}
        onValueChange={onValueChange}
        onBack={onBack}
        onComplete={onComplete}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Continue" }));
    });
    expect(onValueChange).toHaveBeenCalledWith("services");
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Back" }));
    });
    expect(onBack).toHaveBeenCalledWith("org");
    await act(async () => {
      fireEvent.press(screen.getByRole("tab", { name: "Ready" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Finish" }));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("honours a controlled value and renders nothing with no steps", async () => {
    await render(<OnboardingWizard steps={steps} value="services" />);
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
  });

  it("renders no wizard with no steps", async () => {
    const { toJSON } = await render(<OnboardingWizard steps={[]} />);
    expect(toJSON()).toBeNull();
  });
});

describe("native OnboardingServiceStep", () => {
  it("renders the injected catalog label", async () => {
    await render(
      <OnboardingServiceStep
        services={[{ id: "taxi", name: "Taxi", priceLabel: "metered" }]}
      />,
    );
    expect(screen.getByTestId("kern-onboarding-service-step")).toBeTruthy();
  });
});
