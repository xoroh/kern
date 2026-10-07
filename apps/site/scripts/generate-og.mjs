#!/usr/bin/env node
/**
 * generate-og — rasterize `public/og.png`, the social preview tile.
 *
 * WHY A SCRIPT, NOT A COMMITTED BINARY
 *
 * The tile is the same "K on primary" mark as the rail header and
 * `favicon.svg`, drawn from numbers rather than pasted pixels: a committed
 * PNG is opaque bytes nobody can review, while this file is the recipe.
 * Deterministic (fixed geometry, no fonts, no timestamps, no
 * dependencies — only `node:zlib` + `node:fs`), so rerunning it byte-reproduces
 * the tile. Run: `node scripts/generate-og.mjs` from `apps/site`.
 *
 * HONESTY: the disc is the Material 3 baseline primary (#6750A4), kern's
 * default seed family — the same value `favicon.svg` wears. A social
 * scraper has no theme context, so the tile wears the default, stated here
 * rather than sampled from a screenshot (a screenshot would drift).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "public", "og.png");

const W = 1200;
const H = 630;
const BG = [0x67, 0x50, 0xa4];
const INK = [0xff, 0xff, 0xff];

// The K: a vertical stem plus two arms meeting at mid-cap-height. All arms
// are 80px thick; the arms are distance-to-segment tests, not sprite data.
const STEM = { x0: 480, x1: 560, y0: 135, y1: 495 };
const MID = { x: 560, y: 315 };
const ARM_END_UP = { x: 760, y: 135 };
const ARM_END_DOWN = { x: 760, y: 495 };
const HALF_THICK = 40;

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.min(1, Math.max(0, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function isInk(x, y) {
  if (x >= STEM.x0 && x < STEM.x1 && y >= STEM.y0 && y < STEM.y1) return true;
  if (distToSegment(x, y, MID.x, MID.y, ARM_END_UP.x, ARM_END_UP.y) <= HALF_THICK)
    return true;
  if (
    distToSegment(x, y, MID.x, MID.y, ARM_END_DOWN.x, ARM_END_DOWN.y) <=
    HALF_THICK
  )
    return true;
  return false;
}

// Raw scanlines: filter byte 0 (None) + RGB triplets, then one zlib stream.
const raw = Buffer.alloc(H * (1 + W * 3));
let o = 0;
for (let y = 0; y < H; y++) {
  raw[o++] = 0;
  for (let x = 0; x < W; x++) {
    const c = isInk(x, y) ? INK : BG;
    raw[o++] = c[0];
    raw[o++] = c[1];
    raw[o++] = c[2];
  }
}
const idat = deflateSync(raw, { level: 9 });

// Minimal PNG writer: signature + IHDR (8-bit truecolor) + IDAT + IEND.
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const sum = Buffer.alloc(4);
  sum.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, sum]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolor

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(OUT, png);
console.log(`generate-og: wrote public/og.png (${png.length} bytes, ${W}x${H})`);
