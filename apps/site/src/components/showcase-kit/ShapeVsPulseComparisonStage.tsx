import {
  BUTTON_SPRING_TOKENS,
  Button,
  type ButtonShape,
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

export function ShapeVsPulseComparisonStage() {
  const [shape, setShape] = useState<ButtonShape>("pill");
  const [togglePressed, setTogglePressed] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${T_LABEL_MD} ${INK_SOFT}`}>
            Resting silhouette:
          </span>
          {(["pill", "rounded", "square"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShape(s)}
              className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3.5 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                shape === s ? PILL_ACTIVE : PILL_REST
              }`}
            >
              shape=&quot;{s}&quot;
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTogglePressed((p) => !p)}
          className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-4 ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
            togglePressed ? PILL_ACTIVE : PILL_REST
          }`}
        >
          {togglePressed
            ? "Toggle state: Selected (pressed=true)"
            : "Toggle state: Unselected (click to flip both)"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={`${STAGE} flex flex-col justify-between gap-6 p-6`}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3
                id="compare-shape-morph-title"
                className={`m-0 ${T_SMALL_TITLE} ${INK}`}
              >
                Button — M3 Expressive Corner Morph
              </h3>
              <span
                className={`rounded-(--sys-shape-corner-full) bg-(--sys-color-secondary-container) px-2.5 py-0.5 text-(--sys-color-on-secondary-container) ${T_BODY_SM}`}
              >
                Morphs radius
              </span>
            </div>
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              Active press tightens corners toward square tokens
              (8px/12px/16px), and toggle selection swaps pill ↔ square
              silhouettes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            <Button
              variant="filled"
              shape={shape}
              size="md"
              icon={<Icon name="bolt" />}
            >
              Hold to morph
            </Button>
            <Button
              variant="tonal"
              shape={shape}
              size="md"
              toggle
              pressed={togglePressed}
              onPressedChange={setTogglePressed}
            >
              {togglePressed ? "Selected (morphed)" : "Toggle morph"}
            </Button>
          </div>

          <dl className={`${STRIP} m-0 grid grid-cols-2 gap-3 p-3.5`}>
            <div>
              <dt className={`${T_BODY_SM} ${INK_SOFT}`}>
                Active press radius
              </dt>
              <dd className={`m-0 ${T_CODE} ${INK}`}>
                --sys-shape-corner-medium
              </dd>
            </div>
            <div>
              <dt className={`${T_BODY_SM} ${INK_SOFT}`}>
                Toggle selected radius
              </dt>
              <dd className={`m-0 ${T_CODE} ${INK}`}>
                {shape === "square"
                  ? "--sys-shape-corner-full"
                  : "--sys-shape-corner-large"}
              </dd>
            </div>
          </dl>
        </div>

        <div className={`${STAGE} flex flex-col justify-between gap-6 p-6`}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3
                id="compare-pulse-lock-title"
                className={`m-0 ${T_SMALL_TITLE} ${INK}`}
              >
                PulseButton — Locked Silhouette + Spring Pulse
              </h3>
              <span
                className={`rounded-(--sys-shape-corner-full) bg-(--sys-color-primary-container) px-2.5 py-0.5 text-(--sys-color-on-primary-container) ${T_BODY_SM}`}
              >
                data-shape-stable=&quot;true&quot;
              </span>
            </div>
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              Outer border-radius never changes. Tactile energy comes from the
              fast-spatial spring scale pulse (0.97 press / 1.015 hover), radial
              state-layer bloom, and icon nudge.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            <PulseButton
              variant="filled"
              shape={shape}
              size="md"
              icon={<Icon name="bolt" />}
            >
              Hold to pulse
            </PulseButton>
            <PulseButton
              variant="tonal"
              shape={shape}
              size="md"
              toggle
              pressed={togglePressed}
              onPressedChange={setTogglePressed}
            >
              {togglePressed ? "Selected (locked)" : "Toggle locked"}
            </PulseButton>
          </div>

          <dl className={`${STRIP} m-0 grid grid-cols-2 gap-3 p-3.5`}>
            <div>
              <dt className={`${T_BODY_SM} ${INK_SOFT}`}>Spatial spring</dt>
              <dd className={`m-0 ${T_CODE} ${INK}`}>
                --sys-motion-spring-{BUTTON_SPRING_TOKENS.pressIn} (1200 / 90)
              </dd>
            </div>
            <div>
              <dt className={`${T_BODY_SM} ${INK_SOFT}`}>Silhouette lock</dt>
              <dd className={`m-0 ${T_CODE} ${INK}`}>
                100% invariant ({shape})
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
