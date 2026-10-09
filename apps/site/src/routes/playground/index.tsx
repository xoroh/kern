/**
 * /playground — the Playground: one customizer app (the theme studio).
 *
 * WHAT THIS IS: the destination the hub used to be a door to. The theme
 * studio (knobs → live gallery → export) IS the page; the per-family
 * configurator panels live inside it (Component knobs), so all
 * customisation happens in one app. Search stays a separate global surface
 * (/search, ⌘K) — embedded here as a link, never owned by it.
 *
 * STATE: the five knobs are the URL (`studio-state`), validated by
 * `validateSearch` below so SSR and client paint the same theme. When the
 * URL carries no studio key at all, localStorage fills in (a refresh keeps
 * the knobs); when it carries any, the URL wins whole — a shared link
 * reopens the sender's exact theme and never mixes with the receiver's
 * storage. `navigate` always passes a FRESH search object (never the
 * `(prev) =>` updater) so validated extras cannot leak into the query.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ThemeStudio } from "../../domains/playground/studio";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_PAGE,
} from "../../domains/shared/systems/type-scale";
import {
  loadStudioState,
  STUDIO_DEFAULTS,
  type StudioState,
  saveStudioState,
  stateToStudioSearch,
  studioSearchToState,
} from "../../theme-studio/studio-state";

const STUDIO_KEYS = ["seed", "preset", "dark", "contrast", "radius"] as const;

export const Route = createFileRoute("/playground/")({
  // The validated search IS the raw string-param map (`studio-state`'s own
  // input shape): navigate can then pass `stateToStudioSearch(next)` directly
  // — defaults omitted — and the type is that same map. `Object.keys(raw)`
  // being empty is exactly "the URL carries no studio key".
  validateSearch: (search: Record<string, unknown>): Record<string, string> => {
    const raw: Record<string, string> = {};
    for (const key of STUDIO_KEYS) {
      const value = search[key];
      if (value === undefined || value === null) continue;
      raw[key] = String(value);
    }
    return raw;
  },
  head: () =>
    routeHead(
      "Playground",
      "One customizer app — theme knobs, a live component gallery, and the export, all sharing one resolved object.",
    ),
  component: Playground,
});

function Playground() {
  const raw = Route.useSearch();
  const navigate = Route.useNavigate();
  const specified = Object.keys(raw).length > 0;
  const state = studioSearchToState(raw);

  // URL clean (no studio key): fill from localStorage so a refresh keeps the
  // knobs. Any studio key in the URL wins whole — see the file header.
  useEffect(() => {
    if (specified) return;
    const stored = loadStudioState();
    if (
      JSON.stringify(stateToStudioSearch(stored)) !==
      JSON.stringify(stateToStudioSearch(STUDIO_DEFAULTS))
    ) {
      navigate({
        to: "/playground",
        search: stateToStudioSearch(stored),
        replace: true,
      });
    }
  }, [specified, navigate]);

  function onChange(next: StudioState) {
    saveStudioState(next);
    navigate({
      to: "/playground",
      search: stateToStudioSearch(next),
      replace: true,
    });
  }

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-12">
          <header className="flex flex-col gap-3">
            <p
              className={`m-0 text-(--md-sys-color-on-surface-variant) uppercase`}
            >
              Playground
            </p>
            <h1 className={`m-0 ${T_PAGE} text-(--md-sys-color-on-surface)`}>
              Theme studio
            </h1>
            <p
              className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
            >
              Tune the theme in the sidebar — the preview and the export update
              together. Every knob lives in the URL, so a refresh keeps your
              theme and a shared link reopens the exact one you see.
            </p>
            <details>
              <summary
                className={`cursor-pointer ${T_BODY_SM} text-(--md-sys-color-on-surface)`}
              >
                How this studio works
              </summary>
              <p
                className={`m-0 max-w-[62ch] ${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
              >
                Everything right of this sentence reads CSS vars — the preview
                is the tokens. Copy the preset source and it resolves to exactly
                what you see: snippet and stage share one object. The seed
                recomputes the primary family only; secondary, tertiary, error
                and surface stay on the preset. Contrast is argued from the
                mapping, not printed — the ratio function is not in the
                package&apos;s public API.
              </p>
            </details>
            <p
              className={`m-0 ${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
            >
              Every registry from one box lives in{" "}
              <Link
                to="/search"
                search={{ q: "" }}
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                search
              </Link>{" "}
              (⌘K anywhere) — a global surface, not owned by this app.
            </p>
          </header>
          <ThemeStudio state={state} onChange={onChange} />
        </div>
      </section>
    </SiteLayout>
  );
}
