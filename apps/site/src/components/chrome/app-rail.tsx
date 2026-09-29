import { useLocation } from "@tanstack/react-router";
import { cn, useKernTheme } from "@xoroh/kern";

type RailIcon = (props: { className?: string }) => React.ReactNode;

const HomeIcon: RailIcon = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3.2 3.5 10v10.3h5.6v-6h5.8v6h5.6V10L12 3.2Z" />
  </svg>
);

const DocsIcon: RailIcon = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6 3.5h9.5L19 7v13.5H6V3.5Zm2 2v13h9V8.2h-3.2V5.5H8Zm2 5h5.5v1.8H10V10.5Zm0 3.5h5.5V15H10v-1Z" />
  </svg>
);

const ComponentsIcon: RailIcon = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
  </svg>
);

const ThemeIcon: RailIcon = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.8a9.2 9.2 0 1 0 0 18.4V2.8Zm2 2.4v13.6a6.8 6.8 0 0 0 0-13.6Z" />
  </svg>
);

const GithubIcon: RailIcon = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.47.09.65-.2.65-.45v-1.6c-2.65.58-3.2-1.27-3.2-1.27-.44-1.1-1.07-1.4-1.07-1.4-.87-.6.07-.58.07-.58.96.07 1.47 1 1.47 1 .86 1.47 2.25 1.05 2.8.8.08-.62.33-1.05.6-1.29-2.1-.24-4.32-1.06-4.32-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.42-1.2.09-2.51 0 0 .8-.26 2.6.98a9 9 0 0 1 4.74 0c1.8-1.24 2.59-.98 2.59-.98.52 1.31.2 2.27.1 2.5.61.68.97 1.53.97 2.57 0 3.65-2.22 4.46-4.33 4.7.34.29.64.87.64 1.76v2.6c0 .25.18.55.66.45A9.5 9.5 0 0 0 12 2.5Z" />
  </svg>
);

const ITEMS: Array<{
  href: string;
  label: string;
  icon: RailIcon;
  external?: boolean;
}> = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/docs", label: "Docs", icon: DocsIcon },
  { href: "/components", label: "Components", icon: ComponentsIcon },
  { href: "/theme", label: "Theme", icon: ThemeIcon },
];

function railButtonClass(isActive: boolean) {
  return cn(
    "flex h-10 w-10 items-center justify-center rounded-full transition-colors outline-none",
    isActive
      ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
      : "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container) hover:text-(--md-sys-color-on-surface)",
  );
}

/** M3 navigation rail: 80px column, icon + label items, brand top, utilities bottom. */
export function AppRail() {
  const { pathname } = useLocation();
  const { mode, toggle } = useKernTheme();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center gap-1 border-r border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) py-4 md:flex"
    >
      <a
        href="/"
        aria-label="Kern home"
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) no-underline"
      >
        <span className="text-sm font-bold">K</span>
      </a>
      {ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            title={item.label}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-col items-center gap-1 rounded-(--md-sys-shape-corner-medium) px-1 py-1 text-[11px] no-underline"
          >
            <span className={railButtonClass(isActive)}>
              <Icon className="size-5" />
            </span>
            <span
              className={
                isActive
                  ? "font-medium text-(--md-sys-color-on-surface)"
                  : "text-(--md-sys-color-on-surface-variant)"
              }
            >
              {item.label}
            </span>
          </a>
        );
      })}
      <div className="mt-auto flex flex-col items-center gap-1">
        <a
          href="https://github.com/xoroh/kern"
          title="GitHub"
          className={railButtonClass(false)}
        >
          <GithubIcon className="size-5" />
        </a>
        <button
          type="button"
          onClick={toggle}
          title="Toggle theme"
          aria-label={
            mode === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          className={cn(railButtonClass(false), "cursor-pointer border-0")}
        >
          <ThemeIcon className="size-5" />
        </button>
      </div>
    </nav>
  );
}
