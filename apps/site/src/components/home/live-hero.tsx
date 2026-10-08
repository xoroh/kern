/**
 * Live hero panel — real kern components a visitor can touch, not a picture of
 * them.
 *
 * The hero's right half was a static SVG with count chips. Counts are claims;
 * a working Switch is proof. So the panel renders the actual shipped
 * components — Button, Switch, filter Chips, and the theme toggle — against
 * the live theme, and every interaction is the component's own behaviour.
 *
 * Nothing here is staged: the click counter is local state, the switch is the
 * shipped Base UI-backed Switch, and the theme toggle is the same
 * `useKernTheme` the header theme toggle uses. If a component regresses, this panel shows it.
 */
import { Button, Chip, Switch, useKernTheme } from "@xoroh/kern";
import { useState } from "react";

const PANEL =
  "flex flex-col gap-5 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-10";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-medium text-(--md-sys-color-on-surface-variant)">
        {label}
      </span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

export function LiveHero() {
  const { mode, toggle } = useKernTheme();
  const [pressed, setPressed] = useState(0);
  const [on, setOn] = useState(true);
  const [picked, setPicked] = useState<string[]>(["Buttons"]);
  const togglePicked = (label: string) =>
    setPicked((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label],
    );

  return (
    <section className={PANEL} aria-label="Try kern components live">
      <Row label="Theme">
        <Button variant="tonal" onClick={toggle}>
          {mode === "light" ? "Dark" : "Light"}
        </Button>
      </Row>
      <Row label="Button">
        <Button onClick={() => setPressed((n) => n + 1)}>
          Pressed {pressed}×
        </Button>
      </Row>
      <Row label="Switch">
        <Switch checked={on} onCheckedChange={setOn} aria-label="Demo switch" />
      </Row>
      <Row label="Chips">
        {["Buttons", "Tokens", "Native"].map((label) => (
          <Chip
            key={label}
            variant="filter"
            selected={picked.includes(label)}
            onSelectedChange={() => togglePicked(label)}
          >
            {label}
          </Chip>
        ))}
      </Row>
      <p className="m-0 border-t border-(--md-sys-color-outline-variant) pt-4 text-sm text-(--md-sys-color-on-surface-variant)">
        {picked.length === 0
          ? "Nothing selected — the chips above are real filter chips."
          : `Filtering by ${picked.join(", ")} — above everything ${on ? "enabled" : "at rest"}.`}
      </p>
    </section>
  );
}
