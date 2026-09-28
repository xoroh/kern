# Kern mobile app — "Kern"

Expo showcase for `@xoroh/kern/native`: every native component rendered
live on theme tokens, with a light/dark switcher. Consumes the library
via `workspace:*` — always the current source, never a published version.

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
change (see the docs skill). The switcher stays — dark mode you can see
is a feature, not a demo trick.
