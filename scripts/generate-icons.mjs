/**
 * generate-icons.mjs
 * Zero-dependency script — uses only Node built-ins (zlib, fs).
 * Rasterises the </> favicon into PNG at two sizes:
 *   app/icon.png        (32 × 32  — general browser fallback)
 *   app/apple-icon.png  (180 × 180 — iOS Safari apple-touch-icon)
 *
 * Design:
 *   Background : transparent (no solid fill — works on any tab bar color)
 *   Strokes    : two-pass render
 *     Pass 1 — white outline (1.6× sw, 55% opacity) → legible on dark tab bars
 *     Pass 2 — #2F5CFF blue  (1.0× sw, 100% opacity) → legible on light tab bars
 */

import zlib from 'node:zlib';
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = path.resolve(__dirname, '..', 'app');

// ---------------------------------------------------------------------------
// PNG encoder (pure Node, no deps)
// ---------------------------------------------------------------------------
function crc32(buf) {
  const table = crc32.table ??= (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  let c = 0xffffffff;
  for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = crc32(Buffer.concat([typeBytes, data]));
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crcBuf);
  return Buffer.concat([len, typeBytes, data, crc]);
}

function encodePNG(width, height, rgba) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width,  0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 2;  // color type: RGB (we'll use RGBA → type 6)
  ihdr[9]  = 6;  // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw image data: prepend filter byte 0 to each row
  const rows = [];
  for (let y = 0; y < height; y++) {
    rows.push(0); // filter type None
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      rows.push(rgba[i], rgba[i+1], rgba[i+2], rgba[i+3]);
    }
  }
  const raw  = Buffer.from(rows);
  const comp = zlib.deflateSync(raw, { level: 9 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', comp),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Rasteriser: draws the </> icon into an RGBA Uint8Array
// Transparent background, two-pass strokes:
//   Pass 1 — white outline (sw × 1.6, 55% opacity) → visible on dark tab bars
//   Pass 2 — #2F5CFF fill  (sw × 1.0, 100% opacity) → visible on light tab bars
// ---------------------------------------------------------------------------
function drawIcon(size) {
  const rgba = new Uint8Array(size * size * 4); // all zeroes = fully transparent

  // Helper: set pixel (with alpha compositing over existing pixels)
  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    const srcA = a / 255;
    const dstA = rgba[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA === 0) return;
    rgba[i]     = Math.round((r * srcA + rgba[i]     * dstA * (1 - srcA)) / outA);
    rgba[i + 1] = Math.round((g * srcA + rgba[i + 1] * dstA * (1 - srcA)) / outA);
    rgba[i + 2] = Math.round((b * srcA + rgba[i + 2] * dstA * (1 - srcA)) / outA);
    rgba[i + 3] = Math.round(outA * 255);
  }

  const baseSW = Math.max(1.5, size * 0.082); // ~8.2% of size

  // Generic thick-line renderer (modified Wu, supports arbitrary stroke width)
  function drawStroke(x0, y0, x1, y1, strokeW, r, g, b, alpha) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const steep = dy > dx;
    if (steep)  { [x0, y0] = [y0, x0]; [x1, y1] = [y1, x1]; }
    if (x0 > x1){ [x0, x1] = [x1, x0]; [y0, y1] = [y1, y0]; }
    const ddx = x1 - x0;
    const gradient = ddx === 0 ? 1 : (y1 - y0) / ddx;
    const halfSW = strokeW / 2;
    let yf = y0;
    for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
      const yt = yf;
      for (let oy = -Math.ceil(halfSW + 1); oy <= Math.ceil(halfSW + 1); oy++) {
        const coverage = Math.max(0, Math.min(1, halfSW - Math.abs(oy) + 0.5));
        const a = Math.round(coverage * alpha);
        if (a <= 0) continue;
        const py = Math.floor(yt) + oy;
        steep ? setPixel(py, x, r, g, b, a) : setPixel(x, py, r, g, b, a);
      }
      yf += gradient;
    }
  }

  // Scale from the SVG 200×200 viewBox
  const s = size / 200;

  // SVG segment definitions
  const segs = [
    [72, 48,  30,  100],  // < top arm
    [30, 100, 72,  152],  // < bottom arm
    [120, 42, 80,  158],  // / slash
    [128, 48, 170, 100],  // > top arm
    [170, 100, 128, 152], // > bottom arm
  ];

  // Pass 1 — white outline (1.6× width, 55% opacity) for dark-background legibility
  for (const [x0, y0, x1, y1] of segs) {
    drawStroke(x0*s, y0*s, x1*s, y1*s, baseSW * 1.6, 255, 255, 255, 140);
  }

  // Pass 2 — signal blue (#2F5CFF) at full opacity, layered on top
  for (const [x0, y0, x1, y1] of segs) {
    drawStroke(x0*s, y0*s, x1*s, y1*s, baseSW, 0x2F, 0x5C, 0xFF, 255);
  }

  return rgba;
}


// ---------------------------------------------------------------------------
// Generate and write both PNGs
// ---------------------------------------------------------------------------
for (const [filename, size] of [['icon.png', 32], ['apple-icon.png', 180]]) {
  const rgba   = drawIcon(size);
  const png    = encodePNG(size, size, rgba);
  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, png);
  console.log(`✅ Written: app/${filename}  (${size}×${size}, ${png.length} bytes)`);
}
