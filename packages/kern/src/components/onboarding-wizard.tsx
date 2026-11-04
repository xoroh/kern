import type { ComponentPropsWithRef, ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./button";
import { KernOverlay } from "./kern-overlay";
import { KernPicker, type ServiceCatalogEntry } from "./kern-picker";
import { KernTabs } from "./kern-tabs";

/**
 * OnboardingWizard — the generic stepped-setup template (D951 WP4; MS-018).
 *
 * Steps compose `KernTabs` (step strip) + step panel + Back/Continue footer;
 * `variant="modal"` wraps the same composition in `KernOverlay` (D925 — no
 * second dialog scaffold). MS-018 (onboarding service picker: pick from the
 * standard set at tenant creation, customize later) lands as the
 * `OnboardingServiceStep` preset: `KernPicker` in `plan` mode over the
 * injected service catalog (D924 adapter, `serviceCatalogToOptions`) — the
 * flow from inventory (`OnboardingWizardOrchestrator` account→org, CMP-0073,
 * which has no service step) gains its catalog step without a local picker
 * copy. Q3 split: designed here as a Kern-component composition, never
 * Xoroh-specific logic — steps arrive as data + nodes from the host.
 *
 * M3: no M3 onboarding component — page pattern on M3 type/shape/color
 * roles + tabs (https://m3.material.io/components/tabs) + dialogs
 * (https://m3.material.io/components/dialogs) for the modal variant.
 *
 * State contract (R2 lexicon-clean by construction): step identity is the
 * canonical `value`/`defaultValue`/`onValueChange` trio; `onBack`,
 * `onComplete` and `onCancel` are allowlisted DOMAIN actions — no new
 * state channel, no registration needed.
 */

export type OnboardingStep = {
  /** Stable step id (tab value + progress). */
  id: string;
  /** Step title (tab label — short text). */
  title: string;
  /** Supporting line under the step heading. */
  description?: ReactNode;
  /** Step body. */
  content?: ReactNode;
};

export type OnboardingWizardVariant = "page" | "modal";

export type OnboardingWizardProps = Omit<
  ComponentPropsWithRef<"section">,
  "title" | "children"
> & {
  steps: OnboardingStep[];
  /** Controlled active step id. */
  value?: string;
  /** Initial step for the uncontrolled case. Defaults to the first step. */
  defaultValue?: string;
  onValueChange?: (step: string) => void;
  /** `page` renders inline; `modal` wraps in `KernOverlay` (same strip +
   * panel + footer, no second scaffold). */
  variant?: OnboardingWizardVariant;
  /** Modal only: overlay open state (canonical pair with `onOpenChange`). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Modal only: × action (allowlisted DOMAIN action). */
  onClose?: () => void;
  /** Step-back notification (allowlisted). */
  onBack?: (step: string) => void;
  /** Final-step Continue notification (allowlisted). */
  onComplete?: () => void;
  /** Abort notification (allowlisted; host renders the trigger). */
  onCancel?: () => void;
  /** Accessible name for the step strip. */
  label?: string;
  backLabel?: string;
  continueLabel?: string;
  finishLabel?: string;
  cancelLabel?: string;
  testID?: string;
};

function stepIndex(steps: OnboardingStep[], active: string): number {
  const found = steps.findIndex((step) => step.id === active);
  return found === -1 ? 0 : found;
}

/**
 * OnboardingWizard — step strip + panel + Back/Continue footer. Free step
 * navigation (every step selectable); a host that must lock forward jumps
 * controls `value` itself.
 *
 * Usage: `<OnboardingWizard steps={[{ id: "org", title: "Workspace",
 * content: <OrgForm /> }, { id: "services", title: "Services", content:
 * <OnboardingServiceStep services={catalog} /> }]} onComplete={…} />`.
 */
export function OnboardingWizard({
  steps,
  value,
  defaultValue,
  onValueChange,
  variant = "page",
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  onBack,
  onComplete,
  onCancel,
  label = "Setup steps",
  backLabel = "Back",
  continueLabel = "Continue",
  finishLabel = "Finish",
  cancelLabel = "Cancel",
  className,
  testID,
  ...props
}: OnboardingWizardProps) {
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? steps[0]?.id ?? "",
  );
  const requested = value ?? uncontrolled;
  const index = stepIndex(steps, requested);
  const active = steps[index];
  if (!active) return null;

  const go = (next: string) => {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const body = (
    <>
      <p
        data-slot="onboarding-progress"
        aria-live="polite"
        className="mt-2 text-(length:--sys-typescale-label-medium-font-size) leading-(--sys-typescale-label-medium-line-height) text-(--sys-color-on-surface-variant)"
      >
        Step {index + 1} of {steps.length}
      </p>
      <h2 className="mt-4 text-(length:--sys-typescale-headline-small-font-size) leading-(--sys-typescale-headline-small-line-height) font-(--sys-typescale-headline-small-font-weight) text-(--sys-color-on-surface)">
        {active.title}
      </h2>
      {active.description ? (
        <p className="mt-1 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
          {active.description}
        </p>
      ) : null}
      {/*
        Step bodies ride the tab items' `content`: KernTabs mounts the
        active tab's panel itself, so every tab keeps a resolving
        `aria-controls` target (a strip with no panels fails axe
        aria-valid-attr-value). No second panel scaffold (D925).
      */}
      <KernTabs
        items={steps.map((step) => ({
          value: step.id,
          label: step.title,
          content: step.content,
        }))}
        value={active.id}
        onValueChange={go}
        variant="secondary"
        label={label}
        className="mt-2"
      />
      <div
        data-slot="onboarding-footer"
        className="mt-6 flex items-center justify-between gap-3"
      >
        <span>
          {!isFirst ? (
            <Button
              variant="text"
              onClick={() => {
                const prev = steps[index - 1];
                if (!prev) return;
                go(prev.id);
                onBack?.(prev.id);
              }}
            >
              {backLabel}
            </Button>
          ) : onCancel ? (
            <Button variant="text" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
        </span>
        <Button
          variant="filled"
          onClick={() => {
            if (isLast) {
              onComplete?.();
              return;
            }
            const next = steps[index + 1];
            if (next) go(next.id);
          }}
        >
          {isLast ? finishLabel : continueLabel}
        </Button>
      </div>
    </>
  );

  if (variant === "modal") {
    return (
      <KernOverlay
        variant="modal"
        title={active.title}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        testID={testID ?? "kern-onboarding-wizard"}
      >
        <section
          data-slot="onboarding-wizard"
          aria-label={label}
          className={cn("kern-onboarding-wizard", className)}
          {...props}
        >
          {body}
        </section>
      </KernOverlay>
    );
  }

  return (
    <section
      data-slot="onboarding-wizard"
      aria-label={label}
      className={cn(
        "kern-onboarding-wizard mx-auto w-full max-w-2xl",
        className,
      )}
      data-testid={testID ?? "kern-onboarding-wizard"}
      {...props}
    >
      {body}
    </section>
  );
}

export type OnboardingServiceStepProps = {
  /** Standard service set (D924 catalog input — injected, never local). */
  services: readonly ServiceCatalogEntry[];
  /** Accessible name + default trigger label. */
  label?: string;
  placeholder?: string;
  /** Controlled selection (canonical trio — maps onto the picker's
   * single-select channel; no new state name). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (service: string) => void;
  description?: ReactNode;
  className?: string;
};

/**
 * OnboardingServiceStep — the MS-018 catalog step preset: `KernPicker` in
 * `plan` mode over the injected service catalog. Step `content` for the
 * wizard above; usable standalone wherever a service pick belongs.
 */
export function OnboardingServiceStep({
  services,
  label = "Services",
  placeholder = "Choose services",
  value,
  defaultValue,
  onValueChange,
  description,
  className,
}: OnboardingServiceStepProps) {
  return (
    <div
      data-slot="onboarding-service-step"
      className={cn("kern-onboarding-service-step", className)}
    >
      {description ? (
        <p className="mb-3 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
          {description}
        </p>
      ) : null}
      <KernPicker
        mode="plan"
        catalog={services}
        label={label}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onSelect={onValueChange}
      />
    </div>
  );
}
