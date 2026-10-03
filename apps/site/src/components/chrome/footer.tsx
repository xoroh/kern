import { REPO_LICENSE } from "../../generated/changelog";
import { VersionSelector } from "./version-selector";

export function Footer() {
  return (
    <footer className="mt-3 border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface)">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm sm:px-8">
        <p className="m-0 flex items-center gap-3 text-(--md-sys-color-on-surface-variant)">
          Kern by Xoroh · {REPO_LICENSE} License
          <VersionSelector />
        </p>
        <nav className="flex flex-wrap gap-5" aria-label="Footer">
          <a
            href="/getting-started"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            Getting started
          </a>
          <a
            href="/components"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            Components
          </a>
          <a
            href="/changelog"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            Changelog
          </a>
          <a
            href="/community"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            Community
          </a>
          <a
            href="/about"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            About
          </a>
          <a
            href="/legal/license"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            Licence
          </a>
          <a
            href="/legal/security"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            Security
          </a>
          <a
            href="https://github.com/xoroh/kern"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            GitHub
          </a>
          <a
            href="https://xoroh.org"
            className="text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)"
          >
            xoroh.org
          </a>
        </nav>
      </div>
    </footer>
  );
}
