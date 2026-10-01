import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { type ReactNode, useRef, useState } from "react";
import {
  menuItemClass,
  menuPopupClass,
  menuSeparatorClass,
} from "./menu-classes";

/**
 * M3 FAB menu — a FAB that opens a menu of related actions instead of firing
 * one. It is the answer to "the screen has more actions than one FAB can
 * carry", and it is a *separate component* rather than a `Fab` variant because
 * its trigger is a menu: it announces `aria-haspopup`, its state is open/closed
 * rather than pressed/unpressed, and its children are a list of commands.
 *
 * Composed on the Base UI menu root, so the roving-focus item traversal, the
 * typeahead, Escape and the focus-return-to-trigger are the primitive's rather
 * than a re-implementation with its own bugs. What kern owns, and what a
 * consumer should not have to build:
 *
 * - **The trigger is a FAB** — 56dp, `elevation-level1`, `primary` container,
 *   and it shows the open state by rotating its icon rather than swapping
 *   colour, which is the M3 motion cue.
 * - **`aria-haspopup="menu"` and `aria-expanded`** on the trigger, so the
 *   control announces that it opens something before it is pressed. A FAB that
 *   silently opens a menu is announced as a plain button.
 * - **Escape closes and focus returns to the FAB**, composed on the root, so
 *   a keyboard user is not dropped at the top of the document.
 * - **Selecting an action dismisses the menu** and reports the action, so the
 *   host never has to close it by hand and cannot forget to.
 * - **Disabled actions** are announced disabled and cannot be chosen.
 *
 * Actions are declared as data (`actions`), not as composed children, so the
 * menu can own its roving order and its dismissal without the consumer wiring
 * each item's close.
 */

export type FabMenuAction = {
  /** Stable identity for the action; also the React key. */
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** Drawn between this action and the previous one. */
  separated?: boolean;
  onSelect?: () => void;
};

export type FabMenuProps = {
  /** Accessible name of the trigger. Defaults to the first action's label. */
  label?: string;
  /** Icon on the trigger. `openIcon` replaces it while the menu is open. */
  icon: ReactNode;
  /** Icon shown while the menu is open. Defaults to `icon`. */
  openIcon?: ReactNode;
  actions: FabMenuAction[];
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for the uncontrolled case. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Overrides the trigger's accessible name (and therefore the menu's). The
   * menu surface inherits its name from the trigger; it does not carry its own.
   */
  menuLabel?: string;
  className?: string;
  triggerClassName?: string;
  testID?: string;
};

export function FabMenu({
  label,
  icon,
  openIcon,
  actions,
  open,
  defaultOpen = false,
  onOpenChange,
  menuLabel,
  className,
  triggerClassName,
  testID,
}: FabMenuProps) {
  const controlled = open !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isOpen = controlled ? open : uncontrolled;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const baseName = label ?? actions[0]?.label ?? "Actions";
  // `menuLabel` names the TRIGGER, not the popup: the popup's accessible name
  // comes from `aria-labelledby` -> trigger, so a separate popup name would be
  // a second, competing name rather than an extra piece of information.
  const name = menuLabel ?? baseName;

  const setOpen = (next: boolean) => {
    if (!controlled) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    // `open` is passed ONLY when the host controls it. Feeding the internal
    // state back in as `open` would make the root permanently controlled, so
    // `setOpen` would update a value nothing reads and the menu could never
    // open — a controlled-looking prop that silently kills the component.
    <MenuPrimitive.Root
      open={controlled ? isOpen : undefined}
      onOpenChange={setOpen}
      modal={false}
    >
      <div data-slot="fab-menu" className={className}>
        <MenuPrimitive.Trigger
          ref={triggerRef}
          type="button"
          data-slot="fab-menu-trigger"
          data-open={isOpen || undefined}
          aria-label={name}
          data-testid={testID ?? "kern-fab-menu"}
          className={[
            "kern-fab-menu-trigger relative inline-flex size-14 shrink-0 rotate-0 items-center justify-center rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) shadow-(--md-sys-elevation-level1) transition-transform outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 data-[open]:rotate-90 [&_svg]:size-6 [&_svg]:shrink-0",
            triggerClassName ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span
            aria-hidden="true"
            className="flex items-center justify-center transition-transform data-[open]:-rotate-90"
          >
            {isOpen ? (openIcon ?? icon) : icon}
          </span>
        </MenuPrimitive.Trigger>

        <MenuPrimitive.Portal>
          <MenuPrimitive.Positioner
            sideOffset={8}
            align="end"
            className="kern-fab-menu-positioner"
          >
            {/* No `aria-label` here on purpose: the menu root already points
              `aria-labelledby` at the trigger, so the menu announces as the
              control that opened it. Adding a second name here means two
              competing names and the reader picks one arbitrarily. `menuLabel`
              therefore names the trigger instead. */}
            <MenuPrimitive.Popup
              data-slot="fab-menu-content"
              className={menuPopupClass}
            >
              {actions.map((action) => (
                <div key={action.key}>
                  {action.separated && action.key !== actions[0]?.key ? (
                    <MenuPrimitive.Separator className={menuSeparatorClass} />
                  ) : null}
                  <MenuPrimitive.Item
                    data-slot="fab-menu-item"
                    disabled={action.disabled}
                    // Select-then-dismiss: Base UI closes the menu on item
                    // activation, so the host never has to — and cannot forget
                    // to — close it after running the action.
                    onClick={() => action.onSelect?.()}
                    className={menuItemClass}
                  >
                    {action.icon ? (
                      <span aria-hidden="true" className="flex items-center">
                        {action.icon}
                      </span>
                    ) : null}
                    {action.label}
                  </MenuPrimitive.Item>
                </div>
              ))}
            </MenuPrimitive.Popup>
          </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
      </div>
    </MenuPrimitive.Root>
  );
}
