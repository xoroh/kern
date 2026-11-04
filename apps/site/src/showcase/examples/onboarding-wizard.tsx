import { OnboardingServiceStep, OnboardingWizard } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * OnboardingWizard examples — stepped setup (MS-018).
 *
 * Step strip (KernTabs) plus panel plus Back/Continue footer. The MS-018
 * service-catalog step is the OnboardingServiceStep preset: KernPicker in
 * plan mode over the injected catalog.
 */
export const ONBOARDING_WIZARD_EXAMPLES: ExampleSpec[] = [
  {
    id: "onboarding-wizard",
    title: "Workspace, services, ready",
    description:
      "Free step navigation with a live progress line. Walk to the services step to pick from the standard set.",
    render: () => (
      <OnboardingWizard
        steps={[
          { id: "org", title: "Workspace", content: "Workspace details form." },
          {
            id: "services",
            title: "Services",
            description: "Pick from the standard set — customize later.",
            content: (
              <OnboardingServiceStep
                services={[
                  { id: "taxi", name: "Taxi", priceLabel: "metered" },
                  { id: "tour", name: "City tour", description: "2-hour loop" },
                ]}
              />
            ),
          },
          { id: "done", title: "Ready", content: "Invite the team." },
        ]}
        onComplete={() => {}}
      />
    ),
    code: `<OnboardingWizard
  steps={[
    { id: "services", title: "Services", content: (
      <OnboardingServiceStep
        services={[{ id: "taxi", name: "Taxi", priceLabel: "metered" }]}
      />
    ) },
  ]}
  onComplete={() => {}}
/>`,
  },
];
export const ONBOARDING_SERVICE_STEP_EXAMPLES: ExampleSpec[] = [
  {
    id: "onboarding-service-step",
    title: "Service catalog step",
    description:
      "MS-018 service pick — the plan picker's option buttons over the host-injected catalog, no local copy.",
    render: () => (
      <div className="w-full max-w-xl">
        <OnboardingServiceStep
          services={[
            { id: "taxi", name: "Taxi", priceLabel: "metered" },
            {
              id: "tour",
              name: "City tour",
              description: "2-hour loop",
            },
          ]}
        />
      </div>
    ),
    code: `<OnboardingServiceStep
  services={[{ id: "taxi", name: "Taxi", priceLabel: "metered" }]}
  onValueChange={() => {}}
/>`,
  },
];
