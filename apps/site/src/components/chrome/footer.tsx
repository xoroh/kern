import { REPO_LICENSE } from "../../generated/changelog";

export function Footer() {
  return (
    <footer className="mt-3 border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface)">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm sm:px-8">
        <p className="m-0 text-(--md-sys-color-on-surface-variant)">
          Kern by Xoroh · {REPO_LICENSE} License
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
