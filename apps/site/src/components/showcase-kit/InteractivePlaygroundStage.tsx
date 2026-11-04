import {
  Button,
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  IconButton,
  PulseButton,
} from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL_MD,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  INK,
  INK_SOFT,
  PILL_ACTIVE,
  PILL_REST,
  STAGE,
  STRIP,
  TRANSITION,
} from "../../domains/shared/systems/ui";
import { CopyButton } from "../../showcase/copy-button";
import { HighlightedCode } from "../docs/highlight";

type PlaygroundFamily = "Button" | "PulseButton" | "IconButton";
type SurfaceTone = "default" | "low" | "high" | "inverse";

const VARIANTS: ButtonVariant[] = [
  "filled",
  "tonal",
  "elevated",
  "outlined",
  "text",
];
const COLORS: ButtonColor[] = ["primary", "danger"];
const SIZES: ButtonSize[] = [
  "xs",
  "sm",
  "default",
  "md",
  "xl",
  "lg",
  "2xl",
  "3xl",
];
const SHAPES: ButtonShape[] = ["pill", "rounded", "square"];

const SURFACE_BG: Record<SurfaceTone, string> = {
  default: "bg-(--sys-color-surface-container)",
  low: "bg-(--sys-color-surface-container-low)",
  high: "bg-(--sys-color-surface-container-highest)",
  inverse:
    "bg-(--sys-color-inverse-surface) text-(--sys-color-inverse-on-surface)",
};

export function InteractivePlaygroundStage() {
  const [family, setFamily] = useState<PlaygroundFamily>("Button");
  const [variant, setVariant] = useState<ButtonVariant>("filled");
  const [color, setColor] = useState<ButtonColor>("primary");
  const [size, setSize] = useState<ButtonSize>("default");
  const [shape, setShape] = useState<ButtonShape>("pill");
  const [toggle, setToggle] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [withIcon, setWithIcon] = useState(true);
  const [loading, setLoading] = useState(false);
  const [softDisabled, setSoftDisabled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [surface, setSurface] = useState<SurfaceTone>("default");
  const [hapticLog, setHapticLog] = useState<string>("Ready — press control");

  const iconVariant =
    variant === "elevated" || variant === "text" ? "standard" : variant;
  const iconShape = shape === "square" ? "square" : "pill";
  const iconSize = size === "icon" ? "default" : size;

  const jsxSnippet = (() => {
    if (family === "IconButton") {
      const attrs = [
        'label="Bookmark"',
        iconVariant !== "standard" ? `variant="${iconVariant}"` : "",
        iconSize !== "default" ? `size="${iconSize}"` : "",
        iconShape !== "pill" ? `shape="${iconShape}"` : "",
        toggle ? "toggle" : "",
        toggle && pressed ? "pressed" : "",
        loading ? "loading" : "",
        softDisabled ? "softDisabled" : "",
        disabled ? "disabled" : "",
        'icon={<Icon name="bookmark" />}',
        toggle ? 'selectedIcon={<Icon name="check" />}' : "",
      ].filter(Boolean);
      return `<IconButton ${attrs.join(" ")} />`;
    }
    const tag = family;
    const attrs = [
      variant !== "filled" ? `variant="${variant}"` : "",
      color !== "primary" ? `color="${color}"` : "",
      size !== "default" ? `size="${size}"` : "",
      shape !== "pill" ? `shape="${shape}"` : "",
      toggle ? "toggle" : "",
      toggle && pressed ? "pressed" : "",
      withIcon ? 'icon={<Icon name="bolt" />}' : "",
      loading ? "loading" : "",
      softDisabled ? "softDisabled" : "",
      disabled ? "disabled" : "",
    ].filter(Boolean);
    const open = attrs.length > 0 ? `<${tag} ${attrs.join(" ")}>` : `<${tag}>`;
    return `${open}Deploy release</${tag}>`;
  })();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className={`${STRIP} flex flex-col gap-5 p-5 lg:col-span-5`}>
        <div className="flex flex-col gap-2">
          <span className={`${T_LABEL_MD} ${INK_SOFT}`}>
            Component primitive
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(["Button", "PulseButton", "IconButton"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFamily(item)}
                className={`inline-flex min-h-10 cursor-pointer items-center border-0 px-3.5 ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
                  family === item ? PILL_ACTIVE : PILL_REST
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className={`${T_LABEL_MD} ${INK_SOFT}`}>
            Variant (M3 emphasis)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VARIANTS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                  variant === v ? PILL_ACTIVE : PILL_REST
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {family !== "IconButton" ? (
          <div className="flex flex-col gap-2">
            <span className={`${T_LABEL_MD} ${INK_SOFT}`}>
              Semantic color role
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                    color === c ? PILL_ACTIVE : PILL_REST
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <span className={`${T_LABEL_MD} ${INK_SOFT}`}>
            M3 Expressive size ladder (XS → XL)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                  size === s ? PILL_ACTIVE : PILL_REST
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className={`${T_LABEL_MD} ${INK_SOFT}`}>
            Resting silhouette
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SHAPES.map((sh) => (
              <button
                key={sh}
                type="button"
                onClick={() => setShape(sh)}
                className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                  shape === sh ? PILL_ACTIVE : PILL_REST
                }`}
              >
                {sh}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { label: "Toggle mode", val: toggle, set: setToggle },
            { label: "Leading icon", val: withIcon, set: setWithIcon },
            { label: "Loading spinner", val: loading, set: setLoading },
            { label: "Soft-disabled", val: softDisabled, set: setSoftDisabled },
            { label: "Hard disabled", val: disabled, set: setDisabled },
          ].map((knob) => (
            <label
              key={knob.label}
              className={`inline-flex min-h-10 cursor-pointer items-center gap-2.5 rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface-container-high) px-3 ${T_BODY_SM} ${INK}`}
            >
              <input
                type="checkbox"
                checked={knob.val}
                onChange={(e) => knob.set(e.target.checked)}
                className="size-4 accent-(--sys-color-primary)"
              />
              <span>{knob.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-7">
        <div
          className={`${STAGE} ${SURFACE_BG[surface]} relative flex min-h-64 flex-col items-center justify-center gap-6 p-8`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 self-stretch">
            <span className={`${T_BODY_SM} ${INK_SOFT}`}>
              {family === "PulseButton"
                ? "Shape-stable: border-radius locked · spring scale pulse active"
                : "M3 Expressive: active press morphs corner radius · toggle swaps pill ↔ square"}
            </span>
            <div className="flex items-center gap-1">
              {(["default", "low", "high", "inverse"] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setSurface(tone)}
                  className={`inline-flex min-h-8 cursor-pointer items-center rounded-(--sys-shape-corner-full) border-0 px-2.5 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                    surface === tone ? PILL_ACTIVE : PILL_REST
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="my-auto flex flex-wrap items-center justify-center gap-4 py-6">
            {family === "Button" ? (
              <Button
                variant={variant}
                color={color}
                size={size}
                shape={shape}
                toggle={toggle}
                pressed={toggle ? pressed : undefined}
                onPressedChange={setPressed}
                loading={loading}
                softDisabled={softDisabled}
                disabled={disabled}
                icon={withIcon ? <Icon name="bolt" /> : undefined}
              >
                Deploy release
              </Button>
            ) : family === "PulseButton" ? (
              <PulseButton
                variant={variant}
                color={color}
                size={size}
                shape={shape}
                toggle={toggle}
                pressed={toggle ? pressed : undefined}
                onPressedChange={setPressed}
                loading={loading}
                softDisabled={softDisabled}
                disabled={disabled}
                icon={withIcon ? <Icon name="bolt" /> : undefined}
                onHaptic={(phase) =>
                  setHapticLog(
                    `onHaptic("${phase}") fired at ${new Date().toLocaleTimeString()}`,
                  )
                }
              >
                Deploy release
              </PulseButton>
            ) : (
              <IconButton
                label="Bookmark"
                variant={iconVariant}
                size={iconSize}
                shape={iconShape}
                toggle={toggle}
                pressed={toggle ? pressed : undefined}
                onPressedChange={setPressed}
                loading={loading}
                softDisabled={softDisabled}
                disabled={disabled}
                icon={<Icon name="bookmark" />}
                selectedIcon={<Icon name="check" />}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 self-stretch border-t border-(--sys-color-outline-variant) pt-3">
            <span className={`${T_CODE} ${INK_SOFT}`}>
              {family === "PulseButton"
                ? `data-shape-stable="true" · ${hapticLog}`
                : `toggle=${String(toggle)} · pressed=${String(pressed)} · shape=${shape}`}
            </span>
            <span className={`${T_BODY_SM} ${INK_SOFT}`}>
              Click, hold, or focus with Tab/Space to inspect state layers
            </span>
          </div>
        </div>

        <div className={`${STRIP} flex flex-col gap-2 p-4`}>
          <div className="flex items-center justify-between gap-2">
            <h3
              id="playground-live-jsx"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              Live TSX output
            </h3>
            <CopyButton text={jsxSnippet} />
          </div>
          <pre
            className={`codeblock m-0 overflow-x-auto rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface-container-high) p-4 ${T_CODE} ${INK}`}
          >
            <HighlightedCode code={jsxSnippet} language="tsx" />
          </pre>
        </div>
      </div>
    </div>
  );
}
