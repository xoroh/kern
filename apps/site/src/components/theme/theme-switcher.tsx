/**
 * Theme switcher — real code against `@xoroh/kern-theme`.
 *
 * The variant list and the hue count both come from the theme package's own
 * registries (`listVariants`, `listHues`), not from a list copied into the
 * site. Registering a variant upstream makes it appear here with no site edit.
 */
import { Button, useKernTheme } from "@xoroh/kern";
import { listHues, listVariants } from "@xoroh/kern-theme";
import { useId } from "react";

const MODES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const;

export function ThemeSwitcher() {
  const { mode, setMode, useSystem, preference, contrast, variant } =
    useKernTheme();
  const groupId = useId();

  const variants = listVariants();
  const hueCount = listHues().length;

  return (
    <div
      className="flex flex-col gap-3 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-4"
      role="group"
      aria-labelledby={groupId}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span id={groupId} className="text-sm font-medium">
          Appearance
        </span>
        <span className="font-mono text-xs text-(--md-sys-color-on-surface-variant)">
          {mode} · {contrast} ·{" "}
          {typeof variant === "string" ? variant : variant.id}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {MODES.map((entry) => (
          <Button
            key={entry.id}
            size="sm"
            variant={preference === entry.id ? "primary" : "tonal"}
            aria-pressed={preference === entry.id}
            onClick={() =>
              entry.id === "system" ? useSystem() : setMode(entry.id)
            }
          >
            {entry.label}
          </Button>
        ))}
      </div>

      <dl className="grid grid-cols-1 gap-1 text-xs text-(--md-sys-color-on-surface-variant) sm:grid-cols-2">
        <dt className="font-medium">Shipped variants</dt>
        <dd className="m-0 font-mono">
          {variants.map((entry) => entry.id).join(", ")}
        </dd>
        <dt className="font-medium">Registered hues</dt>
        <dd className="m-0 font-mono">{hueCount} in the spectrum</dd>
      </dl>
    </div>
  );
}
