import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";
import {
  KernNavigation,
  type KernNavSection,
  type RouteManifestEntry,
  routeManifestToSections,
} from "./kern-navigation";
import { KernTabs } from "./kern-tabs";
import { SegmentedButtonItem, SegmentedButtonRoot } from "./segmented-button";
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";

/**
 * KernSettings — ONE settings family (CL-014; D925 "one settings row").
 *
 * Unifies the switch/segmented/select/button sub-rows the inventory found
 * scattered across surfaces (CMP-3112/3152/3173 switch/segmented/select
 * dialects, desk per-section re-implemented item rows, CMP-0596 settings
 * dialog tabs, CMP-0674 `SettingsSectionPage` + 16 ITEM_PANELS):
 *
 * - `KernSettingsRow` — label + supporting + leading-icon + ONE trailing
 *   control (`switch` / `segmented` / `select` / `button` / `custom`).
 * - `KernSettingsSection` — titled row group (an ITEM_PANEL preset shape).
 * - `KernSettingsScreen` — the SettingsPage block: profile / security /
 *   preference / notification groups incl. the named-routes builder; W
 *   `sidebar` layout (KernNavigation `sidebar-pane`) or `tabs` layout
 *   (KernTabs vertical pills — the CMP-0596 dialog-tabs pattern); N
 *   renders the grouped list (see the native twin).
 *
 * Visuals + contracts only (Q3 split): values flow through props; the
 * platform settings service owns persistence, D786 coverage stays
 * platform-side. `start/blocks.tsx` `SettingsRow` converges onto this
 * contract at transfer (not rewritten here — core never depends on
 * blocks; same rule as WP2a's navigation-rail note).
 *
 * M3: https://m3.material.io/components/lists,
 * https://m3.material.io/components/switch,
 * https://m3.material.io/components/radio-button,
 * https://m3.material.io/components/tabs/overview
 */

export type SettingsControlKind =
  | "switch"
  | "segmented"
  | "select"
  | "button"
  | "custom";

export type SettingsSegmentOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SettingsSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type KernSettingsRowProps = {
  /** Row name. Required: the row (and its control) is named by this. */
  label: ReactNode;
  supporting?: ReactNode;
  /** Leading slot: a KernIcon-registry icon. Never raw lucide. */
  icon?: ReactNode;
  /** Trailing control kind. Default `custom` (the `trailing` slot). */
  control?: SettingsControlKind;
  // `switch` control state.
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  // `segmented` control state (2–5 visible choices; M3 guidance law).
  segmentedOptions?: readonly SettingsSegmentOption[];
  segmentedValue?: string;
  defaultSegmentedValue?: string;
  onSegmentedChange?: (value: string) => void;
  // `select` control state (closed list; composes the Select compound).
  selectOptions?: readonly SettingsSelectOption[];
  selectValue?: string;
  defaultSelectValue?: string;
  onSelectChange?: (value: string) => void;
  selectPlaceholder?: string;
  // `button` (navigational) control: link row with trailing chevron/badge.
  href?: string;
  /** Navigational activation (R2 lexicon: DOMAIN action, not state). */
  onPress?: () => void;
  badge?: ReactNode;
  /** `custom` control slot (the `start/blocks` `trailing` contract). */
  trailing?: ReactNode;
  disabled?: boolean;
  className?: string;
  testID?: string;
};

function rowLabelText(label: ReactNode): string | undefined {
  return typeof label === "string" ? label : undefined;
}

/** ONE settings row: label + supporting + leading icon + one control. */
export function KernSettingsRow({
  label,
  supporting,
  icon,
  control = "custom",
  checked,
  defaultChecked,
  onCheckedChange,
  segmentedOptions = [],
  segmentedValue,
  defaultSegmentedValue,
  onSegmentedChange,
  selectOptions = [],
  selectValue,
  defaultSelectValue,
  onSelectChange,
  selectPlaceholder = "Select",
  href,
  onPress,
  badge,
  trailing,
  disabled = false,
  className,
  testID,
}: KernSettingsRowProps) {
  const name = rowLabelText(label);
  const body = (
    <>
      {icon ? (
        <span
          aria-hidden="true"
          data-slot="settings-row-icon"
          className="flex shrink-0 items-center text-(--sys-color-on-surface-variant)"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-(--sys-color-on-surface)">
          {label}
        </span>
        {supporting ? (
          <span className="text-xs text-(--sys-color-on-surface-variant)">
            {supporting}
          </span>
        ) : null}
      </span>
      {control === "switch" ? (
        <Switch
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label={name}
          data-slot="settings-row-switch"
        />
      ) : null}
      {control === "segmented" ? (
        <SegmentedButtonRoot
          multiple={false}
          value={segmentedValue !== undefined ? [segmentedValue] : undefined}
          defaultValue={
            defaultSegmentedValue !== undefined
              ? [defaultSegmentedValue]
              : undefined
          }
          disabled={disabled}
          aria-label={name}
          data-slot="settings-row-segmented"
          onValueChange={(next) => {
            // Single-exclusive group: the pick is the one pressed value; a
            // cleared pick resolves to nothing and keeps the choice.
            const pick = next[0];
            if (pick !== undefined) onSegmentedChange?.(pick);
          }}
        >
          {segmentedOptions.map((option) => (
            <SegmentedButtonItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SegmentedButtonItem>
          ))}
        </SegmentedButtonRoot>
      ) : null}
      {control === "select" ? (
        <SelectRoot
          value={selectValue}
          defaultValue={defaultSelectValue}
          disabled={disabled}
          onValueChange={(next) => onSelectChange?.(next as string)}
        >
          <SelectTrigger
            aria-label={name}
            data-slot="settings-row-select"
            className="h-10 w-auto min-w-32 text-sm"
          >
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <SelectItemText>{option.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      ) : null}
      {control === "button" ? (
        <span
          data-slot="settings-row-action"
          className="flex shrink-0 items-center gap-2"
        >
          {badge}
          <span
            aria-hidden="true"
            className="text-(--sys-color-on-surface-variant)"
          >
            ›
          </span>
        </span>
      ) : null}
      {control === "custom" && trailing ? (
        <span
          data-slot="settings-row-trailing"
          className="flex shrink-0 items-center"
        >
          {trailing}
        </span>
      ) : null}
    </>
  );
  const rowClass = cn(
    "kern-settings-row flex min-h-14 items-center gap-4 bg-(--sys-color-surface) px-4 py-3",
    className,
  );
  // The navigational row is ONE control: the whole row activates (M3 list
  // item with trailing chevron). Every other kind keeps activation on the
  // trailing control, so the row stays a group, never a nested control.
  if (control === "button") {
    const Content = (
      <span className="flex min-w-0 flex-1 items-center gap-4">{body}</span>
    );
    if (href !== undefined) {
      return (
        <a
          href={href}
          onClick={onPress}
          aria-label={name}
          data-slot="settings-row"
          data-testid={testID ?? "kern-settings-row"}
          className={cn(rowClass, FOCUS_RING_CLASS, "outline-none")}
        >
          {Content}
        </a>
      );
    }
    return (
      <button
        type="button"
        onClick={onPress}
        aria-label={name}
        disabled={disabled}
        data-slot="settings-row"
        data-testid={testID ?? "kern-settings-row"}
        className={cn(
          rowClass,
          "w-full cursor-pointer text-left",
          FOCUS_RING_CLASS,
          "outline-none",
        )}
      >
        {Content}
      </button>
    );
  }
  return (
    // biome-ignore lint/a11y/useSemanticElements: no native element groups a label + control; role=group is correct (cf. button-group).
    <div
      role="group"
      aria-label={name}
      data-slot="settings-row"
      data-testid={testID ?? "kern-settings-row"}
      className={rowClass}
    >
      {body}
    </div>
  );
}

export type KernSettingsSectionDef = {
  /** Stable identity: section keys + the screen's active-section value. */
  id: string;
  title: ReactNode;
  description?: ReactNode;
  rows: readonly KernSettingsRowProps[];
};

export type KernSettingsSectionProps = KernSettingsSectionDef & {
  /** Row density: compact 48 / medium 56 (M3 list heights). */
  density?: "compact" | "medium";
  className?: string;
  testID?: string;
};

/** One titled row group (an ITEM_PANEL preset shape, CMP-0674). */
export function KernSettingsSection({
  id,
  title,
  description,
  rows,
  density = "medium",
  className,
  testID,
}: KernSettingsSectionProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      data-slot="settings-section"
      data-testid={testID ?? `kern-settings-section-${id}`}
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="px-4">
        <h2
          id={`${id}-title`}
          className="text-xs font-medium tracking-wide text-(--sys-color-on-surface-variant)"
        >
          {title}
        </h2>
        {description ? (
          <p className="pt-1 text-xs text-(--sys-color-on-surface-variant)">
            {description}
          </p>
        ) : null}
      </div>
      <div
        data-slot="settings-section-rows"
        className="flex flex-col gap-px overflow-hidden rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container)"
      >
        {rows.map((row, index) => (
          <KernSettingsRow
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are static section config, never reordered.
            key={`${id}-row-${index}`}
            {...row}
            className={cn(
              density === "compact" && "min-h-12 py-2",
              row.className,
            )}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * D786 setting-def → row adapter. The platform admin-settings lane owns
 * coverage (every setting has a screen); this maps its def shape onto
 * rows so no surface re-implements item rows per section.
 */
export type SettingDef = {
  key: string;
  label: string;
  supporting?: string;
  kind: "toggle" | "choice" | "select" | "link";
  choices?: readonly SettingsSegmentOption[];
  options?: readonly SettingsSelectOption[];
  href?: string;
};

export function settingDefToRow(def: SettingDef): KernSettingsRowProps {
  switch (def.kind) {
    case "toggle":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "switch",
      };
    case "choice":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "segmented",
        segmentedOptions: def.choices ?? [],
      };
    case "select":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "select",
        selectOptions: def.options ?? [],
      };
    case "link":
      return {
        label: def.label,
        supporting: def.supporting,
        control: "button",
        href: def.href,
      };
  }
}

/**
 * Named-routes builder: hosts declare settings routes once
 * (`{ path, label, section? }[]`) and the screen renders them. Delegates
 * to the navigation adapter — one implementation (D925), not a second.
 */
export function settingsRoutesToSections(
  routes: readonly RouteManifestEntry[],
): KernNavSection[] {
  return routeManifestToSections(routes);
}

export type KernSettingsScreenLayout = "sidebar" | "tabs";

export type KernSettingsScreenProps = {
  sections: readonly KernSettingsSectionDef[];
  /** Controlled active section id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /**
   * `sidebar` (default): full page — KernNavigation `sidebar-pane` with
   * the section rows in the detail pane. `tabs`: KernTabs vertical pills
   * beside the rows — the CMP-0596 dialog-tabs pattern for dialogs and
   * narrow widths. Never both (one section list per screen).
   */
  layout?: KernSettingsScreenLayout;
  header?: ReactNode;
  footer?: ReactNode;
  label?: string;
  density?: "compact" | "medium";
  className?: string;
  testID?: string;
};

/** SettingsPage block: sections + named routes over rows. */
export function KernSettingsScreen({
  sections,
  value,
  defaultValue,
  onValueChange,
  layout = "sidebar",
  header,
  footer,
  label = "Settings",
  density = "medium",
  className,
  testID,
}: KernSettingsScreenProps) {
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? sections[0]?.id,
  );
  const active = value ?? uncontrolled;
  const select = (id: string) => {
    if (value === undefined) setUncontrolled(id);
    onValueChange?.(id);
  };
  const current =
    sections.find((section) => section.id === active) ?? sections[0];
  const navSections: KernNavSection[] = sections.map((section) => ({
    key: section.id,
    destinations: [
      {
        key: section.id,
        label: typeof section.title === "string" ? section.title : section.id,
      },
    ],
  }));
  const rows = current ? (
    <KernSettingsSection {...current} density={density} />
  ) : null;

  if (layout === "tabs") {
    return (
      <div
        data-slot="kern-settings-screen"
        data-testid={testID ?? "kern-settings-screen"}
        className={cn("flex gap-4", className)}
      >
        <KernTabs
          orientation="vertical"
          variant="secondary"
          label={label}
          items={sections.map((section) => ({
            value: section.id,
            label:
              typeof section.title === "string" ? section.title : section.id,
          }))}
          value={current?.id}
          onValueChange={select}
        />
        <div className="min-w-0 flex-1">{rows}</div>
      </div>
    );
  }
  return (
    <KernNavigation
      variant="sidebar-pane"
      sections={navSections}
      value={current?.id}
      onValueChange={select}
      header={header}
      footer={footer}
      label={label}
      detail={rows}
      testID={testID ?? "kern-settings-screen"}
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// Section presets (data, not components — hosts spread them into `sections`)
// ---------------------------------------------------------------------------

/** Profile group preset. */
export const profileSettingsSection: KernSettingsSectionDef = {
  id: "profile",
  title: "Profile",
  rows: [
    {
      label: "Name",
      supporting: "Shown to staff and partners",
      control: "button",
    },
    { label: "Email", supporting: "Sign-in and receipts", control: "button" },
    {
      label: "Avatar",
      supporting: "Initials disc or photo",
      control: "button",
    },
  ],
};

/** Security group preset. */
export const securitySettingsSection: KernSettingsSectionDef = {
  id: "security",
  title: "Security",
  rows: [
    {
      label: "Passkey",
      supporting: "Sign in without a password",
      control: "button",
    },
    {
      label: "Active sessions",
      supporting: "Devices signed in now",
      control: "button",
    },
    {
      label: "Two-step verification",
      supporting: "Code on every new device",
      control: "switch",
      defaultChecked: true,
    },
  ],
};

/** Preference group preset. */
export const preferenceSettingsSection: KernSettingsSectionDef = {
  id: "preferences",
  title: "Preferences",
  rows: [
    {
      label: "Theme",
      supporting: "Light, dark, or system",
      control: "segmented",
      segmentedOptions: [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ],
      defaultSegmentedValue: "system",
    },
    {
      label: "Language",
      supporting: "Display language (RTL mirrors layout)",
      control: "select",
      selectOptions: [
        { value: "en", label: "English" },
        { value: "nl", label: "Nederlands" },
        { value: "ar", label: "العربية" },
      ],
      defaultSelectValue: "en",
    },
  ],
};

/** Notification group preset. */
export const notificationSettingsSection: KernSettingsSectionDef = {
  id: "notifications",
  title: "Notifications",
  rows: [
    {
      label: "Push notifications",
      supporting: "Alerts on this device",
      control: "switch",
      defaultChecked: true,
    },
    {
      label: "Email digests",
      supporting: "Daily summary",
      control: "switch",
    },
  ],
};

/**
 * A-004 / MS-003 preset: pool auto-claim platform-default editor (staff).
 * Allowed modes off/limited/auto + bounds. Bounds option rows are
 * placeholders the dispatch lane wires to real platform bounds (D922 Q2);
 * the preset owns the shape (segmented mode + bounded select), never the
 * numbers.
 */
export const poolAutoClaimSection: KernSettingsSectionDef = {
  id: "pool-auto-claim",
  title: "Pool auto-claim",
  description:
    "Platform default. Partners choose within these bounds (see Partner auto-claim).",
  rows: [
    {
      label: "Auto-claim mode",
      supporting: "Off, limited, or automatic pool claiming",
      control: "segmented",
      segmentedOptions: [
        { value: "off", label: "Off" },
        { value: "limited", label: "Limited" },
        { value: "auto", label: "Auto" },
      ],
      defaultSegmentedValue: "limited",
    },
    {
      label: "Auto-claim bound",
      supporting: "Platform ceiling; wired to dispatch bounds at transfer",
      control: "select",
      selectOptions: [
        { value: "b1", label: "Up to 1 concurrent" },
        { value: "b2", label: "Up to 2 concurrent" },
        { value: "b4", label: "Up to 4 concurrent" },
      ],
      defaultSelectValue: "b2",
    },
  ],
};

/**
 * A-004 / MS-004 preset: partner auto-claim choice control. The partner
 * picks within the platform bounds above — the supporting line names the
 * ceiling so the choice reads as bounded, not free.
 */
export const partnerAutoClaimSection: KernSettingsSectionDef = {
  id: "partner-auto-claim",
  title: "Partner auto-claim",
  description: "Your choice, within the platform default bounds.",
  rows: [
    {
      label: "My auto-claim",
      supporting: "Follows the platform ceiling",
      control: "segmented",
      segmentedOptions: [
        { value: "off", label: "Off" },
        { value: "limited", label: "Limited" },
        { value: "auto", label: "Auto" },
      ],
      defaultSegmentedValue: "off",
    },
  ],
};
