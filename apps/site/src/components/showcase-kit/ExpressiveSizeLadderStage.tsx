import {
  BUTTON_EXPRESSIVE_SIZE_LADDER,
  Button,
  IconButton,
  PulseButton,
} from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL_LG,
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

const EXPRESSIVE_RUNGS = [
  { m3Size: "XS", kernSize: "sm" as const, iconSize: "sm" as const },
  { m3Size: "S", kernSize: "default" as const, iconSize: "default" as const },
  { m3Size: "M", kernSize: "md" as const, iconSize: "md" as const },
  { m3Size: "L", kernSize: "2xl" as const, iconSize: "2xl" as const },
  { m3Size: "XL", kernSize: "3xl" as const, iconSize: "3xl" as const },
];

export function ExpressiveSizeLadderStage() {
  const [mode, setMode] = useState<"Button" | "PulseButton" | "IconButton">(
    "Button",
  );
  const [iconWidth, setIconWidth] = useState<"narrow" | "default" | "wide">(
    "default",
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["Button", "PulseButton", "IconButton"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`inline-flex min-h-10 cursor-pointer items-center border-0 px-4 ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
                mode === item ? PILL_ACTIVE : PILL_REST
              }`}
            >
              {item} ladder
            </button>
          ))}
        </div>

        {mode === "IconButton" ? (
          <div className="flex items-center gap-1.5">
            <span className={`${T_BODY_SM} ${INK_SOFT}`}>
              M3 Expressive width:
            </span>
            {(["narrow", "default", "wide"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setIconWidth(w)}
                className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                  iconWidth === w ? PILL_ACTIVE : PILL_REST
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={`${STAGE} flex flex-wrap items-end justify-around gap-6 overflow-x-auto p-8`}
      >
        {EXPRESSIVE_RUNGS.map((rung) => {
          const spec = BUTTON_EXPRESSIVE_SIZE_LADDER[rung.kernSize];
          return (
            <div key={rung.m3Size} className="flex flex-col items-center gap-4">
              {mode === "Button" ? (
                <Button size={rung.kernSize} icon={<Icon name="add" />}>
                  {rung.m3Size} ({spec.heightPx})
                </Button>
              ) : mode === "PulseButton" ? (
                <PulseButton size={rung.kernSize} icon={<Icon name="bolt" />}>
                  {rung.m3Size} ({spec.heightPx})
                </PulseButton>
              ) : (
                <IconButton
                  label={`${rung.m3Size} icon button`}
                  variant="tonal"
                  size={rung.iconSize}
                  width={iconWidth}
                  icon={<Icon name="add" />}
                />
              )}

              <div
                className={`${STRIP} flex flex-col items-center gap-0.5 px-3 py-2 text-center`}
              >
                <span className={`${T_LABEL_LG} ${INK}`}>
                  M3 {rung.m3Size} · {spec.heightPx}px
                </span>
                <span className={`${T_CODE} ${INK_SOFT}`}>
                  size=&quot;
                  {mode === "IconButton" ? rung.iconSize : rung.kernSize}&quot;
                </span>
                <span className={`${T_BODY_SM} ${INK_SOFT}`}>
                  square {spec.squareCorner} → pressed {spec.pressedCorner}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${STRIP} flex flex-col gap-2 p-4`}>
        <h3
          id="size-ladder-mapping-note"
          className={`m-0 ${T_SMALL_TITLE} ${INK}`}
        >
          Canonical Kern ↔ M3 Expressive size mapping (D1024 C2)
        </h3>
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          Kern preserves all existing size keys for backward compatibility while
          mapping the 5 official M3 Expressive rungs: <code>sm</code> = XS
          (32px, with <code>xs</code> at compact 28px), <code>default</code> = S
          (40px baseline), <code>md</code> = M (56px, with <code>xl</code> at
          48px and <code>lg</code> at 64px), <code>2xl</code> = L (96px), and{" "}
          <code>3xl</code> = XL (136px).
        </p>
      </div>
    </div>
  );
}
