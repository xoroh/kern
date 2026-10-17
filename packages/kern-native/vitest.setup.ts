// Registers the material-3 preset tables with the universal theme resolver
// (side effect). Native components resolve themes through `theme.tsx`, whose
// default scheme requires a registered preset — without this import every
// component test fails at module load with "Unknown preset".
import "@xoroh/kern-m3";
