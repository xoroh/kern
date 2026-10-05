import { Button, createSnackbarManager, Snackbar } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Snackbar configurator — the twenty-first Part-4 configurator (move #23),
 * second imperative surface past Sonner (move #9) and deliberately its
 * plainer sibling: no intent axis (a snackbar is a neutral confirmation —
 * if the tone matters, that is Sonner), so the knobs are the message axes
 * the doc leaves open: `description` (supporting line or not) and `action`
 * (the edge composition, carried from the move-5 Group lesson). No
 * `variant`/`tone`/`intent`, no `position` on the surface, no `duration` on
 * the component, no `elevation` — all ruled out, so none is a knob.
 *
 * Same stage contract as Sonner: the manager is module-scoped (render is a
 * plain function — hooks illegal — and a per-call manager would drop pushed
 * toasts on every knob flip), pushes are sticky (`timeout: 0`, mirrored in
 * the fence) so the painted state holds. The knobs describe the NEXT push.
 */
const manager = createSnackbarManager();

function descriptionOf(v: ConfigValues): boolean {
  return v.description !== false;
}

function actionOf(v: ConfigValues): boolean {
  return v.action === true;
}

function pushArgsOf(v: ConfigValues): string {
  const lines = ['  title: "Saved",'];
  if (descriptionOf(v)) lines.push('  description: "Your changes are live.",');
  if (actionOf(v))
    lines.push('  actionProps: { children: "Undo", onClick: () => {} },');
  lines.push("  timeout: 0,");
  return lines.join("\n");
}

function push(v: ConfigValues) {
  manager.add({
    title: "Saved",
    ...(descriptionOf(v) ? { description: "Your changes are live." } : {}),
    ...(actionOf(v)
      ? { actionProps: { children: "Undo", onClick: () => {} } }
      : {}),
    timeout: 0,
  });
}

export const SNACKBAR_CONFIGURATOR: ConfiguratorSpec = {
  id: "snackbar-knobs",
  title: "Configure the snackbar",
  description:
    "Description, action — then push. The provider and viewport are part of the pattern, not knobs; the knobs describe the next push (the stage manager is shared, so flipping knobs never clears a live toast, and a pushed toast keeps the knobs it was pushed with). Stage pushes are sticky so the painted state holds still. For tone, reach for Sonner instead.",
  controls: [
    {
      kind: "boolean",
      name: "description",
      label: "Description",
      default: true,
    },
    {
      kind: "boolean",
      name: "action",
      label: "Action",
      default: false,
    },
  ],
  render: (v) => (
    <Snackbar.Provider
      key={`${descriptionOf(v) ? "desc" : "bare"}-${actionOf(v) ? "act" : "noact"}`}
      toastManager={manager}
    >
      <Snackbar.Viewport>
        <Snackbar.List />
      </Snackbar.Viewport>
      <div className="mt-4">
        <Button variant="tonal" onClick={() => push(v)}>
          Push snackbar
        </Button>
      </div>
    </Snackbar.Provider>
  ),
  code: (v) =>
    `const manager = createSnackbarManager();\n\n<Snackbar.Provider toastManager={manager}>\n  <Snackbar.Viewport>\n    <Snackbar.List />\n  </Snackbar.Viewport>\n</Snackbar.Provider>\n\nmanager.add({\n${pushArgsOf(v)}\n});`,
};
