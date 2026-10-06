# Base UI — part-by-part vs kern

**Identity:** unstyled React primitives, anatomy-first docs (guidelines → anatomy → examples → generated types), `render`-prop composition, imperative Handles. kern-web's behavior base.
**Sources:** OSS-DEEP-WEB-base-ui.md; base-ui.com/react/components/dialog.

## Parts: they-have / we-will-have
- 40 components (accordion, alert-dialog, autocomplete, avatar, button, checkbox(+group), collapsible, combobox, context-menu, dialog, **drawer**, field(+fieldset), form, input, menu, menubar, meter, navigation-menu, number-field, **otp-field**, popover, **preview-card**, progress, radio(+group), scroll-area, select, separator, slider, switch, tabs, toast, toggle(+group), toolbar, tooltip): Y / **B** nearly all (meter B; preview-card web + ruled native stance; drawer/popover/scroll-area B via overlay-surfaces).
- Composition (`render` prop, ref-forward + prop-spread contract, nesting): Y / adopt the doctrine verbatim in kern handbook.
- Imperative Handles (`Dialog.createHandle`): Y / adopt where kern needs detached triggers.
- Utils (merge-props, use-render, direction-provider, csp-provider): Y / kern-primitives equivalents (mergeRefs decided: skip; direction = G).
- A11y (APG adherence, focus management, initialFocus/finalFocus, honesty clause): Y / kern parity contract + per-component a11y sections.

## Patterns to carry
Anatomy-first page order; package-layout-mirrors-anatomy (`index.parts.ts`); generated `types.md` + `docs:validate`; dogfooded search; JSON-LD landing. kern gap vs Base UI: per-demo a11y data (take MUI's `.a11y.json`).
