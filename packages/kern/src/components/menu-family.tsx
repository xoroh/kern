import { useControllableState } from "@xoroh/kern-primitives";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { SheetSurface } from "./sheet-family";

/**
 * Tranche 2 of the kern web/native parity work: the menu family and the filter
 * chip row.
 *
 * ## Why
 *
 * These three concepts were registered native-only. Unlike the presentational
 * rows ruled out in the cut list, each owns real behaviour a consumer can
 * observe — a dismissal path, a group structure, or a multi-select state — so
 * each earns a web component rather than a CSS rule.
 *
 * ## The contract
 *
 * Assertions are role / label / state, never primitive internals. `MenuScreen`
 * is a list of destinations; `MenuSheet` is the same structure hosted in the
 * sheet shell from tranche 1; `FilterChipRow` is a toggle group. Swapping the
 * primitive must not change what a consumer can observe.
 */

/** One action in a menu group. Mirrors the native `MenuAction`. */
export type MenuAction = {
  /** Stable identity for tests and analytics; not shown. */
  key: string;
  label: string;
  supporting?: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** A destructive action, expressed as a role — not a variant of its own. */
  destructive?: boolean;
  onPress?: () => void;
};

/** A titled group of actions. Omit `heading` for an ungrouped list. */
export type MenuGroup = {
  heading?: string;
  actions: readonly MenuAction[];
};

function MenuActionRow({
  action,
  onPress,
}: {
  action: MenuAction;
  onPress?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={action.disabled}
      onClick={action.onPress ?? onPress}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-(--md-sys-shape-corner-medium) px-3 py-2 text-left",
        "hover:opacity-[var(--md-sys-state-hover)]",
        "active:opacity-[var(--md-sys-state-press)]",
        action.disabled && "opacity-[var(--md-sys-state-disabled)]",
        // Destructive is a ROLE (error on errorContainer), not a variant name,
        // so the component count does not grow a "danger" axis.
        action.destructive
          ? "bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container)"
          : "text-(--md-sys-color-on-surface)",
      )}
    >
      {action.icon ? <span aria-hidden="true">{action.icon}</span> : null}
      <span className="flex flex-col">
        <span className="text-(--md-sys-typescale-body-large-font-size)">
          {action.label}
        </span>
        {action.supporting ? (
          <span className="text-(--md-sys-typescale-body-small-font-size) text-(--md-sys-color-on-surface-variant)">
            {action.supporting}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function MenuGroupList({
  groups,
  label,
}: {
  groups: readonly MenuGroup[];
  label: string;
}) {
  return (
    <ul
      aria-label={label}
      className="flex list-none flex-col gap-4 p-0"
    >
      {groups.map((group, index) => (
        <li key={group.heading ?? `group-${index}`}>
          {/*
            The heading is the group's accessible name. An ungrouped list is one
            unnamed group rather than a group with an empty name, so a screen
            reader is not offered a blank label.
          */}
          {group.heading ? (
            <div
              role="group"
              aria-label={group.heading}
              className="flex flex-col gap-1"
            >
              <p className="px-3 pb-1 text-(--md-sys-typescale-title-small-font-size) font-semibold text-(--md-sys-color-on-surface-variant)">
                {group.heading}
              </p>
              <ul role="none" className="flex list-none flex-col gap-1 p-0">
                {group.actions.map((action) => (
                  <li key={action.key}>
                    <MenuActionRow action={action} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul role="none" className="flex list-none flex-col gap-1 p-0">
              {group.actions.map((action) => (
                <li key={action.key}>
                  <MenuActionRow action={action} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// MenuScreen — a full-screen list of destinations.
// ---------------------------------------------------------------------------

export type MenuScreenProps = {
  /** Accessible name for the list. */
  label: string;
  groups: readonly MenuGroup[];
  className?: string;
  testID?: string;
};

/**
 * A destination list, NOT a menu. It is not modal and does not take the
 * interaction lock, so it carries no elevation token and no `aria-modal` — the
 * same docked-vs-dialog reasoning as `DockSheet`.
 */
export function MenuScreen({
  label,
  groups,
  className,
  testID,
}: MenuScreenProps) {
  return (
    <div
      data-slot="menu-screen"
      data-testid={testID ?? "kern-menu-screen"}
      className={cn(
        "flex h-full flex-col overflow-y-auto bg-(--md-sys-color-surface) p-4",
        className,
      )}
    >
      <MenuGroupList groups={groups} label={label} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// MenuSheet — the same structure, hosted in the sheet shell.
// ---------------------------------------------------------------------------

export type MenuSheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  groups: readonly MenuGroup[];
  className?: string;
  testID?: string;
};

/**
 * A menu in a sheet. Reuses `SheetSurface` from tranche 1 rather than
 * re-implementing the dismissal path — one place owns scrim, Escape and focus
 * return, so a fix there lands here too.
 */
export function MenuSheet({
  open,
  defaultOpen,
  onOpenChange,
  title,
  groups,
  className,
  testID,
}: MenuSheetProps) {
  return (
    <SheetSurface
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      label={title}
      testID={testID ?? "kern-menu-sheet"}
      className={cn(
        "w-[min(24rem,100vw)] gap-3 rounded-t-(--md-sys-shape-corner-extra-large) p-4 shadow-(--md-sys-elevation-level1)",
        className,
      )}
    >
      <p className="text-(--md-sys-typescale-title-large-font-size) font-semibold text-(--md-sys-color-on-surface)">
        {title}
      </p>
      <MenuGroupList groups={groups} label={title} />
    </SheetSurface>
  );
}

// ---------------------------------------------------------------------------
// FilterChipRow — a horizontal row of multi-select filter chips.
// ---------------------------------------------------------------------------

export type FilterChipOption = { value: string; label: string };

export type FilterChipRowProps = {
  options: readonly FilterChipOption[];
  /** Controlled selection. */
  value?: readonly string[];
  /** Uncontrolled initial selection. */
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  /** Accessible name for the group. */
  label?: string;
  className?: string;
  testID?: string;
};

/**
 * `role="group"` with each chip a toggle carrying `aria-pressed`.
 *
 * Multi-select is the native contract, so a second press REMOVES the value
 * rather than being ignored — a filter chip that cannot be switched off is not
 * a toggle. The state is controllable from outside, matching the native
 * `useControllableState` contract.
 */
export function FilterChipRow({
  options,
  value,
  defaultValue,
  onValueChange,
  label = "Filters",
  className,
  testID,
}: FilterChipRowProps) {
  const [selected, setSelected] = useControllableState<readonly string[]>(
    value,
    defaultValue ?? [],
    onValueChange,
  );
  const active = selected ?? [];

  const toggle = (option: FilterChipOption) => {
    const next = active.includes(option.value)
      ? active.filter((entry) => entry !== option.value)
      : [...active, option.value];
    setSelected(next);
  };

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="filter-chip-row"
      data-testid={testID ?? "kern-filter-chip-row"}
      className={cn(
        "flex flex-row items-center gap-2 overflow-x-auto p-1",
        className,
      )}
    >
      {options.map((option) => {
        const pressed = active.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => toggle(option)}
            className={cn(
              "min-h-8 shrink-0 rounded-(--md-sys-shape-corner-small) px-3 text-(--md-sys-typescale-label-large-font-size)",
              "hover:opacity-[var(--md-sys-state-hover)]",
              "active:opacity-[var(--md-sys-state-press)]",
              pressed
                ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
                : "border border-(--md-sys-color-outline) text-(--md-sys-color-on-surface-variant)",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
