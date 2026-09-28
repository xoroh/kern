# Kern mobile app — "Kern"

Expo shell for the future native showcase. Empty on purpose: gallery
sections land here per component, once the set below is being built out.

## Run

```bash
bun run start     # Expo dev server (scan with Expo Go)
bun run ios       # iOS simulator
bun run android   # Android emulator
bun run typecheck # tsc --noEmit
```

Needs a development build (`expo run:ios|android`) only after adding a
library with native code. No EAS, no store builds — local showcase only.

## Convention

Every real native component gets a gallery section here in the same
change (see the docs skill), with the theme switcher covering light
and dark from day one.
