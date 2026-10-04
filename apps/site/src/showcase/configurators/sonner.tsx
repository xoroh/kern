import { Button, createSonnerManager, Sonner } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Sonner configurator — the ninth Part-4 configurator (move #9), first
 * imperative surface (a manager push, not declarative children). Knobs are
 * the message axes the component doc leaves open: `intent` (the whole reason
 * to reach for sonner over a snackbar — info/success/warning/error), whether
 * the push carries a `description`, and whether it carries an `action` (the
 * edge composition, carried from the move-5 Group lesson). No `variant`
 * alongside intent, no `position` on the surface, no `dismissible` — all
 * ruled out, so none is a knob.
 *
 * Two deliberate stage choices. First, the manager is module-scoped, not
 * per-render: `render` is a plain function (the harness calls it as
 * `{spec.render(values)}`, so hooks are illegal), and a manager created
 * inside the call would drop every pushed toast on the next knob flip.
 * Second, stage pushes are sticky (`timeout: 0`) so the painted state holds
 * still for verification — the fence shows the same field, so the two cannot
 * drift. The knobs describe the NEXT push: pushing, then flipping knobs, does
 * not rewrite the live toast, by design.
 */
const manager = createSonnerManager();

function intentOf(v: ConfigValues): "info" | "success" | "warning" | "error" {
  return v.intent === "success" ||
    v.intent === "warning" ||
    v.intent === "error"
    ? v.intent
    : "info";
}

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
    lines.push('  action: { label: "Undo", onClick: () => {} },');
  lines.push("  timeout: 0,");
  return lines.join("\n");
}

function push(v: ConfigValues) {
  manager[intentOf(v)]({
    title: "Saved",
    ...(descriptionOf(v) ? { description: "Your changes are live." } : {}),
    ...(actionOf(v) ? { action: { label: "Undo", onClick: () => {} } } : {}),
    timeout: 0,
  });
}

export const SONNER_CONFIGURATOR: ConfiguratorSpec = {
  id: "sonner-knobs",
  title: "Configure the toast",
  description:
    "Intent, description, action — then push. The provider and viewport are part of the pattern, not knobs; the knobs describe the next push (the stage manager is shared, so flipping knobs never clears a live toast, and a pushed toast keeps the knobs it was pushed with). Stage pushes are sticky so the painted state holds still.",
  controls: [
    {
      kind: "select",
      name: "intent",
      label: "Intent",
      options: ["info", "success", "warning", "error"],
      default: "success",
    },
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
    <Sonner.Provider
      key={`${intentOf(v)}-${descriptionOf(v) ? "desc" : "bare"}-${actionOf(v) ? "act" : "noact"}`}
      toastManager={manager.toastManager}
    >
      <Sonner.Viewport>
        <Sonner.List />
      </Sonner.Viewport>
      <div className="mt-4">
        <Button variant="tonal" onClick={() => push(v)}>
          Push {intentOf(v)} toast
        </Button>
      </div>
    </Sonner.Provider>
  ),
  code: (v) =>
    `const manager = createSonnerManager();\n\n<Sonner.Provider toastManager={manager.toastManager}>\n  <Sonner.Viewport>\n    <Sonner.List />\n  </Sonner.Viewport>\n</Sonner.Provider>\n\nmanager.${intentOf(v)}({\n${pushArgsOf(v)}\n});`,
};
