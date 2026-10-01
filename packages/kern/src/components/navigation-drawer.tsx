import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { type ReactNode, useState } from "react";
import { cn } from "../utils/cn";
import {
  NavigationBarItem,
  type NavigationDestination,
} from "./navigation-bar";

/**
 * M3 navigation drawer, **modal** variant: a scrim, a focus trap, Escape to
 * dismiss, and a destination list. Same destinations as
 * {@link NavigationBar} — M3 only forbids the bar and the modal drawer being
 * visible at once, which the host owns.
 *
 * Behaviour this component owns on top of the dialog primitive:
 *
 * - **Item activation closes the drawer** after reporting the new selection.
 *   A modal drawer that stays open after you pick a destination is a trap;
 *   native does the same (`navigation-drawer.tsx:150-153`).
 * - **Scrim dismissal and Escape** — inherited from the dialog primitive, and
 *   reported through `onOpenChange` so a host keeps one state variable.
 * - **Focus return to the trigger** — inherited, and the reason the primitive
 *   is composed rather than re-implemented with a portal and a scrim.
 * - **Modal semantics** — `role="dialog"` + `aria-modal`, a labelled drawer
 *   (`aria-label` from `title`, falling back to the caller's `aria-label`), and
 *   a 360dp panel capped at 80% so tablets and foldables keep the detail pane
 *   visible (M3 drawer measures).
 */

export const SECTION_DRAWER_WIDTH = 360;

export type NavigationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinations: NavigationDestination[];
  /** Controlled active destination key. */
  value?: string;
  /** Initial active key for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Headline above the destination list. */
  title?: ReactNode;
  /** Supporting line under the headline. */
  subtitle?: ReactNode;
  /** Slot under the list (account row, app switcher, sign-out). */
  footer?: ReactNode;
  /** Accessible name when there is no visible `title`. */
  "aria-label"?: string;
  className?: string;
  testID?: string;
};

/** M3 modal navigation drawer. */
export function NavigationDrawer({
  open,
  onOpenChange,
  destinations,
  value,
  defaultValue,
  onValueChange,
  title,
  subtitle,
  footer,
  className,
  testID,
  "aria-label": ariaLabel,
}: NavigationDrawerProps) {
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const active = controlled ? value : uncontrolled;
  const select = (key: string) => {
    if (!controlled) setUncontrolled(key);
    onValueChange?.(key);
  };

  return (
    <DialogPrimitive.Root
      data-slot="navigation-drawer-root"
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="navigation-drawer-backdrop"
          className="kern-navigation-drawer-backdrop fixed inset-0 bg-(--md-sys-color-scrim)/40 transition-opacity"
        />
        <DialogPrimitive.Viewport className="kern-navigation-drawer-viewport fixed inset-0 flex justify-start">
          <DialogPrimitive.Popup
            data-slot="navigation-drawer"
            data-testid={testID ?? "kern-navigation-drawer"}
            // Base UI's Popup traps focus and inerts the rest of the page but
            // does not emit aria-modal; the parity contract (row 11) requires
            // it, and a modal drawer must announce itself as one.
            aria-modal="true"
            aria-label={title ? undefined : ariaLabel}
            className={cn(
              "kern-navigation-drawer flex h-full w-[min(22.5rem,80vw)] flex-col overflow-y-auto bg-(--md-sys-color-surface-container-low) pt-6 text-(--md-sys-color-on-surface) outline-none",
              className,
            )}
          >
            {title || subtitle ? (
              <div
                data-slot="navigation-drawer-header"
                className="flex flex-col gap-1 px-6 pb-6"
              >
                {title ? (
                  <DialogPrimitive.Title className="text-(length:--md-sys-typescale-title-large-font-size) font-medium text-(--md-sys-color-on-surface)">
                    {title}
                  </DialogPrimitive.Title>
                ) : null}
                {subtitle ? (
                  <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}
            <nav
              data-slot="navigation-drawer-list"
              aria-label="Destinations"
              className="flex flex-col gap-1 px-3"
            >
              {destinations.map((destination) => (
                <NavigationBarItem
                  key={destination.key}
                  label={destination.label}
                  icon={destination.icon}
                  badge={destination.badge}
                  disabled={destination.disabled}
                  selected={destination.key === active}
                  onSelect={() => {
                    select(destination.key);
                    // A modal drawer must not survive the choice that dismissed
                    // its reason for being open.
                    onOpenChange(false);
                  }}
                />
              ))}
            </nav>
            {footer ? (
              <div
                data-slot="navigation-drawer-footer"
                className="mt-auto flex flex-col gap-1 px-3 pt-4"
              >
                {footer}
              </div>
            ) : null}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
