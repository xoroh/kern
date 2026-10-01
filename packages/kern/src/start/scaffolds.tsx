import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";

export const APP_SHELL_HEIGHTS = {
  topBar: 56,
  statusBar: 32,
} as const;

/**
 * App frame with optional region slots. Omitting regions yields every shell
 * shape (docs shell, rail-only tool, full multi-region app) — recipes live in
 * the README, not in forked components.
 */
export function AppShell({
  topBar,
  rail,
  drawer,
  statusBar,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div"> & {
  topBar?: ReactNode;
  rail?: ReactNode;
  drawer?: ReactNode;
  statusBar?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      data-slot="app-shell"
      className={cn(
        "kern-app-shell flex h-dvh flex-col bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      {topBar ? <div data-slot="app-shell-top-bar">{topBar}</div> : null}
      <div className="flex min-h-0 flex-1">
        {rail ? <div data-slot="app-shell-rail">{rail}</div> : null}
        {drawer ? <div data-slot="app-shell-drawer">{drawer}</div> : null}
        <main
          id="main"
          data-slot="app-shell-content"
          className="flex min-w-0 flex-1 flex-col overflow-auto"
        >
          {children}
        </main>
      </div>
      {statusBar ? (
        <div data-slot="app-shell-status-bar">{statusBar}</div>
      ) : null}
    </div>
  );
}

/**
 * SSR document shell. Head/scripts arrive as slots so the host app wires its
 * own framework pieces without a hard dependency.
 */
export function Document({
  head,
  scripts,
  htmlProps,
  bodyProps,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"html"> & {
  head?: ReactNode;
  scripts?: ReactNode;
  htmlProps?: ComponentPropsWithRef<"html">;
  bodyProps?: ComponentPropsWithRef<"body">;
}) {
  return (
    <html lang="en" {...htmlProps} {...props}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {head}
      </head>
      <body
        className={cn(
          "kern-document m-0 bg-(--md-sys-color-surface-container) font-(--kern-font-family) text-(--md-sys-color-on-surface)",
          className,
        )}
        {...bodyProps}
      >
        {children}
        {scripts}
      </body>
    </html>
  );
}
