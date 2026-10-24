#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const fail = (message) => { throw new Error(message); };
const finite = (value, name) => {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(`${name} must be finite`);
  return value;
};
const xml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[char]);

function readPng(file) {
  const bytes = fs.readFileSync(file);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature) || bytes.toString("ascii", 12, 16) !== "IHDR") fail("screenshot must be a PNG with an IHDR chunk");
  const width = bytes.readUInt32BE(16); const height = bytes.readUInt32BE(20);
  if (!width || !height) fail("PNG dimensions must be positive");
  if (width < 24 || height < 24) fail("PNG is too small for readable callout markers; use a capture at least 24x24 physical pixels");
  return { bytes, width, height, sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
}

function main() {
  const [inputArg, outputArg] = process.argv.slice(2);
  if (!inputArg || !outputArg) fail("usage: node scripts/annotate.mjs input.json output.svg");
  const input = path.resolve(inputArg); const output = path.resolve(outputArg);
  if (input === output) fail("output must differ from input");
  if (fs.existsSync(output)) fail(`refusing to overwrite existing output: ${output}`);
  const spec = JSON.parse(fs.readFileSync(input, "utf8"));
  if (!spec || typeof spec.screenshot !== "string" || !Array.isArray(spec.callouts)) fail("input requires screenshot and callouts");
  const screenshot = path.resolve(path.dirname(input), spec.screenshot);
  if (screenshot === output || !fs.existsSync(screenshot)) fail("screenshot must exist and differ from output");
  const png = readPng(screenshot);
  if (spec.dimensions !== undefined && (!spec.dimensions || spec.dimensions.width !== png.width || spec.dimensions.height !== png.height)) fail("declared dimensions must be an object matching PNG dimensions");
  for (const [name, value] of Object.entries(spec.capture ?? {})) if (["id", "revision", "coordinateSystem"].includes(name) && typeof value !== "string") fail(`capture.${name} must be a string`);
  const ids = new Set();
  const callouts = spec.callouts.map((item, index) => {
    if (!item || typeof item.id !== "string" || !/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(item.id) || ids.has(item.id)) fail(`callout ${index + 1} has an unsafe or duplicate id`);
    ids.add(item.id);
    for (const field of ["title", "description", "locator"]) if (item[field] !== undefined && typeof item[field] !== "string") fail(`${item.id}.${field} must be a string`);
    const x = finite(item.x, `${item.id}.x`); const y = finite(item.y, `${item.id}.y`); const width = finite(item.width, `${item.id}.width`); const height = finite(item.height, `${item.id}.height`);
    if (width <= 0 || height <= 0 || x < 0 || y < 0 || x + width > png.width || y + height > png.height) fail(`${item.id} bounds exceed PNG dimensions`);
    return { id: item.id, title: item.title ?? item.id, description: item.description ?? "", x, y, width, height, locator: item.locator ?? "" };
  });
  const boxes = callouts.map(({ id, title, description, x, y, width, height, locator }, index) => {
    const color = ["#d7263d", "#0066cc", "#8a3ffc", "#087f5b", "#b45309"][index % 5];
    const radius = 12;
    const markerX = Math.max(radius, Math.min(png.width - radius, x + width / 2));
    const markerY = Math.max(radius, Math.min(png.height - radius, y + height / 2));
    return `<g id="callout-${xml(id)}" data-callout-id="${xml(id)}"><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${color}" stroke-width="3"/><circle cx="${markerX}" cy="${markerY}" r="${radius}" fill="${color}"/><text x="${markerX}" y="${markerY + 5}" text-anchor="middle" fill="white" font-family="sans-serif" font-size="12" font-weight="700">${xml(index + 1)}</text><title>${xml(title)}${locator ? ` (${xml(locator)})` : ""}</title><desc>${xml(description)}</desc></g>`;
  }).join("");
  const legendWidth = Math.max(png.width, 640);
  const legendLines = callouts.flatMap(({ id, title, description }, index) => {
    const text = `${index + 1}. ${id}: ${title}${description ? ` - ${description}` : ""}`;
    const lines = [];
    let remaining = text.replace(/\s+/g, " ");
    while (remaining.length > 72) {
      const space = remaining.lastIndexOf(" ", 72);
      const end = space > 0 ? space : 72;
      lines.push(remaining.slice(0, end));
      remaining = remaining.slice(end).trimStart();
    }
    lines.push(remaining);
    return lines;
  });
  const legend = legendLines.map((line, index) => `<text x="16" y="${png.height + 24 + index * 22}" font-family="monospace" font-size="14">${xml(line)}</text>`).join("");
  const data = png.bytes.toString("base64"); const legendHeight = legendLines.length ? 32 + legendLines.length * 22 : 0;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${legendWidth}" height="${png.height + legendHeight}" viewBox="0 0 ${legendWidth} ${png.height + legendHeight}" data-source-sha256="${png.sha256}"><image width="${png.width}" height="${png.height}" href="data:image/png;base64,${data}"/><g aria-label="Usability audit callouts">${boxes}</g>${legend}</svg>\n`;
  fs.writeFileSync(output, svg, { flag: "wx" });
}

try { main(); } catch (error) { console.error(`annotate: ${error.message}`); process.exitCode = 1; }
