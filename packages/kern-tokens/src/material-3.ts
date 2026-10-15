/**
 * The `material-3` preset manifest — Material Design 3 as data, not as the
 * architecture. Built from the canonical role tables (`themes/material-3.json`)
 * so this file introduces no second value source: the tables stay canonical
 * until the ref/sys split (P2 batch 2b) moves them.
 */
import { definePreset, type PresetManifest } from "./preset";
import kern from "./themes/material-3.json";

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
