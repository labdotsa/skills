#!/usr/bin/env node

import { readFile } from "node:fs/promises";

function usage(message) {
  if (message) console.error(`error: ${message}`);
  console.error("usage: node scripts/check-contrast.mjs <pairs.json>");
  process.exit(2);
}

function parseChannel(value) {
  const token = value.trim();
  if (token.endsWith("%")) {
    const percentage = Number(token.slice(0, -1));
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      throw new Error(`invalid RGB percentage: ${value}`);
    }
    return (percentage / 100) * 255;
  }

  const channel = Number(token);
  if (!Number.isFinite(channel) || channel < 0 || channel > 255) {
    throw new Error(`invalid RGB channel: ${value}`);
  }
  return channel;
}

function parseHue(value) {
  const token = value.trim().toLowerCase();
  const units = [
    ["turn", 360],
    ["grad", 0.9],
    ["rad", 180 / Math.PI],
    ["deg", 1],
  ];

  for (const [suffix, multiplier] of units) {
    if (token.endsWith(suffix)) {
      const number = Number(token.slice(0, -suffix.length));
      if (!Number.isFinite(number)) throw new Error(`invalid hue: ${value}`);
      return ((number * multiplier) % 360 + 360) % 360;
    }
  }

  const number = Number(token);
  if (!Number.isFinite(number)) throw new Error(`invalid hue: ${value}`);
  return ((number % 360) + 360) % 360;
}

function parsePercentage(value, label) {
  const token = value.trim();
  if (!token.endsWith("%")) throw new Error(`${label} must be a percentage: ${value}`);
  const number = Number(token.slice(0, -1));
  if (!Number.isFinite(number) || number < 0 || number > 100) {
    throw new Error(`invalid ${label}: ${value}`);
  }
  return number / 100;
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const intermediate = chroma * (1 - Math.abs((segment % 2) - 1));
  let rgb = [0, 0, 0];

  if (segment < 1) rgb = [chroma, intermediate, 0];
  else if (segment < 2) rgb = [intermediate, chroma, 0];
  else if (segment < 3) rgb = [0, chroma, intermediate];
  else if (segment < 4) rgb = [0, intermediate, chroma];
  else if (segment < 5) rgb = [intermediate, 0, chroma];
  else rgb = [chroma, 0, intermediate];

  const offset = lightness - chroma / 2;
  return rgb.map((channel) => (channel + offset) * 255);
}

function splitFunctionalColor(body) {
  if (body.includes("/") || body.toLowerCase().includes("none")) {
    throw new Error("alpha channels and missing components are unsupported; provide an opaque computed color");
  }
  return body.includes(",")
    ? body.split(",").map((part) => part.trim())
    : body.trim().split(/\s+/);
}

function parseColor(value) {
  if (typeof value !== "string") throw new Error("color must be a string");
  const color = value.trim().toLowerCase();
  if (color === "black") return [0, 0, 0];
  if (color === "white") return [255, 255, 255];

  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const expanded = hex[1].length === 3
      ? [...hex[1]].map((digit) => digit + digit).join("")
      : hex[1];
    return [0, 2, 4].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16));
  }

  const rgb = color.match(/^rgb\((.*)\)$/i);
  if (rgb) {
    const channels = splitFunctionalColor(rgb[1]);
    if (channels.length !== 3) throw new Error(`rgb() needs three opaque channels: ${value}`);
    return channels.map(parseChannel);
  }

  const hsl = color.match(/^hsl\((.*)\)$/i);
  if (hsl) {
    const channels = splitFunctionalColor(hsl[1]);
    if (channels.length !== 3) throw new Error(`hsl() needs three opaque channels: ${value}`);
    return hslToRgb(
      parseHue(channels[0]),
      parsePercentage(channels[1], "saturation"),
      parsePercentage(channels[2], "lightness"),
    );
  }

  throw new Error(`unsupported color '${value}'; use opaque hex, rgb(), hsl(), black, or white`);
}

function luminance(color) {
  const linear = color.map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const inputPath = process.argv[2];
if (!inputPath || process.argv.length !== 3) usage();

let document;
try {
  document = JSON.parse(await readFile(inputPath, "utf8"));
} catch (error) {
  usage(`cannot read valid JSON from ${inputPath}: ${error.message}`);
}

if (!document || !Array.isArray(document.pairs) || document.pairs.length === 0) {
  usage("input must contain a non-empty 'pairs' array");
}

let failed = 0;
for (const [index, pair] of document.pairs.entries()) {
  try {
    if (!pair || typeof pair !== "object") throw new Error("pair must be an object");
    const name = typeof pair.name === "string" && pair.name.trim() ? pair.name.trim() : `pair-${index + 1}`;
    const minimum = pair.minimum === undefined ? 4.5 : Number(pair.minimum);
    if (!Number.isFinite(minimum) || minimum < 1 || minimum > 21) {
      throw new Error("minimum must be a number from 1 through 21");
    }

    const ratio = contrastRatio(parseColor(pair.foreground), parseColor(pair.background));
    const passed = ratio + Number.EPSILON >= minimum;
    if (!passed) failed += 1;
    console.log(`${passed ? "PASS" : "FAIL"} ${name}: ${ratio.toFixed(2)}:1 (minimum ${minimum}:1)`);
  } catch (error) {
    console.error(`ERROR pair-${index + 1}: ${error.message}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`${failed} contrast pair${failed === 1 ? "" : "s"} failed or could not be evaluated.`);
  process.exit(1);
}

console.log(`${document.pairs.length} contrast pair${document.pairs.length === 1 ? "" : "s"} passed.`);
