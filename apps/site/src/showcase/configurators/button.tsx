import { Button } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Button configurator — the first flagship (Part 4b).
 *
 * Knobs are the extracted props (`variant`, `size` — see generated
 * props-table) plus `disabled`, which is a native button prop rather than an
 * extracted one and is labelled as such. Non-default positions are the ones
 * emitted into the fence; the stage passes everything explicitly, same values
 * object either way.
 */
type Variant = "elevated" | "primary" | "tonal" | "outlined" | "ghost";
type Size = "sm" | "default" | "icon";

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

function labelOf(v: ConfigValues): string {
  return sizeOf(v) === "icon" ? "+" : "Button";
}

function propsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (variantOf(v) !== "primary") out.push(`variant="${variantOf(v)}"`);
  if (sizeOf(v) !== "default") out.push(`size="${sizeOf(v)}"`);
  if (v.disabled === true) out.push("disabled");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
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
    >
      {labelOf(v)}
    </Button>
  ),
  code: (v) => `<Button${propsOf(v)}>${labelOf(v)}</Button>`,
};
