import { defineConfig, devices } from "@playwright/test";

/**
 * kern e2e layer (qa) — the minimal Playwright layer for kern-lead's
 * Improvement #2 in `.team/reports/kern-lead-0020.md`: "Even three Playwright
 * specs — dialog focus trap, sheet dismissal, one page render — would replace
 * 'no evidence' with 'some evidence'."
 *
 * HOME (proposed, not inherited — see `.team/reports/qa-kern-e2e.md` §2).
 * `kern/` had NO Playwright at all: no dependency, no config, no spec file, no
 * `e2e` script. So there was no convention to follow and I did not want to guess
 * one silently. Repo-root `e2e/` is kept because `scripts/` is exclusively
 * `check:*` gates (and `check:workflow` FAILS any `scripts/check-*.mjs` that no
 * package.json script runs — so an e2e helper there would trip a live gate), and
 * because the specs span the site app rather than belonging to one package.
 *
 * WIRED 2026-10-07 (P0-e2e): `bun run test:e2e` at the repo root runs this
 * config, `@playwright/test` is a root devDependency, and the `e2e` CI job
 * builds the site, serves it on :4173, and runs the specs in chromium. The
 * paragraph below is the history of why the wiring looks this way.
 *
 * The site must already be served. Prefer `vite preview` over `vite dev`: with
 * HMR the dev server plus a browser context per test exhausted renderer memory
 * on this machine and four tests died with `Page crashed` — a flake in the
 * harness, not in kern. `preview` serves the built site, which is also what CI
 * would do. Boot it with:
 *   bun run --cwd apps/site build && bun run --cwd apps/site preview
 *
 * 4173 is vite preview's own default port. Do NOT let the port float: vite
 * silently takes the next free port when 4173 is busy, and a spec run that
 * points at a hardcoded stale port fails with a connection error rather than a
 * real result. Override with KERN_E2E_BASE_URL when the port differs.
 */
const BASE_URL = process.env.KERN_E2E_BASE_URL ?? "http://localhost:4173";

export default defineConfig({
  testDir: ".",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1400, height: 1000 },
      },
    },
  ],
});
