import {
  Button,
  type ButtonColor,
  type ButtonVariant,
  PulseButton,
} from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL_MD,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  INK,
  INK_SOFT,
  PILL_ACTIVE,
  PILL_REST,
  STAGE,
  TRANSITION,
} from "../../domains/shared/systems/ui";

const VARIANTS: ButtonVariant[] = [
  "filled",
  "tonal",
  "elevated",
  "outlined",
  "text",
];
const COLORS: ButtonColor[] = ["primary", "danger"];

export function StateMatrixStage() {
  const [activeColor, setActiveColor] = useState<ButtonColor>("primary");
  const [usePulse, setUsePulse] = useState(false);

  const Tag = usePulse ? PulseButton : Button;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`${T_LABEL_MD} ${INK_SOFT}`}>Color role:</span>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveColor(c)}
              className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3.5 ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                activeColor === c ? PILL_ACTIVE : PILL_REST
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setUsePulse((p) => !p)}
          className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-4 ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
            usePulse ? PILL_ACTIVE : PILL_REST
          }`}
        >
          {usePulse
            ? "Showing: PulseButton (shape-locked)"
            : "Showing: Button (corner-morphing)"}
        </button>
      </div>

      <div className={`${STAGE} overflow-x-auto p-6`}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-(--sys-color-outline-variant)">
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>Variant</th>
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>
                Resting / Hover / Press
              </th>
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>With Icon</th>
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>
                Toggle Selected
              </th>
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>Loading</th>
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>Soft-Disabled</th>
              <th className={`p-3 ${T_LABEL_MD} ${INK_SOFT}`}>
                Disabled (12% / 38%)
              </th>
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map((variant) => (
              <tr
                key={variant}
                className="border-b border-(--sys-color-outline-variant)/50 last:border-b-0"
              >
                <td className={`p-3 ${T_CODE} ${INK}`}>{variant}</td>
                <td className="p-3">
                  <Tag variant={variant} color={activeColor}>
                    Action
                  </Tag>
                </td>
                <td className="p-3">
                  <Tag
                    variant={variant}
                    color={activeColor}
                    icon={<Icon name="add" />}
                  >
                    Create
                  </Tag>
                </td>
                <td className="p-3">
                  {variant === "text" ? (
                    <span className={`${T_BODY_SM} ${INK_SOFT}`}>
                      N/A in M3
                    </span>
                  ) : (
                    <Tag
                      variant={variant}
                      color={activeColor}
                      toggle
                      defaultPressed
                    >
                      Selected
                    </Tag>
                  )}
                </td>
                <td className="p-3">
                  <Tag variant={variant} color={activeColor} loading>
                    Saving
                  </Tag>
                </td>
                <td className="p-3">
                  <Tag variant={variant} color={activeColor} softDisabled>
                    Focusable
                  </Tag>
                </td>
                <td className="p-3">
                  <Tag variant={variant} color={activeColor} disabled>
                    Disabled
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
