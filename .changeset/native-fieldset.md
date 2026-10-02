---
"@xoroh/kern-native": minor
---

Add native `Fieldset` — grouped controls with a shared legend and inherited
disabled state.

## Why this owns real behaviour natively

On the web this is a thin wrapper over `<fieldset>`, and the browser gives it two
behaviours for free: the group is announced as a group **named by its legend**,
and `disabled` disables **every descendant control**.

React Native has no `<fieldset>` and no such inheritance — a `View` with
`disabled` set is just a `View`, and nothing downstream knows. So this component
publishes `disabled` through context and exports `useFieldsetDisabled()`, which
Kern's own controls read. That is the reason to build it natively rather than
document "wrap your inputs in a View": without a provider there is no way for a
control to ask whether any ancestor is disabled.

## The legend names the group

The legend is not a caption — it is the group's accessible name. `FieldsetLegend`
registers its text with the enclosing fieldset on mount (and clears it on
unmount, so a removed legend does not leave a group named). An explicit
`accessibilityLabel` still wins, for when the legend is not text.

## Two bugs the tests found, both fixed before commit

- **Nested fieldsets silently re-enabled their contents.** Publishing the inner
  fieldset's own `disabled` overwrote the outer's, so
  `<fieldset disabled><fieldset>` was enabled. The browser keeps descendants
  disabled; a consumer nesting groups for layout expects that. Now
  `disabled || inherited`.
- The first draft tried to derive the legend text from `children`, which is
  always `undefined` because the legend is a child *element*. Replaced with
  registration.

`role`, not `accessibilityRole`: RN's ARIA-aligned `Role` union carries `group`,
the platform-trait union does not need to. Same reasoning as `meter.tsx`.

Verified: native jest **196/196** across 17 suites (11 new), typecheck PASS.