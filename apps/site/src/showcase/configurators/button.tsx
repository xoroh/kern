import { Button } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Button configurator — the first flagship (Part 4b).
 *
 * Knobs are the extracted props (`variant`, `size` — see generated
 * props-table) plus `disabled`, which is a native button prop rather than an
 * extracted one and is labelled as such. Non-default positions are the ones
 * emitted into the fence; the stage passes everything explicitly, same values
 * object either way.
 *
 * `size="icon"` is square and carries an icon plus an `aria-label`, never a
 * text label (the page's own API note) — stage and fence emit the real
 * `<Icon>` together, so the fence cannot teach the bug it documents.
 */
type Variant = "elevated" | "primary" | "tonal" | "outlined" | "ghost";
type Size = "sm" | "default" | "icon";

/** The accessible name carried by the icon-size button, stage and fence alike. */
const ICON_LABEL = "Add";

function variantOf(v: ConfigValues): Variant {
  const s = String(v.variant);
  return (
    ["elevated", "primary", "tonal", "outlined", "ghost"] as const
  ).includes(s as Variant)
    ? (s as Variant)
    : "primary";
}

function sizeOf(v: ConfigValues): Size {
  const s = String(v.size);
  return (["sm", "default", "icon"] as const).includes(s as Size)
    ? (s as Size)
    : "default";
}

function isIcon(v: ConfigValues): boolean {
  return sizeOf(v) === "icon";
}

function propsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (variantOf(v) !== "primary") out.push(`variant="${variantOf(v)}"`);
  if (sizeOf(v) !== "default") out.push(`size="${sizeOf(v)}"`);
  if (isIcon(v)) out.push(`aria-label="${ICON_LABEL}"`);
  if (v.disabled === true) out.push("disabled");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

function childrenOf(v: ConfigValues): string {
  return isIcon(v) ? `<Icon name="add" />` : "Button";
}

export const BUTTON_CONFIGURATOR: ConfiguratorSpec = {
  id: "button-knobs",
  title: "Configure the button",
  description:
    "Turn the extracted props and see the source change with them. Disabled is a native button prop, not a variant — the library has no destructive variant on purpose.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["elevated", "primary", "tonal", "outlined", "ghost"],
      default: "primary",
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["sm", "default", "icon"],
      default: "default",
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled (native prop)",
      default: false,
    },
  ],
  render: (v) => (
    <Button
      variant={variantOf(v)}
      size={sizeOf(v)}
      disabled={v.disabled === true}
      aria-label={isIcon(v) ? ICON_LABEL : undefined}
    >
      {isIcon(v) ? <Icon name="add" /> : "Button"}
    </Button>
  ),
  code: (v) => `<Button${propsOf(v)}>${childrenOf(v)}</Button>`,
};
