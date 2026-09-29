// OKLCH <-> sRGB math (no dependencies). tokens.json stores oklch as canonical
// and srgb as compiled output; makeHueRamp authors custom ramps the same way.

export type Oklch = { l: number; c: number; h: number };

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function cbrt(x: number): number {
  return Math.sign(x) * Math.abs(x) ** (1 / 3);
}

export function hexToOklch(hex: string): Oklch {
  const n = hex.replace("#", "");
  const [r0, g0, b0] = [0, 2, 4].map(
    (i) => parseInt(n.slice(i, i + 2), 16) / 255,
  );
  const [r, g, b] = [r0, g0, b0].map(srgbToLinear);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const [l3, m3, s3] = [l, m, s].map(cbrt);
  const L = 0.2104542553 * l3 + 0.793617785 * m3 - 0.0040720468 * s3;
  const a = 1.9779984951 * l3 - 2.428592205 * m3 + 0.4505937099 * s3;
  const bb = 0.0259040371 * l3 + 0.7827717662 * m3 - 0.808675766 * s3;
  const c = Math.sqrt(a * a + bb * bb);
  const h = (Math.atan2(bb, a) * 180) / Math.PI;
  return { l: L, c, h: (h + 360) % 360 };
}

export function oklchToHex({ l: L, c: C, h }: Oklch): string {
  const a = C * Math.cos((h * Math.PI) / 180);
  const bb = C * Math.sin((h * Math.PI) / 180);
  const l3 = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m3 = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s3 = L - 0.0894841775 * a - 1.291485548 * bb;
  const [l, m, s] = [l3 ** 3, m3 ** 3, s3 ** 3];
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return `#${[r, g, b]
    .map((v) => {
      const x = Math.round(Math.min(1, Math.max(0, linearToSrgb(v))) * 255);
      return x.toString(16).padStart(2, "0");
    })
    .join("")}`;
}

function trim(x: number, nd: number): string {
  const s = x.toFixed(nd).replace(/\.?0+$/, "");
  return s === "" || s === "-" ? "0" : s;
}

export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${(l * 100).toFixed(1)}% ${trim(c, 3)} ${c < 0.0005 ? 0 : trim(h, 1)})`;
}

export function pairFromOklch(color: Oklch): { oklch: string; srgb: string } {
  return { oklch: formatOklch(color), srgb: oklchToHex(color) };
}
