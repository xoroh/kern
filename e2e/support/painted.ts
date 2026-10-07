/**
 * painted-verify — the founder's white-screen standard, as an executable check.
 *
 * "The page rendered" is not a claim a spec can make by asserting an element is
 * attached. A page can be fully attached, fully in the DOM, fully green in
 * Playwright's eyes, and still be a WHITE SCREEN: a runtime error after first
 * paint, a CSS import that resolved to nothing, a font/theme that collapsed
 * every token to the same value. Every one of those produces a passing
 * `toBeVisible()`.
 *
 * So this helper measures the actual rasterised pixels:
 *
 *   1. screenshot the viewport;
 *   2. hand the PNG to the BROWSER to decode (an <img> into a canvas) — no
 *      image library, no node canvas, and it is the same engine that painted
 *      it, so there is no decoder disagreement;
 *   3. read every pixel back and report the distinct-colour count and the
 *      non-background ratio.
 *
 * A blank page collapses to 1-2 distinct colours at a ~0% non-background
 * ratio. A painted page does not. The thresholds are deliberately loose — the
 * check is "is there a picture here", not "is it pretty".
 */
import { expect, type Page } from "@playwright/test";

/** Below this many distinct colours, treat the page as unpainted. */
export const MIN_DISTINCT_COLOURS = 8;
/** Below this fraction of non-dominant pixels, treat the page as unpainted. */
export const MIN_NON_DOMINANT_RATIO = 0.01;

export interface PaintReport {
  width: number;
  height: number;
  distinctColours: number;
  dominantShare: number;
  nonDominantRatio: number;
  /** A short human-readable sample of the colours actually on screen. */
  sample: string[];
}

export async function measurePaint(page: Page): Promise<PaintReport> {
  const shot = await page.screenshot({ type: "png" });
  const dataUrl = `data:image/png;base64,${shot.toString("base64")}`;

  // Decode in the page under test — same engine that produced the pixels.
  const report = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data as unknown as Uint8ClampedArray;

    const counts = new Map<number, number>();
    let total = 0;
    for (let i = 0; i < px.length; i += 4) {
      // Quantise to 5 bits per channel: anti-aliasing produces thousands of
      // near-identical shades that would otherwise make any page look "rich".
      const key =
        ((px[i] >> 3) << 10) | ((px[i + 1] >> 3) << 5) | (px[i + 2] >> 3);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      total += 1;
    }
    let dominant = 0;
    for (const n of counts.values()) if (n > dominant) dominant = n;
    const sorted = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    return {
      width: canvas.width,
      height: canvas.height,
      distinctColours: counts.size,
      dominantShare: dominant / total,
      nonDominantRatio: 1 - dominant / total,
      sample: sorted.map(([k]) => {
        const r = ((k >> 10) & 31) << 3;
        const g = ((k >> 5) & 31) << 3;
        const b = (k & 31) << 3;
        return `rgb(${r},${g},${b})`;
      }),
    };
  }, dataUrl);

  return report;
}

/** Assert the viewport is actually painted, with the report in the failure text. */
export async function expectPainted(
  page: Page,
  where: string,
): Promise<PaintReport> {
  const r = await measurePaint(page);
  const detail =
    `${where}: ${r.distinctColours} distinct colours, ` +
    `non-dominant ${(r.nonDominantRatio * 100).toFixed(2)}%, ` +
    `${r.width}x${r.height}, dominant ${(r.dominantShare * 100).toFixed(1)}% ` +
    `[${r.sample.join(" ")}]`;

  expect(
    r.distinctColours,
    `BLANK/WHITE SCREEN — too few distinct colours. ${detail}`,
  ).toBeGreaterThanOrEqual(MIN_DISTINCT_COLOURS);
  expect(
    r.nonDominantRatio,
    `BLANK/WHITE SCREEN — one colour dominates the viewport. ${detail}`,
  ).toBeGreaterThan(MIN_NON_DOMINANT_RATIO);
  return r;
}
