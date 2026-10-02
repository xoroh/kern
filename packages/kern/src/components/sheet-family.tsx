import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * The kern sheet family — the web versions of the native bottom-sheet concepts.
 *
 * ## Why this file exists
 *
 * `packages/kern/src/components/sheet.tsx` is a SIDE drawer (`side="left" | "right"`).
 * The native tier ships a bottom-anchored family, so those concepts were
 * registered native-only and counted as parity gaps. They are built here on the
 * same `@base-ui/react/dialog` primitive the drawer already uses — one behaviour
 * layer, two surfaces.
 *
 * ## The contract these hold to
 *
 * Assertions are about ROLE, LABEL and STATE — never about Base UI internals. The
 * primitive is an implementation detail that may be swapped; a consumer must not
 * be able to observe which one it is. So these components assert
 * `role="dialog"` + `aria-modal`, `role="listbox"`, `role="region"`, and
 * `aria-valuenow` — DOM contract, renderer-independent.
 *
 * ## Sources, stated honestly
 *
 * - `bottom-sheet`, `dock-sheet`, `snap-sheet`, `entity-sheet`, `action-sheet`,
 *   `bottom-sheet-picker` have a Material 3 component page; behaviour follows it.
 * - `SheetSurface` is a KERN name for the shared modal+scrim shell. It is not an
 *   M3 component and does not claim a spec source. On native it is a `Modal`
 *   wrapper; here it is the same dialog shell, named.
 *
 * ## Elevation
 *
 * M3's resting-elevation table places the modal bottom sheet at level 1 and
 * permits 0. A modal sheet sits above content, so level 1 is applied.
 * **DockSheet carries NO elevation token**: it is a persistent, non-modal
 * surface, and a docked panel at modal elevation misreads as an overlay.
 */

const backdropClass =
  "kern-sheet-backdrop fixed inset-0 bg-(--md-sys-color-scrim) opacity-32 transition-opacity";

const surfaceBase =
  "flex flex-col overflow-y-auto bg-(--md-sys-color-surface-container-low) outline-none";

// ---------------------------------------------------------------------------
// SheetSurface — the shared modal + scrim shell every kern sheet hosts through.
// ---------------------------------------------------------------------------

export type SheetSurfaceProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the surface. Required: a dialog must be nameable. */
  label: string;
  children?: ReactNode;
  className?: string;
  testID?: string;
};

/**
 * The one place a kern sheet gets a dismissal path: scrim press, Escape, and
 * focus return are the dialog primitive's, and every sheet below inherits them
 * rather than re-implementing.
 */
export function SheetSurface({
  open,
  defaultOpen,
  onOpenChange,
  label,
  children,
  className,
  testID,
}: SheetSurfaceProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="sheet-surface-backdrop"
          className={backdropClass}
        />
        <DialogPrimitive.Viewport className="fixed inset-0 flex items-end justify-center">
          <DialogPrimitive.Popup
            data-slot="sheet-surface"
            data-testid={testID ?? "kern-sheet-surface"}
            aria-label={label}
            // Base UI's `Dialog.Popup` traps focus and inerts the page but emits
            // no `aria-modal` (measured). Without it a screen reader announces a
            // dialog with no indication the rest of the page is unreachable —
            // the visual and accessibility trees disagree about whether you are
            // trapped. `dialog.tsx` carries the same hand-fix; this was caught
            // here by the contract test, not by reading the primitive.
            aria-modal="true"
            className={cn(surfaceBase, className)}
          >
            {children}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// BottomSheet — a modal surface anchored to the bottom edge.
// ---------------------------------------------------------------------------

export type BottomSheetProps = Omit<SheetSurfaceProps, "className"> & {
  /** Optional heading. When absent the surface is still labelled. */
  title?: string;
  /** Visible close control. M3 gives the sheet a dismissal affordance. */
  onClose?: () => void;
  className?: string;
};

export function BottomSheet({
  title,
  onClose,
  className,
  ...surface
}: BottomSheetProps) {
  return (
    <SheetSurface
      {...surface}
      className={cn(
        "w-[min(32rem,100vw)] max-h-[85vh] rounded-t-(--md-sys-shape-corner-extra-large) p-4 shadow-(--md-sys-elevation-level1) gap-3",
        className,
      )}
    >
      {title ? (
        <DialogPrimitive.Title
          data-slot="bottom-sheet-title"
          className="text-(--md-sys-typescale-title-large-font-size) font-semibold text-(--md-sys-color-on-surface)"
        >
          {title}
        </DialogPrimitive.Title>
      ) : null}
      {surface.children}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-12 place-items-center rounded-(--md-sys-shape-corner-full) text-(--md-sys-color-on-surface-variant) hover:opacity-[var(--md-sys-state-hover)]"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </SheetSurface>
  );
}

// ---------------------------------------------------------------------------
// DockSheet — a PERSISTENT bottom panel. Deliberately NOT modal.
// ---------------------------------------------------------------------------

export type DockSheetProps = {
  label: string;
  children?: ReactNode;
  className?: string;
  testID?: string;
};

/**
 * Docked ≠ dialog.
 *
 * The native dock sheet is a quick-action bar that peeks from the edge and does
 * not take the interaction lock, so this is `role="region"` and carries **no
 * elevation token**: at modal elevation a persistent panel misreads as an
 * overlay. That is a deliberate divergence from the modal sheets above, and it
 * is the reason this is not a `SheetSurface`.
 */
export function DockSheet({
  label,
  children,
  className,
  testID,
}: DockSheetProps) {
  return (
    <section
      role="region"
      aria-label={label}
      data-slot="dock-sheet"
      data-testid={testID ?? "kern-dock-sheet"}
      className={cn(
        "flex w-full items-center gap-2 rounded-t-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface-container-high) p-2",
        className,
      )}
    >
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// SnapSheet — a bottom sheet with detents.
// ---------------------------------------------------------------------------

export type SnapSheetProps = Omit<SheetSurfaceProps, "className"> & {
  /** Detents, as a fraction of viewport height (0–1). */
  snapPoints: readonly number[];
  label: string;
  /** Index into `snapPoints`; defaults to the first. */
  index?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
};

export function SnapSheet({
  snapPoints,
  label,
  index = 0,
  onIndexChange,
  className,
  ...surface
}: SnapSheetProps) {
  const count = snapPoints.length || 1;
  const current = Math.min(Math.max(index, 0), count - 1);
  const height = `${Math.round((snapPoints[current] ?? 0.5) * 100)}%`;

  return (
    <SheetSurface
      {...surface}
      label={label}
      className={cn(
        "w-[min(32rem,100vw)] rounded-t-(--md-sys-shape-corner-extra-large) p-4 shadow-(--md-sys-elevation-level1)",
        className,
      )}
    >
      {/*
        The detent control. `role="button"` + `aria-valuenow` is the web
        equivalent of the native `accessibilityRole="adjustable"`: the position
        is a value the user changes, and it is announced as one.
      */}
      <button
        type="button"
        aria-label={`${label}, snap position`}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={count - 1}
        onClick={() => onIndexChange?.((current + 1) % count)}
        className="mx-auto mb-2 grid h-6 w-12 place-items-center rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-container-highest)"
      >
        <span
          aria-hidden="true"
          className="h-1 w-6 rounded-full bg-(--md-sys-color-on-surface-variant)"
        />
      </button>
      <div style={{ maxHeight: height }} className="flex flex-col gap-2">
        {surface.children}
      </div>
    </SheetSurface>
  );
}

// ---------------------------------------------------------------------------
// EntitySheet — read-mostly detail for one record.
// ---------------------------------------------------------------------------

export type EntityField = { label: string; value: string; data?: boolean };

export type EntitySheetProps = Omit<SheetSurfaceProps, "className"> & {
  title: string;
  /** Supporting line under the title. */
  subtitle?: string;
  fields?: readonly EntityField[];
  /** At most one primary action, per the spec's guidance. */
  action?: ReactNode;
  className?: string;
};

export function EntitySheet({
  title,
  subtitle,
  fields = [],
  action,
  className,
  ...surface
}: EntitySheetProps) {
  return (
    <SheetSurface
      {...surface}
      label={title}
      className={cn(
        "w-[min(32rem,100vw)] rounded-t-(--md-sys-shape-corner-extra-large) p-4 shadow-(--md-sys-elevation-level1) gap-3",
        className,
      )}
    >
      <header className="flex flex-col gap-1">
        <DialogPrimitive.Title className="text-(--md-sys-typescale-title-large-font-size) font-semibold text-(--md-sys-color-on-surface)">
          {title}
        </DialogPrimitive.Title>
        {subtitle ? (
          <p className="text-(--md-sys-typescale-body-small-font-size) text-(--md-sys-color-on-surface-variant)">
            {subtitle}
          </p>
        ) : null}
      </header>
      {/*
        Fields sit on `surface-container-highest` so the eye lands on the VALUE,
        not the label — the same hierarchy the native sheet uses.
      */}
      <dl className="flex flex-col gap-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex flex-col gap-0.5 rounded-(--md-sys-shape-corner-medium) bg-(--md-sys-color-surface-container-highest) p-3"
          >
            <dt className="text-(--md-sys-typescale-label-small-font-size) text-(--md-sys-color-on-surface-variant)">
              {field.label}
            </dt>
            <dd
              className={
                field.data
                  ? "font-mono text-(--md-sys-typescale-body-medium-font-size) text-(--md-sys-color-on-surface)"
                  : "text-(--md-sys-typescale-body-large-font-size) text-(--md-sys-color-on-surface)"
              }
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
      {action ? <div className="flex justify-end gap-2">{action}</div> : null}
    </SheetSurface>
  );
}

// ---------------------------------------------------------------------------
// BottomSheetPicker — a sheet as a selector.
// ---------------------------------------------------------------------------

export type PickerOption = {
  value: string;
  label: string;
  supporting?: string;
  disabled?: boolean;
};

export type BottomSheetPickerProps = Omit<SheetSurfaceProps, "className"> & {
  title: string;
  options: readonly PickerOption[];
  value?: string;
  /** Multi-select exposes `aria-multiselectable`; single-select does not. */
  multiple?: boolean;
  onSelect: (value: string) => void;
  className?: string;
};

export function BottomSheetPicker({
  title,
  options,
  value,
  multiple = false,
  onSelect,
  className,
  ...surface
}: BottomSheetPickerProps) {
  return (
    <SheetSurface
      {...surface}
      label={title}
      className={cn(
        "w-[min(32rem,100vw)] rounded-t-(--md-sys-shape-corner-extra-large) p-4 shadow-(--md-sys-elevation-level1) gap-2",
        className,
      )}
    >
      <DialogPrimitive.Title className="text-(--md-sys-typescale-title-large-font-size) font-semibold text-(--md-sys-color-on-surface)">
        {title}
      </DialogPrimitive.Title>
      {/*
        `role="listbox"` + `role="option"` + `aria-selected`, and
        `aria-multiselectable` ONLY in the multi case. The selection is carried by
        the option's selected state — never by a differently-coloured row.
      */}
      <ul
        role="listbox"
        aria-label={title}
        aria-multiselectable={multiple || undefined}
        className="flex list-none flex-col gap-1 p-0"
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                onClick={() => onSelect(option.value)}
                className={cn(
                  "flex min-h-12 w-full flex-col items-start gap-0.5 rounded-(--md-sys-shape-corner-medium) p-3 text-left",
                  "hover:opacity-[var(--md-sys-state-hover)]",
                  "active:opacity-[var(--md-sys-state-press)]",
                  selected
                    ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
                    : "text-(--md-sys-color-on-surface)",
                  option.disabled && "opacity-[var(--md-sys-state-disabled)]",
                )}
              >
                <span className="text-(--md-sys-typescale-body-large-font-size)">
                  {option.label}
                  {/* The check carries selection, per the spec — not a fill. */}
                  {selected ? <span aria-hidden="true"> ✓</span> : null}
                </span>
                {option.supporting ? (
                  <span className="text-(--md-sys-typescale-body-small-font-size) text-(--md-sys-color-on-surface-variant)">
                    {option.supporting}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </SheetSurface>
  );
}

// ---------------------------------------------------------------------------
// ActionSheet — a titled list of actions with a dismissal path.
// ---------------------------------------------------------------------------

export type ActionSheetAction = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
};

export type ActionSheetProps = Omit<SheetSurfaceProps, "className"> & {
  title: string;
  actions: readonly ActionSheetAction[];
  children?: ReactNode;
  className?: string;
};

export function ActionSheet({
  title,
  actions,
  className,
  ...surface
}: ActionSheetProps) {
  return (
    <SheetSurface
      {...surface}
      label={title}
      className={cn(
        "w-[min(32rem,100vw)] rounded-t-(--md-sys-shape-corner-extra-large) p-4 shadow-(--md-sys-elevation-level1) gap-2",
        className,
      )}
    >
      <DialogPrimitive.Title className="text-(--md-sys-typescale-title-large-font-size) font-semibold text-(--md-sys-color-on-surface)">
        {title}
      </DialogPrimitive.Title>
      <ul className="flex list-none flex-col gap-1 p-0">
        {actions.map((action) => (
          <li key={action.id}>
            <button
              type="button"
              disabled={action.disabled}
              onClick={action.onSelect}
              className={cn(
                "min-h-12 w-full rounded-(--md-sys-shape-corner-medium) px-3 text-left text-(--md-sys-typescale-body-large-font-size) text-(--md-sys-color-on-surface)",
                "hover:opacity-[var(--md-sys-state-hover)]",
                "active:opacity-[var(--md-sys-state-press)]",
                action.disabled && "opacity-[var(--md-sys-state-disabled)]",
              )}
            >
              {action.label}
            </button>
          </li>
        ))}
      </ul>
      {surface.children}
    </SheetSurface>
  );
}
