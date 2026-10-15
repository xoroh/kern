/**
 * The `material-3` preset manifest — Material Design 3 as data, not as the
 * architecture. Built from the canonical role tables (`themes/material-3.json`)
 * so this file introduces no second value source: the tables stay canonical
 * until the ref/sys split (P2 batch 2b) moves them.
 */
import { FIXED_ACCENT_FAMILIES } from "./kern-roles";
import { definePreset, type PresetManifest } from "@xoroh/kern-tokens";
import {
  type ContrastPair,
  type ContrastPolicy,
  type ContrastWaiver,
} from "@xoroh/kern-tokens";
import {
  registerPreset,
  type ThemeOverrides,
} from "@xoroh/kern-tokens";
import brand from "./themes/brand.json";
import compact from "./themes/compact.json";
import demo from "./themes/demo.json";
import kern from "./themes/material-3.json";
import sharp from "./themes/sharp.json";

export const MATERIAL_3_PRESET: PresetManifest = definePreset({
  id: "material-3",
  label: "Material 3",
  color: {
    light: kern.color.light as Record<string, string>,
    dark: kern.color.dark as Record<string, string>,
  },
  shape: kern.radius as Record<string, string>,
  variants: {
    button: ["elevated", "primary", "tonal", "outlined", "ghost"],
    chip: ["assist", "filter", "input", "suggestion"],
    fab: ["surface", "primary", "secondary", "tertiary"],
  },
  capabilities: {
    "web-renderer": "supported",
    "native-renderer": "supported",
  },
  notes: "M3 Expressive (May 2025). Threshold roles (success/warning/info) are Kern extensions carried alongside the M3 set.",
});

/**
 * Accent families. Each contributes the M3 quintet:
 * `<f>`, `<f>Container`, `on<f>`, `on<f>Container`.
 *
 * M3's four (primary/secondary/tertiary/error) plus kern's three deviation
 * status families (success/warning/info, deviation K2) — generated from one
 * list so a new family is one entry, not four hand-listed pairs.
 */
export const ACCENT_FAMILIES: ReadonlyArray<string> = [
  "primary",
  "secondary",
  "tertiary",
  "error",
  "success",
  "warning",
  "info",
];

/**
 * Surface roles that carry content. Every content role is checked against
 * every one of these — the matrix, not a hand-picked subset.
 */
export const SURFACE_ROLES: ReadonlyArray<string> = [
  "surface",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceTonal",
];

/** Content foregrounds that must be legible on every surface role. */
export const SURFACE_CONTENT_ROLES: ReadonlyArray<string> = [
  "onSurface",
  "onSurfaceVariant",
];

/** The M3 inverse trio, checked against itself. */
export const INVERSE_ROLES: ReadonlyArray<string> = [
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
];


/**
 * PER-ROLE boundary waivers — the only sanctioned way for a scheme role to sit
 * outside contrast gating (deviation K9's mechanism, proven on the two roles
 * that need it today).
 *
 * This is deliberately a list of NAMED roles with a stated reason, never a
 * blanket exemption and never a prefix/substring match: a blanket exemption
 * cannot be audited, and a prefix match would silently swallow every future
 * `surface*` role.
 */
export const ROLE_WAIVERS: ReadonlyArray<ContrastWaiver> = [
  [
    "scrim",
    "Scrim is an alpha overlay composited over arbitrary content; it has no fixed backdrop to be measured against. M3 specifies it as a dimming layer, not a text or boundary color.",
  ],
  [
    "shadow",
    "Shadow is an elevation tint applied behind a surface, never as text, a boundary, or a fill a label sits on. M3 treats it as a tonal elevation cue, not a contrast-bearing role.",
  ],
  [
    "outlineVariant",
    "M3 assigns outline-variant NO contrast minimum: it is the decorative tier for dividers, gridlines and inactive borders, where a 3:1 requirement would make it indistinguishable from `outline`. It is contrast-gating-exempt by SPEC, not by convenience. Use `outline` wherever a boundary must be perceivable.",
  ],
];

/**
 * Build the full text-pair set from role families.
 *
 * Structural, not an allow-list: a role that exists in the scheme is expected
 * to be produced here by a family rule, so adding a role to a scheme cannot
 * silently escape contrast checking. The orphan law in `contrastIssues` is
 * what makes that true — see `orphanedRoles`.
 */
export function textRolePairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];
  const seen = new Set<string>();
  const add = (fg: string, bg: string) => {
    const key = `${fg}|${bg}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push([fg, bg]);
  };

  for (const family of ACCENT_FAMILIES) {
    const Cap = family[0].toUpperCase() + family.slice(1);
    // on<f> on <f> — M3's own pairing.
    add(`on${Cap}`, family);
    // on<f>Container on <f>Container — M3's own pairing.
    //
    // NOTE: on<f> on <f>Container is deliberately NOT generated. M3 defines
    // on-primary as the content color FOR primary, and on-primary-container as
    // the content color for primary-container; the cross pair is not a spec
    // pairing, and generating it produced 144 failures that measured a rule
    // M3 never stated.
    add(`on${Cap}Container`, `${family}Container`);
  }

  // Every content role on every surface role. This closes the
  // onSurfaceVariant x containers hole and the surfaceDim/surfaceBright hole.
  for (const fg of SURFACE_CONTENT_ROLES) {
    for (const bg of SURFACE_ROLES) add(fg, bg);
  }

  // The inverse trio, against its actual M3 background. M3 pairs
  // inverseOnSurface AND inversePrimary onto inverseSurface; it does not pair
  // the two foregrounds against each other, and inventing that pair produced
  // 1.00:1 failures that measure nothing.
  add("inverseOnSurface", "inverseSurface");
  add("inversePrimary", "inverseSurface");

  // Accent bases as text on the base surface only (D-026.5' hole 4 named
  // `primary`/`error` on `surface`). M3 does not require an accent to stay
  // legible as text on all nine surface containers, so generating that
  // matrix would be the gate over-constraining the palette engine.
  for (const family of ACCENT_FAMILIES) add(family, "surface");

  // Fixed accents (D-028 / P1-2, deviation K9). M3's spec is explicit about
  // these pairings: "On fixed colors are used for text and icons which sit on
  // top of the corresponding Fixed color… on primary fixed is used for text
  // and icons against the primary fixed color", and the same for on-fixed-
  // variant. So these are M3-stated pairs, not invented ones — generating them
  // is the opposite of over-constraining.
  //
  // NOTE: there is no `error` fixed family and no `FixedContainer` role in M3
  // (see kern-material-3/src/kern-roles.ts for the verification). Families come from
  // FIXED_ACCENT_FAMILIES so this stays in step with the inventory.
  for (const family of FIXED_ACCENT_FAMILIES) {
    const Cap = family[0].toUpperCase() + family.slice(1);
    for (const base of [`${family}Fixed`, `${family}FixedDim`]) {
      add(`on${Cap}Fixed`, base);
      add(`on${Cap}FixedVariant`, base);
    }
  }

  return pairs;
}

/** Minimum non-text contrast for control boundaries/indicator roles. */
export function uiRolePairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];
  const seen = new Set<string>();
  const add = (fg: string, bg: string) => {
    const key = `${fg}|${bg}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push([fg, bg]);
  };
  for (const bg of SURFACE_ROLES) {
    add("outline", bg);
  }
  for (const family of ACCENT_FAMILIES) {
    add(family, "surface");
  }
  return pairs;
}

/**
 * M3 contrast policy, assembled from the role families above.
 *
 * This is Material Design 3's policy — the pair-generation rules, the surface
 * matrix and the named waivers — living with the M3 preset data rather than in
 * the universal engine. `contrast.ts` only applies a policy it is given; it
 * invents none. A3 moves this module whole into `@xoroh/kern-material-3`.
 */
export const MATERIAL_3_POLICY: ContrastPolicy = {
  textPairs: textRolePairs(),
  uiPairs: uiRolePairs(),
  waivers: ROLE_WAIVERS,
};

/**
 * The material-3 registrations as data: base tables plus override presets.
 * Pure — assembles no engine state, so repo scripts can register these into
 * whichever resolver instance they use (source or build) without importing
 * this module's side effect twice.
 */
export function material3PresetRegistrations(): Array<{
  id: string;
  tables: Parameters<typeof registerPreset>[1];
}> {
  return [
    {
      id: "material-3",
      tables: {
        color: {
          light: kern.color.light as Record<string, string>,
          dark: kern.color.dark as Record<string, string>,
        },
        shape: kern.radius as Record<string, string>,
        contrast: kern.contrast as Record<string, Partial<Record<string, string>>>,
        policy: MATERIAL_3_POLICY,
      },
    },
    ...(
      [
        ["sharp", sharp],
        ["brand", brand],
        ["compact", compact],
        ["demo", demo],
      ] as const
    ).map(([id, file]) => ({
      id,
      tables: {
        extends: (file as { extends?: string }).extends ?? "material-3",
        overrides: (file as { overrides?: ThemeOverrides }).overrides ?? {},
      },
    })),
  ];
}

/**
 * Register the material-3 base tables, the four override presets and the M3
 * contrast policy with the universal resolver. Importing
 * `@xoroh/kern-material-3` (which re-exports this module) performs the
 * registration, so default consumers resolve M3 without further setup.
 * Consumers that import the resolver directly must import this module (or
 * register their own preset) first — an unregistered id fails loud.
 */
for (const { id, tables } of material3PresetRegistrations()) {
  registerPreset(id, tables);
}
