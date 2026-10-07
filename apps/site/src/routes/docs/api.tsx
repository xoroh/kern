import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { SiteLayout } from "../../components/chrome/site-layout";
import { routeHead } from "../../systems/seo";
import {
  T_BODY,
  T_BODY_MD,
  T_CODE,
  T_LABEL,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../systems/type-scale";

export const Route = createFileRoute("/docs/api")({
  head: () =>
    routeHead(
      "API reference",
      "API reference for the public utility surface.",
    ),
  component: ApiReference,
});

/**
 * API reference for kern's public NON-COMPONENT exports.
 *
 * Why this page exists separately from /components: the component registry is
 * deliberately component-only — it collects PascalCase components and excludes
 * style helpers, constants and lowercase values. That is the right rule for a
 * component gallery. But kern also exports real, public API that is not a
 * component: a pure function, a predicate, two hooks and a factory. All five
 * are reachable from the packages' public entries (each appears in the built
 * `dist/index.d.ts` export list), so they are API a consumer can call.
 *
 * Documenting them as component pages was a category error: a function has no
 * anatomy, no variants and no resting elevation. They belong here instead,
 * documented as what they are — a contract, not an anatomy.
 */

type ApiEntry = {
  name: string;
  kind: "pure function" | "predicate" | "hook" | "factory";
  package: string;
  signature: string;
  oneLiner: string;
  contract: string[];
  notes?: string[];
};

const ENTRIES: ApiEntry[] = [
  {
    name: "pageWindow",
    kind: "pure function",
    package: "@xoroh/kern-native",
    signature: "pageWindow(current: number, count: number): PaginationEntry[]",
    oneLiner:
      "Turns a page count and a current page into the list of page numbers and gaps to show.",
    contract: [
      "`current` — the current page. The window is derived from it on every call, so there is one source of truth for where the reader is.",
      "`count` — total pages. At 7 or fewer every page is returned; above that the list is windowed.",
      'Returns `PaginationEntry[]`, each `{ kind: "page", page }` or `{ kind: "gap", key }`. A gap carries a stable key and NO number — it marks elision and holds no information.',
    ],
    notes: [
      "Exported because it is pure logic, and testing it directly is both cheaper and clearer than asserting it through rendered output.",
      'If you consume the result: a `gap` is decoration and must be hidden from assistive tech. kern\'s own Pagination marks it `accessibilityElementsHidden` with `importantForAccessibility="no-hide-descendants"`.',
    ],
  },
  {
    name: "pressIsCancelled",
    kind: "predicate",
    package: "@xoroh/kern-native",
    signature:
      "pressIsCancelled(event?: { isDefaultPrevented?: () => boolean }): boolean",
    oneLiner:
      "Reports whether a host cancelled a press event. A press the host cancelled should not act.",
    contract: [
      "`event` is optional. An absent or unknown event is treated as NOT cancelled — a press with no event object is a press we have no reason to suppress.",
      "Returns `true` only when `isDefaultPrevented` is a function and it returns `true`. Anything else is `false`.",
    ],
    notes: [
      "Exists as a named export for testability. React Native's Testing Library synthesises press events exposing both `preventDefault()` and `isDefaultPrevented()`, but `isDefaultPrevented()` is a no-op stub that returns `false` even after `preventDefault()` — so `fireEvent.press` cannot reach this branch at all. Asserting the predicate directly is the only honest coverage.",
    ],
  },
  {
    name: "useFieldset",
    kind: "hook",
    package: "@xoroh/kern-native",
    signature: "useFieldset(): FieldsetContextValue | null",
    oneLiner:
      "Reads the enclosing fieldset's context, or null when there is none.",
    contract: [
      "Returns `{ disabled: boolean, legend?: string, setLegend: (text?: string) => void }`, or `null` outside a fieldset.",
      "`null` is not an error. A control used standalone gets `null` and should keep working.",
      "`legend` is the group's accessible name; `setLegend` is what a `FieldsetLegend` calls to name the group.",
    ],
  },
  {
    name: "useFieldsetDisabled",
    kind: "hook",
    package: "@xoroh/kern-native",
    signature: "useFieldsetDisabled(): boolean",
    oneLiner:
      "Reports whether the enclosing fieldset is disabled, and false when there is none.",
    contract: [
      "Returns `true` when an ancestor fieldset is disabled. Returns `false` outside a fieldset, so a standalone control is never accidentally announced as disabled.",
      "THE OR RULE: a control is disabled if it is disabled directly OR any ancestor fieldset is. kern controls OR this result with their own `disabled`/`editable` prop — do the same and you match the web's `<fieldset disabled>` semantics exactly.",
    ],
    notes: [
      "React Native has no fieldset element. This hook is how the native renderer reproduces the web's inherited-disabled semantics, and one place stating the rule is why every control inherits it.",
    ],
  },
  {
    name: "createSonnerManager",
    kind: "factory",
    package: "@xoroh/kern",
    signature: "createSonnerManager(): SonnerApi",
    oneLiner:
      "Creates a toast manager you own, for wiring sonner into your own app shell.",
    contract: [
      "Returns a `SonnerApi`. Pass its `toastManager` to the `SonnerProvider`'s `ToastMount` to mount the manager into the tree.",
      "Use this when the app shell owns the toast instance rather than reaching for the default one.",
    ],
    notes: [
      "Not a component and not in the component registry — the registry collects components on purpose. It is public API and this is where it is documented.",
    ],
  },
];

const KIND_ORDER: Record<ApiEntry["kind"], number> = {
  "pure function": 0,
  predicate: 1,
  hook: 2,
  factory: 3,
};

function ApiReference() {
  const entries = [...ENTRIES].sort(
    (a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind],
  );
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <Kicker className="text-(--md-sys-color-primary)">API reference</Kicker>
        <h1 className={`mt-2 mb-3 ${T_PAGE} text-(--md-sys-color-on-surface)`}>
          Public utilities
        </h1>
        <p className={`mt-0 mb-8 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}>
          kern exports API that is not a component: pure functions, predicates,
          hooks and factories. They are reachable from the packages' public
          entries and are documented here as what they are — a contract, not an
          anatomy. Components live under{" "}
          <a
            className="text-(--md-sys-color-primary) underline underline-offset-2"
            href="/components"
          >
            Components
          </a>
          .
        </p>

        {entries.map((entry) => (
          <section
            key={entry.name}
            className="mb-10 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-6"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2
                id={`api-${entry.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")}`}
                className={`m-0 ${T_SECTION} text-(--md-sys-color-on-surface)`}
              >
                {entry.name}
              </h2>
              <span className={`rounded-full bg-(--md-sys-color-secondary-container) px-2.5 py-0.5 text-(--md-sys-color-on-secondary-container) ${T_LABEL}`}>
                {entry.kind}
              </span>
              <code className={`${T_CODE} text-(--md-sys-color-on-surface-variant)`}>
                {entry.package}
              </code>
            </div>

            <p className={`mt-3 mb-4 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}>
              {entry.oneLiner}
            </p>

            <pre className={`m-0 mb-4 overflow-x-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-high) p-4 ${T_CODE} text-(--md-sys-color-on-surface)`}>
              <code>{entry.signature}</code>
            </pre>

            <h3
              id="api-contract"
              className={`mt-0 mb-2 ${T_SMALL_TITLE} text-(--md-sys-color-on-surface)`}
            >
              Contract
            </h3>
            <ul className={`m-0 mb-0 list-disc space-y-2 pl-5 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
              {entry.contract.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {entry.notes ? (
              <>
                <h3
                  id="api-notes"
                  className={`mt-5 mb-2 ${T_SMALL_TITLE} text-(--md-sys-color-on-surface)`}
                >
                  Notes
                </h3>
                <ul className={`m-0 mb-0 list-disc space-y-2 pl-5 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
                  {entry.notes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
