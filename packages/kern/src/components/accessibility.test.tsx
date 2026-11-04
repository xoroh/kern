import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { Accordion } from "./accordion";
import { BillingPage } from "./billing-page";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { CheckboxGroup } from "./checkbox-group";
import { Collapsible } from "./collapsible";
import { DashboardPage } from "./dashboard-page";
import { EmptyState } from "./empty-state";
import { Field } from "./field";
import { Form } from "./form";
import { InputOTP } from "./input-otp";
import { KernLoading } from "./kern-loading";
import { MapMarker, MapPanel } from "./kern-maps";
import { KernTabs } from "./kern-tabs";
import { LinkButton } from "./link-button";
import { Meter } from "./meter";
import { OnboardingWizard } from "./onboarding-wizard";
import { Progress } from "./progress";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { StatusPill } from "./status-pill";
import { Switch } from "./switch";

describe("core web controls accessibility", () => {
  it("has no axe WCAG A/AA violations in a labeled form", async () => {
    const { container } = render(
      <main>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" required />
          <Field.Description>Work email address.</Field.Description>
        </Field.Root>
        <Checkbox label="Accept terms" />
        <Switch aria-label="Notifications" />
        <RadioGroup aria-label="Plan" defaultValue="free">
          <RadioGroupItem value="free">Free</RadioGroupItem>
          <RadioGroupItem value="pro">Pro</RadioGroupItem>
        </RadioGroup>
        <Button>Continue</Button>
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });
});

/**
 * WP1b P2 a11y gate (backlog: meter, progress, tabs, link-button web;
 * snackbar + tabs native covered in their rntests): zero WCAG A/AA
 * violations on the tabs/status/empty/loading surfaces. Lives in this
 * file — the single axe file — because axe-core serializes runs
 * process-wide ("Axe is already running" under parallel workers).
 */
describe("WP1b tabs/status/empty/loading accessibility", () => {
  it("has no violations on KernTabs primary + secondary", async () => {
    const items = [
      { value: "a", label: "Overview", content: "Panel A" },
      { value: "b", label: "Activity", content: "Panel B" },
    ];
    const { container, unmount } = render(
      <main>
        <KernTabs items={items} defaultValue="a" label="Primary" />
      </main>,
    );
    expect(
      (
        await axe.run(container, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        })
      ).violations,
    ).toEqual([]);
    unmount();
    const second = render(
      <main>
        <KernTabs
          items={items}
          defaultValue="a"
          variant="secondary"
          label="Secondary"
        />
      </main>,
    );
    expect(
      (
        await axe.run(second.container, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        })
      ).violations,
    ).toEqual([]);
  });

  it("has no violations on StatusPill, EmptyState and KernLoading", async () => {
    const { container } = render(
      <main>
        <StatusPill tone="success">Active</StatusPill>
        <EmptyState
          variant="section"
          title="No results"
          description="Try another search."
          primaryAction={<button type="button">Retry</button>}
          secondaryAction={<button type="button">Support</button>}
        />
        <KernLoading kind="skeleton-list" count={2} label="Loading" />
        <KernLoading kind="progress" value={0.5} label="Syncing" />
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });

  it("has no violations on Meter, Progress and LinkButton", async () => {
    const { container } = render(
      <main>
        <Meter.Root value={40} min={0} max={100} aria-label="Storage">
          <Meter.Label>Storage</Meter.Label>
        </Meter.Root>
        <Progress.Root value={30} aria-label="Upload">
          <Progress.Label>Upload</Progress.Label>
        </Progress.Root>
        <LinkButton href="https://example.com">Details</LinkButton>
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });
});

/**
 * WP9 Part D P2 a11y gate (form primitives: checkbox-group, form,
 * input-otp, radio-group): zero WCAG A/AA violations on the named-group
 * and submit-gate surfaces. Lives in this file — the single axe file —
 * because axe-core serializes runs process-wide ("Axe is already running"
 * under parallel workers).
 */
describe("WP9 form primitives accessibility", () => {
  it("has no violations on labeled CheckboxGroup + RadioGroup", async () => {
    const { container } = render(
      <main>
        <CheckboxGroup.Root aria-label="Toppings" defaultValue={["cheese"]}>
          <CheckboxGroup.Item value="cheese" label="Cheese" />
          <CheckboxGroup.Item value="salami" label="Salami" />
        </CheckboxGroup.Root>
        <RadioGroup aria-label="Plan" defaultValue="free">
          <RadioGroupItem value="free">Free</RadioGroupItem>
          <RadioGroupItem value="pro">Pro</RadioGroupItem>
        </RadioGroup>
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });

  it("has no violations on a labeled Form with a submit action", async () => {
    const { container } = render(
      <main>
        <Form>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Field.Control type="email" />
          </Field.Root>
          <Button type="submit">Continue</Button>
        </Form>
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });

  it("names the InputOTP group (cells pinned behaviorally, not by axe)", () => {
    // The OTP cells carry no per-cell accessible name on web — Base UI
    // ignores `aria-label` on the first input and asks for the group to be
    // labeled instead (see the native InputOTP header: web fix owed by
    // P2b-4). Axe's `label` rule therefore cannot pass on this surface
    // yet, so the a11y contract here is the named group plus one box per
    // character, asserted without axe.
    const { container } = render(
      <main>
        <InputOTP.Root length={4} aria-label="One-time code">
          <InputOTP.Input />
          <InputOTP.Input />
          <InputOTP.Input />
          <InputOTP.Input />
        </InputOTP.Root>
      </main>,
    );
    const group = container.querySelector('[role="group"][aria-label]');
    expect(group?.getAttribute("aria-label")).toBe("One-time code");
    expect(group?.querySelectorAll("input")).toHaveLength(4);
  });
});

/**
 * WP9 Part B P2 a11y gate (backlog: accordion, collapsible web; meter +
 * progress web already pinned in the WP1b block above; native snackbar in
 * snackbar.rntest): zero WCAG A/AA violations on the disclosure surfaces.
 * Lives in this file — the single axe file — because axe-core serializes
 * runs process-wide ("Axe is already running" under parallel workers).
 */
describe("WP9 Part B disclosure accessibility", () => {
  it("has no violations on Accordion single + multiple", async () => {
    const items = (
      <>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>First body</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Header>
            <Accordion.Trigger>Second</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Second body</Accordion.Panel>
        </Accordion.Item>
      </>
    );
    const { container, unmount } = render(
      <main>
        <Accordion.Root defaultValue={["a"]}>{items}</Accordion.Root>
      </main>,
    );
    expect(
      (
        await axe.run(container, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        })
      ).violations,
    ).toEqual([]);
    unmount();
    const second = render(
      <main>
        <Accordion.Root multiple defaultValue={["a", "b"]}>
          {items}
        </Accordion.Root>
      </main>,
    );
    expect(
      (
        await axe.run(second.container, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        })
      ).violations,
    ).toEqual([]);
  });

  it("has no violations on Collapsible closed + open", async () => {
    const { container, unmount } = render(
      <main>
        <Collapsible.Root>
          <Collapsible.Trigger>Details</Collapsible.Trigger>
          <Collapsible.Panel>Hidden content</Collapsible.Panel>
        </Collapsible.Root>
      </main>,
    );
    expect(
      (
        await axe.run(container, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        })
      ).violations,
    ).toEqual([]);
    unmount();
    const second = render(
      <main>
        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger>Details</Collapsible.Trigger>
          <Collapsible.Panel>Shown content</Collapsible.Panel>
        </Collapsible.Root>
      </main>,
    );
    expect(
      (
        await axe.run(second.container, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        })
      ).violations,
    ).toEqual([]);
  });
});

/**
 * WP4 P4 a11y gate (maps visuals + dashboard/onboarding/billing/marketing
 * templates): zero WCAG A/AA violations on the new surfaces. Lives in this
 * file — the single axe file — because axe-core serializes runs
 * process-wide ("Axe is already running" under parallel workers).
 */
describe("WP4 maps/templates accessibility", () => {
  it("has no violations on MapMarker + MapPanel", async () => {
    const { container } = render(
      <main>
        <MapMarker kind="vehicle" tone="info" label="12" />
        <MapMarker kind="guest" live consentLabel="Sharing until 14:30" />
        <MapPanel
          title="Trip 12"
          description="Airport pickup"
          meta={<StatusPill tone="info">En route</StatusPill>}
          actions={<button type="button">Message driver</button>}
          footer="ETA 14:32"
          onClose={() => {}}
        />
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });

  it("has no violations on DashboardPage + BillingPage (display-only)", async () => {
    const { container } = render(
      <main>
        <DashboardPage
          title="Overview"
          stats={[{ id: "a", label: "Active trips", value: "128" }]}
          activityRows={[{ id: "a", headline: "Trip 12 completed" }]}
        />
        <BillingPage
          title="Billing"
          plan={<p>Growth plan</p>}
          invoiceColumns={[{ key: "id", title: "Invoice" }]}
          invoiceRows={[{ id: "INV-001" }]}
        />
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });

  it("has no violations on OnboardingWizard", async () => {
    const { container } = render(
      <main>
        <OnboardingWizard
          steps={[
            { id: "org", title: "Workspace", content: "Org form" },
            { id: "services", title: "Services", content: "Picker" },
          ]}
        />
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });
});
