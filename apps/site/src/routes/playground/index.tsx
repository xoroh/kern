/**
 * /playground — the interactive Playground: full-screen design system workbench.
 *
 * Full-bleed 3-section workbench layout:
 * - Edge-to-edge layout with pane-level scrolling.
 * - Live preview across Ops Dashboard, Composed Blocks, Component Matrix,
 *   Tonal Palettes, and Code.
 * - System-agnostic: supports M3, Astryx, and shadcn design systems.
 * - State lives in React state with instant feedback, synced to URL and localStorage.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Playground as PlaygroundWorkbench } from "../../domains/playground/playground";
import {
  loadPlaygroundState,
  PLAYGROUND_DEFAULTS,
  type PlaygroundState,
  playgroundSearchToState,
  savePlaygroundState,
  stateToPlaygroundSearch,
} from "../../domains/playground/playground-state";
import { routeHead } from "../../domains/shared/systems/seo";

const PLAYGROUND_KEYS = [
  "system",
  "seed",
  "preset",
  "dark",
  "contrast",
  "radius",
  "font",
  "density",
] as const;

export const Route = createFileRoute("/playground/")({
  validateSearch: (search: Record<string, unknown>): Record<string, string> => {
    const raw: Record<string, string> = {};
    for (const key of PLAYGROUND_KEYS) {
      const value = search[key];
      if (value === undefined || value === null) continue;
      raw[key] = String(value);
    }
    return raw;
  },
  head: () =>
    routeHead(
      "Playground",
      "Interactive Multi-System Playground & Workbench — preview and tune Material Design 3, Astryx, and shadcn themes with dynamic tokens, composed blocks, and component matrix with instant multi-format code export.",
    ),
  component: PlaygroundRoute,
});

function PlaygroundRoute() {
  const raw = Route.useSearch();
  const navigate = Route.useNavigate();
  const specified = Object.keys(raw).length > 0;

  useEffect(() => {
    if (specified) return;
    const stored = loadPlaygroundState();
    if (
      JSON.stringify(stateToPlaygroundSearch(stored)) !==
      JSON.stringify(stateToPlaygroundSearch(PLAYGROUND_DEFAULTS))
    ) {
      navigate({
        to: "/playground",
        search: stateToPlaygroundSearch(stored),
        replace: true,
      });
    }
  }, [specified, navigate]);

  const state = playgroundSearchToState(raw);

  function onChange(next: PlaygroundState) {
    savePlaygroundState(next);
    navigate({
      to: "/playground",
      search: stateToPlaygroundSearch(next),
      replace: true,
    });
  }

  return (
    <div className="flex h-dvh w-screen min-h-0 overflow-hidden select-none">
      <PlaygroundWorkbench state={state} onChange={onChange} />
    </div>
  );
}
