// Test-harness ENTRY: registers the material-3 preset tables with the
// universal theme resolver explicitly (decision 010 — no import side
// effects). Native components resolve themes lazily through `theme.tsx`;
// without this call every theme-resolving test fails loud with "Unknown
// preset". Exactly what a production app does once at its own entry.
import { registerM3 } from "@xoroh/kern-m3";

registerM3();
