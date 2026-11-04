import { useControllableState } from "@xoroh/axis";
import type { ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Button } from "./button";
import { KernOverlay } from "./kern-overlay";
import { KernPicker, type ServiceCatalogEntry } from "./kern-picker";
import { KernTabs } from "./kern-tabs";
import { Text } from "./text";

/**
 * OnboardingWizard — native twin of the web `OnboardingWizard` (D951 WP4;
 * MS-018). Same contract (canonical step value trio + allowlisted
 * back/complete/cancel actions); press + screen-reader roles instead of
 * roving-tabindex, sheet physics from the overlay on `modal`.
 *
 * Steps compose `KernTabs` + panel + Back/Continue footer; `variant="modal"`
 * wraps the same composition in `KernOverlay`. MS-018 lands as
 * `OnboardingServiceStep`: `KernPicker` `plan` mode over the injected
 * catalog. Lexicon-clean: no new state channel.
 */

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
  content?: ReactNode;
};

export type OnboardingWizardVariant = "page" | "modal";

export type NativeOnboardingWizardProps = Omit<
  ViewProps,
  "children" | "style"
> & {
  steps: OnboardingStep[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (step: string) => void;
  variant?: OnboardingWizardVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onBack?: (step: string) => void;
  onComplete?: () => void;
  onCancel?: () => void;
  accessibilityLabel?: string;
  backLabel?: string;
  continueLabel?: string;
  finishLabel?: string;
  cancelLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const wizardStatic = StyleSheet.create({
  page: { flexDirection: "column", gap: 8, width: "100%", maxWidth: 672 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
});

function stepIndex(steps: OnboardingStep[], active: string): number {
  const found = steps.findIndex((step) => step.id === active);
  return found === -1 ? 0 : found;
}

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
  accessibilityLabel = "Setup steps",
  backLabel = "Back",
  continueLabel = "Continue",
  finishLabel = "Finish",
  cancelLabel = "Cancel",
  style,
  testID,
  ...props
}: NativeOnboardingWizardProps) {
  const scheme = useKernScheme();
  const [current, setCurrent] = useControllableState<string>(
    value,
    defaultValue ?? steps[0]?.id ?? "",
    onValueChange,
  );
  if (steps.length === 0) return null;
  const index = stepIndex(steps, current ?? "");
  const active = steps[index];
  if (!active) return null;
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const body = (
    <>
      <Text
        accessibilityLiveRegion="polite"
        style={{ color: scheme.color.onSurfaceVariant }}
      >
        Step {index + 1} of {steps.length}
      </Text>
      <Text variant="headline" accessibilityRole="header">
        {active.title}
      </Text>
      {active.description ? (
        <Text style={{ color: scheme.color.onSurfaceVariant }}>
          {active.description}
        </Text>
      ) : null}
      <KernTabs
        items={steps.map((step) => ({
          value: step.id,
          label: step.title,
          content: step.content,
        }))}
        value={active.id}
        onValueChange={setCurrent}
        variant="secondary"
      />
      <View style={wizardStatic.footer}>
        <View>
          {!isFirst ? (
            <Button
              variant="text"
              onPress={() => {
                const prev = steps[index - 1];
                if (!prev) return;
                setCurrent(prev.id);
                onBack?.(prev.id);
              }}
            >
              {backLabel}
            </Button>
          ) : onCancel ? (
            <Button variant="text" onPress={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
        </View>
        <Button
          variant="filled"
          onPress={() => {
            if (isLast) {
              onComplete?.();
              return;
            }
            const next = steps[index + 1];
            if (next) setCurrent(next.id);
          }}
        >
          {isLast ? finishLabel : continueLabel}
        </Button>
      </View>
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
        <View
          {...props}
          accessibilityLabel={accessibilityLabel}
          style={[wizardStatic.page, style]}
        >
          {body}
        </View>
      </KernOverlay>
    );
  }

  return (
    <View
      {...props}
      testID={testID ?? "kern-onboarding-wizard"}
      accessibilityLabel={accessibilityLabel}
      style={[wizardStatic.page, style]}
    >
      {body}
    </View>
  );
}

export type NativeOnboardingServiceStepProps = {
  services: readonly ServiceCatalogEntry[];
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (service: string) => void;
  description?: string;
};

/** MS-018 catalog step preset: `KernPicker` `plan` mode, canonical trio. */
export function OnboardingServiceStep({
  services,
  label = "Services",
  placeholder = "Choose services",
  value,
  defaultValue,
  onValueChange,
  description,
}: NativeOnboardingServiceStepProps) {
  const scheme = useKernScheme();
  return (
    <View testID="kern-onboarding-service-step">
      {description ? (
        <Text style={{ color: scheme.color.onSurfaceVariant }}>
          {description}
        </Text>
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
    </View>
  );
}
