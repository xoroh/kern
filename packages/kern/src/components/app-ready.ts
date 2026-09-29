import {
  BRAND_TRIO,
  type FeedbackShapeKind,
  feedbackTiming,
} from "@xoroh/kern-theme";
import { useEffect, useSyncExternalStore } from "react";

const GLYPHS: Record<FeedbackShapeKind, string> = {
  triangle:
    '<svg viewBox="0 0 24 24"><polygon points="12,3 22,21 2,21"/></svg>',
  circle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
  square:
    '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
  pill: '<svg viewBox="0 0 24 24"><rect x="1" y="7" width="22" height="10" rx="5"/></svg>',
  diamond:
    '<svg viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12"/></svg>',
  arch: '<svg viewBox="0 0 24 24"><path d="M5 21v-9a7 7 0 0 1 14 0v9z"/></svg>',
};

function criticalShapes(): string {
  return BRAND_TRIO.map((kind, index) => {
    const delay = -(BRAND_TRIO.length - 1 - index) * feedbackTiming.staggerMs;
    return `  <div class="kern-loading-shape" aria-hidden="true" style="animation-delay: ${delay}ms">${GLYPHS[kind]}</div>`;
  }).join("\n");
}

const [easingX1, easingY1, easingX2, easingY2] = feedbackTiming.easing;
const criticalEasing = `cubic-bezier(${easingX1}, ${easingY1}, ${easingX2}, ${easingY2})`;

/** Self-contained boot CSS — inline into the document head. */
export const CRITICAL_LOADER_CSS = `
#kern-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--md-sys-color-surface, Canvas);
  color: var(--md-sys-color-on-surface, CanvasText);
  z-index: 9999;
  transition: opacity ${feedbackTiming.fadeMs}ms ease;
}

html[data-app-ready] #kern-loading {
  opacity: 0;
  pointer-events: none;
}

#kern-loading .kern-loading-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
}

#kern-loading .kern-loading-shape {
  width: 1.5rem;
  height: 1.5rem;
  animation: kern-loader-shape ${feedbackTiming.cycleMs}ms ${criticalEasing} infinite;
}

#kern-loading .kern-loading-shape svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
}

@keyframes kern-loader-shape {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-${feedbackTiming.hopDp}px) scale(1.05); }
}
`.trim();

/** Self-contained boot markup — inline into the document body. */
export const CRITICAL_LOADER_HTML = `
<div id="kern-loading">
  <div class="kern-loading-row" role="status" aria-label="Loading">
${criticalShapes()}
  </div>
</div>
`.trim();

let appReady = false;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function readAppReady(): boolean {
  return appReady;
}

/**
 * Imperatively mark the app ready: sets `data-app-ready` on `<html>` (the
 * inlined critical loader fades out) and notifies `useAppReady` readers.
 * Idempotent — safe in error boundaries and one-off async gates.
 */
export function markAppReady(): void {
  if (appReady) return;
  appReady = true;
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-app-ready", "");
  }
  for (const listener of listeners) listener();
}

/**
 * Readiness handoff. With no argument it returns the module-level
 * readiness state (re-rendering when `markAppReady` runs). Pass `true`
 * once critical bootstrapping is done to mark the app ready — the
 * pre-JS shell and any mounted BootIndicator can then be hidden.
 */
export function useAppReady(ready?: boolean): boolean {
  useEffect(() => {
    if (ready) markAppReady();
  }, [ready]);
  return useSyncExternalStore(subscribe, readAppReady, readAppReady);
}
