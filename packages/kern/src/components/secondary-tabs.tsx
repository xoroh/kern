import type { ReactNode } from "react";
import { KernTabs } from "./kern-tabs";

/**
 * M3 secondary tabs — the sub-section switcher inside a primary view.
 *
 * WP1b merge (D951, CL-009): this is now a thin wrapper over `KernTabs`
 * at `variant="secondary"` — same 2px indicator, same on-surface active
 * label, same roving-tabindex keyboard model, same mount-only-the-active-
 * panel rule. The wrapper stays so existing imports keep compiling;
 * retirement happens in transfer, never in design. New code reaches for
 * `KernTabs` directly.
 */

export type SecondaryTab = {
  value: string;
  label: string;
  /** Panel body. Rendered when this tab is active. */
  content?: ReactNode;
  disabled?: boolean;
};

export type SecondaryTabsProps = {
  tabs: SecondaryTab[];
  /** Controlled active tab value. */
  value?: string;
  /** Initial active value for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name for the tablist. */
  label?: string;
  className?: string;
  testID?: string;
};

export function SecondaryTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  label = "Sections",
  className,
  testID,
}: SecondaryTabsProps) {
  return (
    <KernTabs
      items={tabs}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      variant="secondary"
      label={label}
      className={className}
      testID={testID ?? "kern-secondary-tabs"}
    />
  );
}
