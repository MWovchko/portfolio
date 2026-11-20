#!/usr/bin/env node
/**
 * Photo → palette. Reads a portrait, finds its dominant colors, and returns CSS
 * variable overrides for a preset (see config.palette in content/profile.ts).
 *
 *   node scripts/palette.mjs <photo> [theme]      # prints JSON
 *
 * executive  → ink / paper / accent family (light, editorial)
 * neon, night, gallery, original → dark background tinted by the photo + two glow colors
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s); l = clamp(l);
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return "#" + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex) {
  const c = hexToRgb(hex).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** k-means over the photo's pixels. Returns clusters sorted by size, with HSL. */
async function clusters(file, k = 7) {
  const { data, info } = await sharp(file).flatten({ background: "#808080" }).resize(72, 72, { fit: "cover" }).raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += info.channels) px.push([data[i], data[i + 1], data[i + 2]]);
  px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  let centers = Array.from({ length: k }, (_, i) => px[Math.floor(((i + 0.5) / k) * px.length)].slice());
  let assign = new Array(px.length).fill(0);
  for (let iter = 0; iter < 12; iter++) {
    for (let i = 0; i < px.length; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) {
        const d = (px[i][0] - centers[c][0]) ** 2 + (px[i][1] - centers[c][1]) ** 2 + (px[i][2] - centers[c][2]) ** 2;
        if (d < bd) { bd = d; best = c; }
      }
      assign[i] = best;
    }
    const sums = centers.map(() => [0, 0, 0, 0]);
    px.forEach((p, i) => { const s = sums[assign[i]]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++; });
    centers = sums.map((s, c) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : centers[c]));
  }
  const counts = new Array(k).fill(0);
  assign.forEach((a) => counts[a]++);
  return centers
    .map((rgb, i) => ({ rgb, weight: counts[i] / px.length, hsl: rgbToHsl(rgb) }))
    .filter((c) => c.weight > 0.01)
    .sort((a, b) => b.weight - a.weight);
}

const hueDist = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

export async function extractPalette(file, theme = "executive") {
  const cs = await clusters(file);
  const byL = [...cs].sort((a, b) => a.hsl[2] - b.hsl[2]);
  // Signature color: the most saturated sizable mid-tone (skin tones are de-weighted).
  const isSkin = (h, s, l) => (h <= 50 || h >= 345) && s > 0.08 && s < 0.8 && l > 0.2 && l < 0.9;
  const score = (c) => {
    const [h, s, l] = c.hsl;
    const mid = 1 - Math.abs(l - 0.5) * 1.4;
    return s * Math.sqrt(c.weight) * clamp(mid, 0.1, 1) * (isSkin(h, s, l) ? 0.12 : 1);
  };
  const ranked = [...cs].sort((a, b) => score(b) - score(a));
  const sig = ranked[0];
  let [ah, as] = sig.hsl;
  if (as < 0.04) as = 0.03; // monochrome photo: stay neutral

  if (theme === "executive") {
    const dark = byL[0].hsl;
    const light = byL[byL.length - 1].hsl;
    const ink = hslToHex(dark[0], Math.min(dark[1], 0.12), clamp(Math.min(dark[2], 0.09), 0.05, 0.12));
    const paper = hslToHex(light[2] > 0.6 ? light[0] : ah, Math.min(light[1], 0.12), 0.945);
    const accS = as < 0.04 ? as : clamp(as * 1.6, 0.12, 0.34);
    let deepL = 0.4;
    let deep = hslToHex(ah, accS + 0.04, deepL);
    while (contrast(deep, paper) < 4.8 && deepL > 0.18) deep = hslToHex(ah, accS + 0.04, (deepL -= 0.02));
    return {
      ink,
      paper,
      accent: hslToHex(ah, accS, 0.6),
      "accent-deep": deep,
      "accent-light": hslToHex(ah, accS, 0.72),
      "accent-dark": hslToHex(ah, accS, 0.44),
    };
  }

  // Dark presets: background tinted by the photo, glows from its two strongest hues.
  const second = ranked.find((c) => hueDist(c.hsl[0], ah) > 40 && c.hsl[1] > 0.15);
  const bh = second ? second.hsl[0] : ah + 70;
  const third = ranked.find((c) => hueDist(c.hsl[0], ah) > 30 && hueDist(c.hsl[0], bh) > 30 && c.hsl[1] > 0.15);
  const ch = third ? third.hsl[0] : (ah + bh) / 2 + 180;
  const s = clamp(as * 1.6, 0.55, 0.95);
  const darkBg = theme === "night" ? 0.025 : theme === "gallery" ? 0.03 : 0.08;
  return {
    bg: hslToHex(ah, 0.55, darkBg),
    "bg-2": hslToHex(ah, 0.5, darkBg + 0.04),
    text: hslToHex(ah, 0.35, 0.95),
    muted: hslToHex(ah, 0.18, 0.68),
    dim: hslToHex(ah, 0.15, 0.45),
    cyan: hslToHex(ah, s, 0.66),
    violet: hslToHex(bh, s, 0.62),
    lime: hslToHex(ch, 0.85, 0.74),
    star: hslToHex(ch, 0.9, 0.72),
    grad: `linear-gradient(110deg, ${hslToHex(ah, s, 0.62)}, ${hslToHex(bh, s, 0.6)} 55%, ${hslToHex(ch, 0.9, 0.72)})`,
    orb1: hslToHex(ah, s, theme === "night" ? 0.14 : 0.42),
    orb2: hslToHex(bh, s, theme === "night" ? 0.14 : 0.42),
  };
}

/** true when the image has a real transparent background (a cutout). */
export async function isCutout(file) {
  const img = sharp(file);
  const meta = await img.metadata();
  if (!meta.hasAlpha) return false;
  const { channels } = await img.stats();
  const alpha = channels[channels.length - 1];
  return alpha.min < 10 && alpha.mean < 235;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [file, theme = "executive"] = process.argv.slice(2);
  if (!file) {
    console.error("usage: node scripts/palette.mjs <photo> [theme]");
    process.exit(1);
  }
  const pal = await extractPalette(file, theme);
  console.log(JSON.stringify({ [theme]: pal }, null, 2));
}
