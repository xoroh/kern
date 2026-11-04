/**
 * M3 Expressive wavy progress geometry (WP6 A-005, D989).
 *
 * Values only — no component, no API change. Ported from the Compose
 * Material 3 token source (Apache-2.0):
 * - `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/LinearProgressIndicatorTokens.kt`
 * - `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/CircularProgressIndicatorTokens.kt`
 * both @ androidx/androidx commit 160825094a81825468a95b115bfb1b541e549856.
 * Behavior (amplitude curve, waveSpeed = wavelength) lives in
 * `WavyProgressIndicator.kt` in the same directory and is deliberately NOT
 * ported — that is renderer behavior, and the wave renderers belong to the
 * (G1-gated) WP1b loading family.
 *
 * All values are dp; web converts 1:1 to px.
 */
export type WaveformGeometry = {
  /** Peak deviation of the wave from the track centerline. */
  amplitudeDp: number;
  /** Length of one full wave. */
  wavelengthDp: number;
  /** Track stroke thickness. */
  trackThicknessDp: number;
};

/** Linear wavy indicator geometry (M3 Expressive defaults). */
export const WAVEFORM_LINEAR: WaveformGeometry & {
  /** Container height while wavy (10dp vs 4dp flat). */
  containerHeightDp: number;
  /** Stop-indicator dot diameter. */
  stopSizeDp: number;
  /** Gap between the active indicator and the track. */
  trackActiveSpaceDp: number;
  /** Indeterminate-mode wavelength (shorter than determinate). */
  indeterminateWavelengthDp: number;
} = {
  amplitudeDp: 3.0,
  wavelengthDp: 40.0,
  trackThicknessDp: 4.0,
  containerHeightDp: 10.0,
  stopSizeDp: 4.0,
  trackActiveSpaceDp: 4.0,
  indeterminateWavelengthDp: 20.0,
};

/** Circular wavy indicator geometry (M3 Expressive defaults). */
export const WAVEFORM_CIRCULAR: WaveformGeometry & {
  /** Container square edge. */
  containerSizeDp: number;
  /** Gap between the active indicator and the track. */
  trackActiveSpaceDp: number;
} = {
  amplitudeDp: 1.6,
  wavelengthDp: 15.0,
  trackThicknessDp: 4.0,
  containerSizeDp: 48.0,
  trackActiveSpaceDp: 4.0,
};
