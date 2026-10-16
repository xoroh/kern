/**
 * Primitives (P domain) per-module examples.
 *
 * Each constant is a standalone snippet `scripts/check-snippets.mjs` compiles
 * against the real `@xoroh/axis` surface — the same bar the
 * getting-started snippets meet. They are named `EXAMPLE_*` (all caps, one
 * per module slug) so that extractor finds them by shape rather than by a
 * hand-kept list.
 *
 * Written as modules (import + declaration), not bare JSX fragments: a
 * fragment would be wrapped in a synthetic root and could not show a hook
 * used inside the component that owns it.
 */
const EXAMPLE_A11Y = `import { createIdScope, resolveDir } from "@xoroh/axis";

const ids = createIdScope("dialog");
const titleId = ids.nextId();
const dir = resolveDir({ defaultDir: "ltr" });

export function DialogLabel({ label }: { label: string }) {
  return (
    <span id={titleId} dir={dir}>
      {label}
    </span>
  );
}
`;

const EXAMPLE_DISMISS_POLICY = `import {
  createDismissPolicy,
  dismissTriggersFor,
} from "@xoroh/axis";

const policy = createDismissPolicy({
  dismissible: true,
  hasDismissHandler: true,
});
const triggers = dismissTriggersFor({ modal: true, hasVisibleClose: true });

const closesOnEscape = policy.shouldDismiss("escape", true, triggers);
`;

const EXAMPLE_DISMISS_WIRING = `import {
  dismissBranchesFor,
  shouldDismissOn,
} from "@xoroh/axis";

const branches = dismissBranchesFor({
  modal: true,
  dismissible: true,
  hasVisibleClose: true,
});

const closes = shouldDismissOn("escape", true, branches);
`;

const EXAMPLE_FOCUS_TRAP = `import {
  nextTrapIndex,
  resolveAutofocus,
} from "@xoroh/axis";

const event = resolveAutofocus(3, 1);
const next = nextTrapIndex(1, 3, "next", true);

if (event.type === "focus-stop") {
  // Focus stops[event.index] in the renderer's own node list.
}
`;

const EXAMPLE_OVERLAY_MODALITY = `import {
  createOverlayModality,
  useOverlayModality,
  useOverlayRegistration,
} from "@xoroh/axis";

const registry = createOverlayModality();

export function Dialog({ id }: { id: string }) {
  useOverlayRegistration(registry, id);
  const state = useOverlayModality(registry);
  return state.isTop(id) ? <div role="dialog" /> : null;
}
`;

const EXAMPLE_PORTAL = `import {
  createPortalRegistry,
  resolvePortalTarget,
} from "@xoroh/axis";

const portals = createPortalRegistry();
portals.mount("menu-1");
const order = portals.order();
const target = resolvePortalTarget({ defaultTarget: "app-overlays" });
`;

const EXAMPLE_POSITIONING = `import { resolveFloatingRect } from "@xoroh/axis";

const rect = resolveFloatingRect(
  { x: 120, y: 40, width: 96, height: 32 },
  { width: 220, height: 160 },
  {
    placement: "bottom",
    offset: 8,
    viewport: { width: 1024, height: 768 },
    viewportPadding: 8,
  },
);
`;

const EXAMPLE_PRESENCE = `import { usePresence } from "@xoroh/axis";

export function Fade({ open }: { open: boolean }) {
  const { present, state, finishExit } = usePresence(open);
  if (!present) return null;
  return (
    <div
      data-state={state}
      onTransitionEnd={() => {
        if (state === "exiting") finishExit();
      }}
    />
  );
}
`;

const EXAMPLE_PRESS = `import { usePress } from "@xoroh/axis";

export function SaveButton() {
  const press = usePress({ onPress: save });
  return (
    <button
      type="button"
      data-pressed={press.pressed}
      onPointerDown={press.begin}
      onPointerUp={press.end}
      onPointerCancel={press.cancel}
    >
      Save
    </button>
  );
}
`;

const EXAMPLE_ROVING = `import { useRovingModel } from "@xoroh/axis";

export function Toolbar({ items }: { items: string[] }) {
  const roving = useRovingModel({
    count: items.length,
    orientation: "horizontal",
    loop: true,
  });
  return (
    <div role="toolbar">
      {items.map((item, i) => (
        <button
          key={item}
          type="button"
          tabIndex={roving.activeIndex === i ? 0 : -1}
          onClick={() => roving.setActive(i)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
`;

const EXAMPLE_SELECTION = `import { isSelected, useSelection } from "@xoroh/axis";

export function RowPicker() {
  const [selected, toggle] = useSelection<string>({
    mode: "multiple",
    defaultValue: [],
  });
  return (
    <button
      type="button"
      aria-pressed={isSelected(selected, "row-1")}
      onClick={() => toggle("row-1")}
    >
      Row 1
    </button>
  );
}
`;

const EXAMPLE_SLOT = `import {
  composeEventHandlers,
  mergeSlotProps,
} from "@xoroh/axis";

function open(): void {}
function track(): void {}

const merged = mergeSlotProps(
  { onClick: open, className: "trigger" },
  { onClick: track, className: "consumer" },
);

const onClick = composeEventHandlers(open, track);
`;

const EXAMPLE_TIME = `import {
  formatTimeValue,
  minutesForStep,
  normalizeTimeValue,
} from "@xoroh/axis";

const marks = minutesForStep(15);
const value = normalizeTimeValue({ hours: 15, minutes: 45 }, 15);
const shown = formatTimeValue(value, "12h");
`;

const EXAMPLE_USE_CONTROLLABLE_STATE = `import { useControllableState } from "@xoroh/axis";

export function Disclosure({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean) => void;
}) {
  const [isOpen, setOpen] = useControllableState(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  return (
    <button type="button" onClick={() => setOpen((prev: boolean | undefined) => !prev)}>
      {isOpen ? "Hide" : "Show"}
    </button>
  );
}
`;

/** One compilable example per module slug. */
export const PRIMITIVE_EXAMPLES: Record<string, string> = {
  a11y: EXAMPLE_A11Y,
  "dismiss-policy": EXAMPLE_DISMISS_POLICY,
  "dismiss-wiring": EXAMPLE_DISMISS_WIRING,
  "focus-trap": EXAMPLE_FOCUS_TRAP,
  "overlay-modality": EXAMPLE_OVERLAY_MODALITY,
  portal: EXAMPLE_PORTAL,
  positioning: EXAMPLE_POSITIONING,
  presence: EXAMPLE_PRESENCE,
  press: EXAMPLE_PRESS,
  roving: EXAMPLE_ROVING,
  selection: EXAMPLE_SELECTION,
  slot: EXAMPLE_SLOT,
  time: EXAMPLE_TIME,
  "use-controllable-state": EXAMPLE_USE_CONTROLLABLE_STATE,
};
