import { hexToOklch, type Oklch, pairFromOklch } from "./color";
import type { ColorRole, Mode, RoleTable } from "./resolve";
import data from "./tokens.json";

export type ToneStep =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

export const TONAL_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const satisfies readonly ToneStep[];

export type ColorPair = { oklch: string; srgb: string };
export type HueRamp = Record<ToneStep, ColorPair>;

export const SPECTRUM_HUES = [
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "teal",
  "blue",
  "purple",
  "magenta",
] as const;
export type SpectrumHue = (typeof SPECTRUM_HUES)[number];

export type StatusTone =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export const STATUS_TONES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
  "info",
  "neutral",
] as const satisfies readonly StatusTone[];

export type StatusToneColors = { bg: string; fg: string; dot: string };
export type StatusToneRoles = Record<
  StatusTone,
  { bg: ColorRole; fg: ColorRole; dot: ColorRole }
>;

export const TONE_ROLES: StatusToneRoles = {
  primary: { bg: "primaryContainer", fg: "onPrimaryContainer", dot: "primary" },
  secondary: {
    bg: "secondaryContainer",
    fg: "onSecondaryContainer",
    dot: "secondary",
  },
  success: { bg: "successContainer", fg: "onSuccessContainer", dot: "success" },
  warning: { bg: "warningContainer", fg: "onWarningContainer", dot: "warning" },
  error: { bg: "errorContainer", fg: "onErrorContainer", dot: "error" },
  info: { bg: "infoContainer", fg: "onInfoContainer", dot: "info" },
  neutral: {
    bg: "surfaceContainerHigh",
    fg: "onSurfaceVariant",
    dot: "outline",
  },
};

export type SpectrumTone = { hue: string; bg: string; fg: string; dot: string };
export type AvatarTone = { bg: string; fg: string };
export type UserTone = SpectrumTone;

export function isStatusTone(value: string): value is StatusTone {
  return (STATUS_TONES as readonly string[]).includes(value);
}

const registry = new Map<string, HueRamp>();
for (const hue of SPECTRUM_HUES) {
  registry.set(hue, data.spectrum[hue] as HueRamp);
}

function validRamp(ramp: HueRamp): boolean {
  return TONAL_STEPS.every(
    (step) =>
      ramp[step] !== undefined && /^#[\da-f]{6}$/i.test(ramp[step].srgb),
  );
}

/** Install a hue ramp (hand-authored or from makeHueRamp). Additive only. */
export function registerHue(name: string, ramp: HueRamp): void {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(name)) {
    throw new Error(`Invalid hue name: ${name}`);
  }
  if (!validRamp(ramp)) {
    throw new Error(
      `Hue ${name} must carry every step in TONAL_STEPS with six-digit hex values`,
    );
  }
  registry.set(name, ramp);
}

export function getHue(name: string): HueRamp | null {
  return registry.get(name) ?? null;
}

export function listHues(): string[] {
  return [...registry.keys()];
}

export function hasHue(name: string): boolean {
  return registry.has(name);
}

const LADDER = [
  0.965, 0.93, 0.87, 0.79, 0.68, 0.58, 0.49, 0.41, 0.33, 0.22, 0.15,
];
const CHROMA_CURVE = [
  0.15, 0.3, 0.5, 0.7, 0.9, 1.0, 0.95, 0.8, 0.6, 0.35, 0.25,
];

export type HueSeed =
  | string
  | { hex: string }
  | { hue: number; chroma?: number }
  | { oklch: Oklch };

/** Author a 50-950 ramp from any hue angle, hex, or OKLCH seed. */
export function makeHueRamp(seed: HueSeed): HueRamp {
  let base: Oklch;
  if (typeof seed === "string") {
    base = parseSeed(seed);
  } else if ("oklch" in seed) {
    base = seed.oklch;
  } else if ("hex" in seed) {
    base = parseSeed(seed.hex);
  } else {
    base = {
      l: 0.5,
      c: seed.chroma ?? 0.12,
      h: ((seed.hue % 360) + 360) % 360,
    };
  }
  const ramp = {} as HueRamp;
  TONAL_STEPS.forEach((step, i) => {
    ramp[step] = pairFromOklch({
      l: LADDER[i],
      c: base.c * CHROMA_CURVE[i],
      h: base.h,
    });
  });
  return ramp;
}

function parseSeed(value: string): Oklch {
  if (value.startsWith("#")) return hexToOklch(value);
  const match = /oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(value);
  if (!match) throw new Error(`Unrecognized hue seed: ${value}`);
  return {
    l: Number.parseFloat(match[1]) / 100,
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
}

function hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function statusTone(
  scheme: RoleTable,
  tone: StatusTone,
): StatusToneColors {
  const roles = TONE_ROLES[tone];
  return { bg: scheme[roles.bg], fg: scheme[roles.fg], dot: scheme[roles.dot] };
}

/** Tonal classification tone. Light: 100/900/700. Dark: 800/100/300. */
export function spectrumTone(hue: string, mode: Mode): SpectrumTone {
  const ramp = registry.get(hue);
  if (!ramp) throw new Error(`Unknown hue: ${hue}`);
  return mode === "dark"
    ? { hue, bg: ramp["800"].srgb, fg: ramp["100"].srgb, dot: ramp["300"].srgb }
    : {
        hue,
        bg: ramp["100"].srgb,
        fg: ramp["900"].srgb,
        dot: ramp["700"].srgb,
      };
}

const AVATAR_TONES: readonly StatusTone[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
];

const USER_HUES: readonly string[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "teal",
  "blue",
  "purple",
  "magenta",
];

/** Deterministic avatar colors from any key (name, id, email). */
export function avatarToneFor(
  scheme: RoleTable,
  key: string,
  tones: readonly StatusTone[] = AVATAR_TONES,
): AvatarTone {
  const { bg, fg } = statusTone(scheme, tones[hashKey(key) % tones.length]);
  return { bg, fg };
}

/** Deterministic user identity color. Same key, same hue, every surface. */
export function userToneFor(
  key: string,
  mode: Mode,
  hues: readonly string[] = USER_HUES,
): UserTone {
  return spectrumTone(hues[hashKey(key) % hues.length], mode);
}
