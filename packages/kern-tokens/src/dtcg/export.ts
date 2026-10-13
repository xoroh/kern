/**
 * DTCG export (KERN-019) — Kern authoring → DTCG 2025.10 document.
 *
 * Every foundation group is represented; nothing invented:
 * - palettes/spectrum/base → `color` (sRGB + alpha, OKLCH in `$extensions`).
 * - type scale → `typography` composites (lineHeight normalized to DTCG number
 *   semantics, legacy px retained in extensions).
 * - shape/spacing → `dimension`.
 * - elevation → `shadow` (first layer) + `dp` dimension; full CSS and dark
 *   shadows in extensions (documented loss policy, never silent).
 * - motion easing → `cubicBezier`, duration → `duration`, springs → numeric
 *   tokens + namespaced semantics (no fake `spring` type).
 * - states → `number`.
 * - sys.color light/dark → `color` per role with role provenance in
 *   extensions. Standard-contrast only: contrast overlays are a Kern theme
 *   catalog concern, and nonstandard `$modes` are never emitted while claiming
 *   Format compatibility.
 */

import {
  asCubicBezier,
  asDimension,
  asDuration,
  asOpacityNumber,
  hexToComponents,
  KERN_EXTENSION,
  parseFirstShadow,
} from "./shared";

type AnyRecord = Record<string, unknown>;

const isRecord = (v: unknown): v is AnyRecord =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isTokenKey = (k: string) => !k.startsWith("$");

function ext(value: unknown): AnyRecord {
  return { $extensions: { [KERN_EXTENSION]: value } };
}

function colorToken(srgb: string, oklch?: string): AnyRecord {
  const node: AnyRecord = {
    $type: "color",
    $value: { colorSpace: "srgb", components: hexToComponents(srgb), alpha: 1 },
  };
  if (oklch) {
    node.$extensions = { [KERN_EXTENSION]: { oklch, srgb } };
  }
  return node;
}

function rampGroup(ramp: AnyRecord, provenance: string): AnyRecord {
  const group: AnyRecord = { $type: "color" };
  for (const [step, value] of Object.entries(ramp)) {
    if (!isTokenKey(step) || !isRecord(value)) continue;
    const srgb = value.srgb;
    if (typeof srgb !== "string") continue;
    group[step] = colorToken(
      srgb,
      typeof value.oklch === "string" ? value.oklch : undefined,
    );
  }
  group.$extensions = { [KERN_EXTENSION]: { provenance } };
  return group;
}

function typographyToken(
  name: string,
  style: AnyRecord,
  family: string,
): AnyRecord {
  const sizePx = Number(String(style.size).replace("px", ""));
  const linePx = Number(String(style.lineHeight).replace("px", ""));
  // DTCG lineHeight is a NUMBER (multiplier); legacy px is preserved in the
  // extension so the projection is reversible without guessing.
  const lineHeight =
    Number.isFinite(sizePx) && Number.isFinite(linePx) && sizePx > 0
      ? Math.round((linePx / sizePx) * 1e4) / 1e4
      : 1.2;
  return {
    $type: "typography",
    $value: {
      fontFamily: family,
      fontSize: asDimension(String(style.size)),
      fontWeight: style.weight,
      lineHeight,
      letterSpacing: asDimension(String(style.tracking)),
    },
    ...ext({ name, size: style.size, lineHeight: style.lineHeight }),
  };
}

function elevationToken(_level: string, entry: AnyRecord): AnyRecord {
  const group: AnyRecord = {
    dp: { $type: "dimension", $value: { value: entry.dp, unit: "px" } },
  };
  const shadow = typeof entry.shadow === "string" ? entry.shadow : "none";
  const parsed = parseFirstShadow(shadow);
  if (parsed) {
    group.shadow = { $type: "shadow", $value: parsed };
  }
  group.$extensions = {
    [KERN_EXTENSION]: {
      css: shadow,
      ...(typeof entry.shadowDark === "string"
        ? { shadowDark: entry.shadowDark }
        : {}),
      multiLayer: shadow.includes(","),
    },
  };
  return group;
}

export type ExportInput = {
  tokens: AnyRecord;
  /** Resolved light role table (`kern.json` color.light). */
  light: Record<string, string>;
  /** Resolved dark role table. */
  dark: Record<string, string>;
};

/** Project the full authoring source to a DTCG 2025.10 document. */
export function toDtcg(input: ExportInput): AnyRecord {
  const { tokens, light, dark } = input;
  const doc: AnyRecord = {
    $schema: "https://www.designtokens.org/TR/2025.10/format/",
  };

  const ref: AnyRecord = {};
  const palettes = tokens.palettes as AnyRecord | undefined;
  if (palettes) {
    ref.palette = {};
    for (const [hue, ramp] of Object.entries(palettes)) {
      if (isRecord(ramp)) {
        (ref.palette as AnyRecord)[hue] = rampGroup(ramp, `palettes.${hue}`);
      }
    }
  }
  const spectrum = tokens.spectrum as AnyRecord | undefined;
  if (spectrum) {
    ref.spectrum = {};
    for (const [hue, ramp] of Object.entries(spectrum)) {
      if (isRecord(ramp)) {
        (ref.spectrum as AnyRecord)[hue] = rampGroup(ramp, `spectrum.${hue}`);
      }
    }
  }
  const base = tokens.base as AnyRecord | undefined;
  if (base) {
    ref.base = {};
    for (const [name, value] of Object.entries(base)) {
      if (!isRecord(value) || typeof value.srgb !== "string") continue;
      (ref.base as AnyRecord)[name] = colorToken(
        value.srgb,
        typeof value.oklch === "string" ? value.oklch : undefined,
      );
    }
  }

  const typography = tokens.typography as AnyRecord | undefined;
  if (typography) {
    const family = `${typography.webFamily ?? typography.family ?? "Inter"}`;
    ref.type = { $type: "typography" };
    const scale = (typography.scale ?? {}) as AnyRecord;
    (ref.type as AnyRecord).scale = {};
    for (const [name, style] of Object.entries(scale)) {
      if (isRecord(style)) {
        ((ref.type as AnyRecord).scale as AnyRecord)[name] = typographyToken(
          name,
          style,
          family,
        );
      }
    }
    const emph = (typography.scaleEmphasized ?? {}) as AnyRecord;
    (ref.type as AnyRecord).scaleEmphasized = {};
    for (const [name, style] of Object.entries(emph)) {
      if (isRecord(style)) {
        ((ref.type as AnyRecord).scaleEmphasized as AnyRecord)[name] =
          typographyToken(name, style, family);
      }
    }
    (ref.type as AnyRecord).family = {
      $type: "fontFamily",
      $value: family,
    };
  }

  const shape = tokens.shape as AnyRecord | undefined;
  if (shape) {
    ref.shape = { $type: "dimension" };
    for (const [name, value] of Object.entries(shape)) {
      if (!isTokenKey(name) || typeof value !== "string") continue;
      (ref.shape as AnyRecord)[name] = {
        $value: asDimension(value),
      };
    }
  }

  const elevation = tokens.elevation as AnyRecord | undefined;
  if (elevation) {
    ref.elevation = {};
    for (const [level, entry] of Object.entries(elevation)) {
      if (!isTokenKey(level) || !isRecord(entry)) continue;
      (ref.elevation as AnyRecord)[level] = elevationToken(level, entry);
    }
  }

  const motion = tokens.motion as AnyRecord | undefined;
  if (motion) {
    ref.motion = {};
    const easing = (motion.easing ?? {}) as AnyRecord;
    (ref.motion as AnyRecord).easing = { $type: "cubicBezier" };
    for (const [name, value] of Object.entries(easing)) {
      if (typeof value !== "string") continue;
      ((ref.motion as AnyRecord).easing as AnyRecord)[name] = {
        $value: asCubicBezier(value),
      };
    }
    const duration = (motion.duration ?? {}) as AnyRecord;
    (ref.motion as AnyRecord).duration = { $type: "duration" };
    for (const [name, value] of Object.entries(duration)) {
      if (typeof value !== "string") continue;
      ((ref.motion as AnyRecord).duration as AnyRecord)[name] = {
        $value: asDuration(value),
      };
    }
    const spring = (motion.spring ?? {}) as AnyRecord;
    (ref.motion as AnyRecord).spring = {};
    for (const [name, value] of Object.entries(spring)) {
      if (!isRecord(value)) continue;
      ((ref.motion as AnyRecord).spring as AnyRecord)[name] = {
        stiffness: { $type: "number", $value: value.stiffness },
        damping: { $type: "number", $value: value.damping },
        $extensions: {
          [KERN_EXTENSION]: { semantics: "spring-algorithm", name },
        },
      };
    }
    (ref.motion as AnyRecord).schemes = {};
    const schemes = (motion.schemes ?? {}) as AnyRecord;
    for (const [scheme, refs] of Object.entries(schemes)) {
      if (!isRecord(refs)) continue;
      const group: AnyRecord = {};
      for (const [key, target] of Object.entries(refs)) {
        // Scheme selections are names, not aliases: `spatial-fast` names no
        // token in the source, so emitting `{…}` would create a dangling
        // reference. Plain strings, honestly.
        group[key] = { $type: "string", $value: String(target) };
      }
      ((ref.motion as AnyRecord).schemes as AnyRecord)[scheme] = group;
    }
  }

  const states = tokens.states as AnyRecord | undefined;
  if (states) {
    ref.states = { $type: "number" };
    for (const [name, value] of Object.entries(states)) {
      if (!isTokenKey(name) || typeof value !== "string") continue;
      (ref.states as AnyRecord)[name] = { $value: asOpacityNumber(value) };
    }
  }

  const spacing = tokens.spacing as AnyRecord | undefined;
  if (spacing) {
    ref.spacing = { $type: "dimension" };
    for (const [step, value] of Object.entries(spacing)) {
      if (!isTokenKey(step) || typeof value !== "string") continue;
      (ref.spacing as AnyRecord)[step] = { $value: asDimension(value) };
    }
  }

  doc.ref = ref;

  const sysColor = (table: Record<string, string>, mode: string): AnyRecord => {
    const group: AnyRecord = { $type: "color" };
    for (const [role, value] of Object.entries(table)) {
      group[role] = {
        $value: {
          colorSpace: "srgb",
          components: hexToComponents(value),
          alpha: 1,
        },
        $extensions: {
          [KERN_EXTENSION]: { role, mode, srgb: value },
        },
      };
    }
    return group;
  };
  doc.sys = {
    color: { light: sysColor(light, "light"), dark: sysColor(dark, "dark") },
  };

  return doc;
}
