// Curated tier inputs for the Core / Components derivation
// (`scripts/lib/tiers.mjs`, D1003/D1004).
//
// Three maps, all checked in, all evidence-cited:
//
// 1. FOUNDATION_MODULES — render infrastructure whose component exports are
//    shared helpers, not composable primitives. An edge TO a foundation
//    module never promotes the importer. The gate requires every foundation
//    module to have no edges to non-foundation component modules.
//
// 2. TIER_OVERRIDES — per-file tier pins, `<platform>:<path>` -> tier. Only
//    for files whose derived tier is wrong and unfixable in the file.
//    The gate fails a STALE entry (pin equals derived — delete it) and an
//    entry pointing at a file the scanner no longer sees.
//
// 3. PARITY_TIERS — per-export tier pins, `<platform>:<Export>` -> tier, for
//    MIXED-MODULE artifacts: the file composes, but THIS export's span uses
//    none of the composed imports (verified by span inspection, cited
//    below). The gate fails a stale pin (pin equals the file tier and the
//    export no longer diverges).
//
// 4. PARITY_DIVERGED — accepted GENUINE divergences, export -> evidence. The
//    renderers really differ structurally (web composes, native is flat, or
//    vice versa); neither side is wrong, so no pin may "fix" it — the site
//    shows per-renderer tiers. The gate fails an entry whose tiers are now
//    equal (remove it) and any DIVERGENCE NOT listed here.
//
// Blocks are NEVER derived and NEVER overridden here: a block is declared by
// living in `apps/site/src/blocks/` + one row in `src/blocks/manifest.ts`.
//
// Foundation evidence (verified 2026-11-04, kern main @ cfc6a241):
// - native text.tsx: the typographic primitive (`Text`); sibling imports:
//   none (tokens + react-native + theme). Rendered BY dozens of native
//   modules the way web modules emit intrinsic text.
// - native state-layer.tsx: the M3 state layer (`StateLayer`); sibling
//   imports: none (tokens + react-native).
// - native presentation.tsx: press/portal/presence/a11y helpers
//   (`useKernPress`, `VisuallyHidden`, `PresenceGate`, portal registry);
//   sibling imports: none (`@xoroh/axis` + react + react-native).
//   (Web `focus-ring.tsx` needs no listing: only its `FOCUS_RING_CLASS`
//   constant is ever imported, and constants form no edge — verified no
//   file imports the `FocusRing` component.)
export const FOUNDATION_MODULES = new Set([
  "native:src/components/text.tsx",
  "native:src/components/state-layer.tsx",
  "native:src/components/presentation.tsx",
]);

// Empty: the derivation handles every file (spot-verified: web button is
// component — loading-state composition via CircularProgress; web
// data-table/kern-composer/kern-navigation are component; empty-state,
// checkbox, banner, search-native are core; start/blocks.tsx is core —
// leaf rows sharing only the focus-ring constant).
export const TIER_OVERRIDES = {};

// Mixed-module artifacts (span-verified 2026-11-04; usage line numbers are
// the evidence — re-verify the span if the file moves):
// - web-parity.tsx (native grouping module): `SheetHandle` is imported
//   once (line 16) and rendered once (line 109, inside Command's 48-248
//   span). SegmentedButton (249+), CountrySelect (393+) and Banner (514+)
//   render no composed import — their export tier is core.
// - layouts.tsx (native grouping module): `Chip` renders only inside
//   FilterChipRow (36-78), `KernTabs` only inside SecondaryTabs (136-157).
//   Pane (180-224) and ListDetail (225+) render neither — core.
export const PARITY_TIERS = {
  "native:Banner": {
    tier: "core",
    why: "web-parity.tsx:514+ span uses no composed import (SheetHandle renders only at line 109, Command span)",
  },
  "native:CountrySelect": {
    tier: "core",
    why: "web-parity.tsx:393+ span uses no composed import (SheetHandle renders only at line 109, Command span)",
  },
  "native:SegmentedButton": {
    tier: "core",
    why: "web-parity.tsx:249+ span uses no composed import (SheetHandle renders only at line 109, Command span)",
  },
  "native:ListDetail": {
    tier: "core",
    why: "layouts.tsx:225+ span uses neither Chip (FilterChipRow span 36-78) nor KernTabs (SecondaryTabs span 136-157)",
  },
  "native:Pane": {
    tier: "core",
    why: "layouts.tsx:180-224 span uses neither Chip nor KernTabs (spans cited above)",
  },
};

// Genuine renderer-structural divergences (verified 2026-11-04). Neither
// side is wrong; the site shows per-renderer tiers. Removing an entry is
// only correct when the renderers converge (gate enforces: listed but
// equal tiers fail as stale).
export const PARITY_DIVERGED = {
  Command:
    "native Command renders SheetHandle (web-parity.tsx:109, bottom-sheet handle); web command.tsx is a leaf",
  CircularProgress:
    "native renders Shape (circular-progress.tsx:454 via ShapeHop:512); web is SVG/CSS leaf",
  Textarea:
    "native renders Input multiline (textarea.tsx:7); web textarea.tsx is a leaf",
  IconButton:
    "web renders CircularProgress loading state (icon-button.tsx); native icon-button.tsx is self-contained",
  Input:
    "web renders FieldMessage (input.tsx); native input.tsx is self-contained (composition lives in native field.tsx instead)",
  LinkButton:
    "web renders Button (link-button.tsx); native link-button.tsx is self-contained",
  Search:
    "web renders Input (search.tsx); native search.tsx is self-contained (Text only)",
  SheetSurface:
    "web sheet-family.tsx renders KernPortal + VisuallyHidden; native sheet-surface.tsx is self-contained",
  ThemeToggle:
    "web renders IconButton (theme-toggle.tsx); native is self-contained (DISABLED_CONTENT_OPACITY constant + Text)",
  TopAppBar:
    "web start/top-app-bar.tsx renders Link; native top-app-bar.tsx is self-contained",
  TopAppBarToggle:
    "web start/top-app-bar.tsx renders Link; native top-app-bar-toggle.tsx is self-contained",
};
