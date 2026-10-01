import {
  type ComponentPropsWithRef,
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { Link } from "./link";

export const SIDEBAR_WIDTHS = {
  compact: 72,
  default: 256,
  expanded: 320,
} as const;
export const NAVIGATION_RAIL_WIDTH = 80;
export const SECTION_DRAWER_WIDTH = 360;

type SidebarState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarState | null>(null);

/** Sidebar open state; create it here and feed `AppShell` or `Sidebar`. */
export function useSidebar(): SidebarState {
  const state = useContext(SidebarContext);
  const [open, setOpen] = useState(true);
  return state ?? { open, setOpen, toggle: () => setOpen((v) => !v) };
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  ...props
}: ComponentPropsWithRef<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const value = { open, setOpen, toggle: () => setOpen((v) => !v) };
  return (
    <SidebarContext.Provider value={value}>
      <div data-slot="sidebar-provider" {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

/** Persistent sidebar: header/content/footer regions. */
export function Sidebar({
  width = "default",
  className,
  children,
  ...props
}: ComponentPropsWithRef<"nav"> & {
  width?: keyof typeof SIDEBAR_WIDTHS | number;
}) {
  const { open } = useSidebar();
  const px = typeof width === "number" ? width : SIDEBAR_WIDTHS[width];
  return (
    <nav
      data-slot="sidebar"
      aria-hidden={!open}
      style={{ width: open ? px : 0 }}
      className={cn(
        "kern-sidebar flex h-full shrink-0 flex-col overflow-hidden border-e border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) transition-[width] duration-(--md-sys-motion-duration-medium)",
        className,
      )}
      {...props}
    >
      {open ? children : null}
    </nav>
  );
}

export function SidebarHeader({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "kern-sidebar-header flex min-h-14 items-center gap-2 px-4",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "kern-sidebar-content flex min-h-0 flex-1 flex-col gap-1 p-2",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "kern-sidebar-footer flex min-h-14 items-center gap-2 px-4",
        className,
      )}
      {...props}
    />
  );
}

/** Sidebar destination: optional icon, required label, optional badge. */
export function SidebarItem({
  icon,
  label,
  badge,
  active = false,
  href,
  onSelect,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"a">, "href" | "onSelect"> & {
  icon?: ReactNode;
  label: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  href?: string;
  onSelect?: () => void;
}) {
  const body = (
    <>
      {icon ? (
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      {badge ? <span className="shrink-0 text-xs">{badge}</span> : null}
    </>
  );
  const cls = cn(
    "kern-sidebar-item flex min-h-12 items-center gap-3 rounded-(--md-sys-shape-corner-full) px-4 text-(--md-sys-color-on-surface)",
    active
      ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) font-medium"
      : "hover:bg-(--md-sys-color-surface-tonal)",
    className,
  );
  if (href) {
    return (
      <Link
        to={href}
        aria-current={active ? "page" : undefined}
        className={cls}
        {...props}
      >
        {body}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
      className={cls}
      {...(props as ComponentPropsWithRef<"button">)}
    >
      {body}
    </button>
  );
}

/** M3 navigation rail: top-aligned menu + destinations. */
export function NavigationRail({
  header,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"nav"> & { header?: ReactNode }) {
  return (
    <nav
      data-slot="navigation-rail"
      style={{ width: NAVIGATION_RAIL_WIDTH }}
      className={cn(
        "kern-navigation-rail flex h-full shrink-0 flex-col items-center gap-2 border-e border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) py-3 text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      {header ? <div className="mb-2 flex justify-center">{header}</div> : null}
      {children}
    </nav>
  );
}

/** Rail destination: icon + label + active indicator pill. */
export function NavigationRailButton({
  icon,
  label,
  active = false,
  href,
  onSelect,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"a">, "href" | "onSelect"> & {
  icon: ReactNode;
  label: ReactNode;
  active?: boolean;
  href?: string;
  onSelect?: () => void;
}) {
  const body = (
    <>
      <span
        className={cn(
          "flex h-8 w-14 items-center justify-center rounded-(--md-sys-shape-corner-full) transition-colors",
          active
            ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
            : "hover:bg-(--md-sys-color-surface-tonal)",
        )}
      >
        <span aria-hidden="true" className="flex items-center">
          {icon}
        </span>
      </span>
      <span className="text-xs">{label}</span>
    </>
  );
  const cls = cn(
    "kern-navigation-rail-button flex w-16 min-h-14 flex-col items-center justify-center gap-1 rounded-(--md-sys-shape-corner-medium)",
    className,
  );
  if (href) {
    return (
      <Link
        to={href}
        aria-current={active ? "page" : undefined}
        className={cls}
        {...props}
      >
        {body}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
      className={cls}
      {...(props as ComponentPropsWithRef<"button">)}
    >
      {body}
    </button>
  );
}

/** M3 section drawer (modal): sections list + optional drill-in panel. */
export function SectionDrawer({
  title,
  sections,
  detail,
  open,
  onClose,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"aside">, "title"> & {
  title: ReactNode;
  sections: ReactNode;
  detail?: ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close drawer"
          className="fixed inset-0 z-30 bg-(--md-sys-color-scrim)/30"
          onClick={onClose}
        />
      ) : null}
      <aside
        data-slot="section-drawer"
        aria-hidden={!open}
        style={{ width: SECTION_DRAWER_WIDTH }}
        className={cn(
          "kern-section-drawer fixed inset-y-0 start-0 z-40 flex flex-col bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) rounded-e-(--md-sys-shape-corner-extra-large) shadow-(--md-sys-elevation-level3) transition-transform duration-(--md-sys-motion-duration-medium)",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
          className,
        )}
        {...props}
      >
        <div className="flex min-h-14 items-center justify-between px-4">
          <h2 className="text-base font-medium">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-(--md-sys-shape-corner-full) hover:bg-(--md-sys-color-surface-tonal)"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-auto p-2">
            {sections}
          </div>
          {detail ? (
            <div className="w-64 shrink-0 border-s border-(--md-sys-color-outline-variant) p-3">
              {detail}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
