/**
 * generate-icons.mjs
 * Zero-dependency script — uses only Node built-ins (zlib, fs).
 * Rasterises the </> favicon into PNG at two sizes:
 *   app/icon.png        (32 × 32  — general browser fallback)
 *   app/apple-icon.png  (180 × 180 — iOS Safari apple-touch-icon)
 *
 * Design mirrors app/icon.svg:
 *   Background : #FFFFFF (light — fixed, not theme-switching)
 *   Strokes    : #2F5CFF (signal blue, same as tailwind accent)
 *   Rounded corners on background rect
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
// ---------------------------------------------------------------------------
function drawIcon(size) {
  const rgba = new Uint8Array(size * size * 4);

  // Helper: set pixel (with alpha compositing)
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

  // 1. Rounded-rect background (#FFFFFF)
  const radius = Math.round(size * 0.18); // ~18% corner radius, matches SVG rx=40/200
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Check if point is inside rounded rect
      const cx = Math.max(radius, Math.min(size - 1 - radius, x));
      const cy = Math.max(radius, Math.min(size - 1 - radius, y));
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Anti-aliased edge
      const alpha = Math.max(0, Math.min(255, (radius + 0.5 - dist) * 255));
      setPixel(x, y, 255, 255, 255, alpha);
    }
  }

  // 2. Draw </> using anti-aliased line primitives (#2F5CFF)
  const R = 0x2F, G = 0x5C, B = 0xFF;
  const sw = Math.max(1.5, size * 0.078); // stroke width ~7.8% of size

  function drawLineAA(x0, y0, x1, y1) {
    // Wu's line algorithm (anti-aliased)
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const steep = dy > dx;
    if (steep) { [x0, y0] = [y0, x0]; [x1, y1] = [y1, x1]; }
    if (x0 > x1) { [x0, x1] = [x1, x0]; [y0, y1] = [y1, y0]; }
    const ddx = x1 - x0, ddy = y1 - y0;
    const gradient = ddx === 0 ? 1 : ddy / ddx;
    let yf = y0;
    const halfSW = sw / 2;

    for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
      const yt = yf;
      // Paint a cross-section (perpendicular spread = sw)
      for (let oy = -Math.ceil(halfSW + 1); oy <= Math.ceil(halfSW + 1); oy++) {
        const dist = Math.abs(oy - (yt - Math.floor(yt)));
        const coverage = Math.max(0, Math.min(1, halfSW - Math.abs(oy) + 0.5));
        const a = Math.round(coverage * 255);
        if (a <= 0) continue;
        const py = Math.floor(yt) + oy;
        steep ? setPixel(py, x, R, G, B, a) : setPixel(x, py, R, G, B, a);
      }
      yf += gradient;
    }
  }

  // Scale coordinates from the SVG 200×200 viewBox to our canvas size
  const s = size / 200;

  // < bracket: points="72,48 30,100 72,152"
  drawLineAA(72*s, 48*s,  30*s, 100*s);
  drawLineAA(30*s, 100*s, 72*s, 152*s);

  // / slash: x1=120 y1=42  x2=80 y2=158
  drawLineAA(120*s, 42*s, 80*s, 158*s);

  // > bracket: points="128,48 170,100 128,152"
  drawLineAA(128*s, 48*s,  170*s, 100*s);
  drawLineAA(170*s, 100*s, 128*s, 152*s);

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
