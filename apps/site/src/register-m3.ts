// Site ENTRY registration (decision 010): the site is an application, so it
// — not any renderer — owns the choice of design system. Importing
// "@xoroh/kern" or "@xoroh/kern-native" registers nothing; the site calls
// registerM3() once here instead.
//
// ORDER MATTERS: this module must be imported BEFORE "./routeTree.gen" in
// router.tsx. The generated route tree statically imports every route
// module, and some resolve M3 themes at module scope
// (routes/foundations/m3/theme.tsx). ESM evaluates a module's imports in
// declaration order, so registration here runs before any route module
// loads. Biome's organizeImports sorts "./register-m3" before
// "./routeTree.gen" ("reg" < "rou"), so the order survives formatting — and
// if it ever broke, the site would fail loud at boot ("Unknown preset"),
// never silently unthemed.
import { registerM3 } from "@xoroh/kern-m3";

registerM3();
