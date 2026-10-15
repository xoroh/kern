import { Button } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Button configurator — the full M3 matrix.
 *
 * Every axis the Button owns: all five variants (elevated/primary/tonal/
 * outlined/ghost), all five sizes (xs/default/sm/xl/icon), both colors,
 * all three shapes, plus block, loading, and disabled. Non-default positions
 * are the ones emitted into the fence; the stage passes everything
 * explicitly, same values object either way.
 *
 * `size="icon"` is square and carries an icon plus an `aria-label`, never a
 * text label (the page's own API note) — stage and fence emit the real
 * `<Icon>` together, so the fence cannot teach the bug it documents.
 */
type Variant = "elevated" | "primary" | "tonal" | "outlined" | "ghost";
type Size = "xs" | "default" | "sm" | "md" | "xl" | "lg" | "icon";
type Color = "primary" | "danger";
type Shape = "pill" | "rounded" | "square";

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
  return (
    ["xs", "default", "sm", "md", "xl", "lg", "icon"] as const
  ).includes(s as Size)
    ? (s as Size)
    : "default";
}

function colorOf(v: ConfigValues): Color {
  return String(v.color) === "danger" ? "danger" : "primary";
}

function shapeOf(v: ConfigValues): Shape {
  const s = String(v.shape);
  return (["pill", "rounded", "square"] as const).includes(s as Shape)
    ? (s as Shape)
    : "pill";
}

function isIcon(v: ConfigValues): boolean {
  return sizeOf(v) === "icon";
}

function propsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (variantOf(v) !== "primary") out.push(`variant="${variantOf(v)}"`);
  if (sizeOf(v) !== "default") out.push(`size="${sizeOf(v)}"`);
  if (colorOf(v) !== "primary") out.push(`color="${colorOf(v)}"`);
  if (shapeOf(v) !== "pill") out.push(`shape="${shapeOf(v)}"`);
  if (isIcon(v)) out.push(`aria-label="${ICON_LABEL}"`);
  if (v.block === true && !isIcon(v)) out.push("block");
  if (v.loading === true) out.push("loading");
  if (v.disabled === true) out.push("disabled");
  if (v.toggle === true) out.push("toggle");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

function childrenOf(v: ConfigValues): string {
  return isIcon(v) ? `<Icon name="add" />` : "Button";
}

export const BUTTON_CONFIGURATOR: ConfiguratorSpec = {
  id: "button-knobs",
  title: "Configure the button",
  description:
    "Every axis: five variants, seven sizes, two colors, three shapes, plus toggle. Disabled is a native button prop, not a variant — the library has no destructive variant on purpose.",
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
      options: ["xs", "default", "sm", "md", "xl", "lg", "icon"],
      default: "default",
    },
    {
      kind: "select",
      name: "color",
      label: "Color",
      options: ["primary", "danger"],
      default: "primary",
    },
    {
      kind: "select",
      name: "shape",
      label: "Shape",
      options: ["pill", "rounded", "square"],
      default: "pill",
    },
    {
      kind: "boolean",
      name: "block",
      label: "Block (full width)",
      default: false,
    },
    {
      kind: "boolean",
      name: "loading",
      label: "Loading",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled (native prop)",
      default: false,
    },
    {
      kind: "boolean",
      name: "toggle",
      label: "Toggle (selection)",
      default: false,
    },
  ],
  render: (v) => (
    <Button
      variant={variantOf(v)}
      size={sizeOf(v)}
      color={colorOf(v)}
      shape={shapeOf(v)}
      block={v.block === true && !isIcon(v)}
      loading={v.loading === true}
      disabled={v.disabled === true}
      toggle={v.toggle === true}
      aria-label={isIcon(v) ? ICON_LABEL : undefined}
    >
      {isIcon(v) ? <Icon name="add" /> : "Button"}
    </Button>
  ),
  code: (v) => `<Button${propsOf(v)}>${childrenOf(v)}</Button>`,
};
