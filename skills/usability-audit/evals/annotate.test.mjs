import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import zlib from "node:zlib";

const root = path.resolve(import.meta.dirname, "..");
const script = path.join(root, "scripts/annotate.mjs");
function crc32(buffer) { let crc = 0xffffffff; for (const byte of buffer) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const body = Buffer.concat([Buffer.from(type), data]); const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); body.copy(out, 4); out.writeUInt32BE(crc32(body), 8 + data.length); return out; }
function makePng(width = 32, height = 32) { const rows = Buffer.alloc(height * (1 + width * 4)); for (let y = 0; y < height; y++) rows[y * (1 + width * 4)] = 0; const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6; return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(rows)), chunk("IEND", Buffer.alloc(0))]); }
const png = makePng();
const tempDirs = [];
test.after(() => { for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true }); });

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "usability-audit-"));
  tempDirs.push(dir);
  fs.writeFileSync(path.join(dir, "shot.png"), png);
  return dir;
}
function run(dir, spec, output = "out.svg") {
  const input = path.join(dir, "input.json");
  fs.writeFileSync(input, JSON.stringify(spec));
  return { input, output: path.join(dir, output) };
}

test("validates geometry and preserves PNG provenance", () => {
  const dir = fixture();
  const files = run(dir, { screenshot: "shot.png", dimensions: { width: 32, height: 32 }, callouts: [{ id: "A1", title: "target", description: "desc", x: 0, y: 0, width: 24, height: 24 }] });
  execFileSync(process.execPath, [script, files.input, files.output]);
  const svg = fs.readFileSync(files.output, "utf8");
  assert.match(svg, /width="640"/);
  assert.match(svg, new RegExp(crypto.createHash("sha256").update(png).digest("hex")));
  assert.match(svg, /data:image\/png;base64,/);
  const encoded = svg.match(/href="data:image\/png;base64,([^"]+)"/)[1];
  assert.deepEqual(Buffer.from(encoded, "base64"), png);
  assert.match(svg, /target/);
  assert.match(svg, /circle cx="12" cy="12" r="12"/);
  assert.match(svg, /<text x="16" y="56"/);
});

test("rejects out-of-bounds geometry, unsafe IDs, and mismatched dimensions", () => {
  for (const callouts of [[{ id: "A1", x: 32, y: 0, width: 1, height: 1 }], [{ id: "bad id", x: 0, y: 0, width: 1, height: 1 }]]) {
    const dir = fixture(); const files = run(dir, { screenshot: "shot.png", callouts });
    assert.throws(() => execFileSync(process.execPath, [script, files.input, files.output]), (error) => error.status === 1);
  }
  const dir = fixture(); const files = run(dir, { screenshot: "shot.png", dimensions: { width: 2, height: 32 }, callouts: [] });
  assert.throws(() => execFileSync(process.execPath, [script, files.input, files.output]), (error) => error.status === 1);
});

test("escapes labels and refuses overwrite", () => {
  const dir = fixture(); const files = run(dir, { screenshot: "shot.png", callouts: [{ id: "A1", title: "<script>alert(1)</script>", description: "safe", x: 0, y: 0, width: 24, height: 24 }] });
  execFileSync(process.execPath, [script, files.input, files.output]);
  assert.match(fs.readFileSync(files.output, "utf8"), /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.throws(() => execFileSync(process.execPath, [script, files.input, files.output]), (error) => error.status === 1);
});

test("rejects tiny PNGs and invalid optional fields without writing output", () => {
  const dir = fixture(); const files = run(dir, { screenshot: "shot.png", callouts: [{ id: "A1", title: null, x: 0, y: 0, width: 24, height: 24 }] });
  assert.throws(() => execFileSync(process.execPath, [script, files.input, files.output]), (error) => error.status === 1);
  assert.equal(fs.existsSync(files.output), false);
  const tinyDir = fs.mkdtempSync(path.join(os.tmpdir(), "usability-audit-tiny-")); tempDirs.push(tinyDir);
  fs.writeFileSync(path.join(tinyDir, "tiny.png"), makePng(1, 1));
  const tiny = run(tinyDir, { screenshot: "tiny.png", callouts: [] });
  assert.throws(() => execFileSync(process.execPath, [script, tiny.input, tiny.output]), (error) => error.status === 1);
});

test("allows a clean no-annotation capture", () => {
  const dir = fixture(); const files = run(dir, { screenshot: "shot.png", callouts: [] });
  execFileSync(process.execPath, [script, files.input, files.output]);
  const svg = fs.readFileSync(files.output, "utf8");
  assert.doesNotMatch(svg, /callout-/);
});

test("keeps edge highlights exact and badges inside the source image", () => {
  const dir = fixture();
  const files = run(dir, { screenshot: "shot.png", callouts: [
    { id: "A1", x: 0, y: 0, width: 1, height: 1 },
    { id: "A2", x: 31, y: 31, width: 1, height: 1 },
  ] });
  execFileSync(process.execPath, [script, files.input, files.output]);
  const svg = fs.readFileSync(files.output, "utf8");
  assert.match(svg, /rect x="0" y="0" width="1" height="1"/);
  assert.match(svg, /rect x="31" y="31" width="1" height="1"/);
  for (const match of svg.matchAll(/circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)) {
    const [, x, y, radius] = match.map(Number);
    assert.ok(x - radius >= 0 && y - radius >= 0);
    assert.ok(x + radius <= 32 && y + radius <= 32);
  }
});

test("preserves long labels while wrapping the legend", () => {
  const dir = fixture();
  const title = "x".repeat(220);
  const files = run(dir, { screenshot: "shot.png", callouts: [
    { id: "A1", title, x: 0, y: 0, width: 24, height: 24 },
  ] });
  execFileSync(process.execPath, [script, files.input, files.output]);
  const svg = fs.readFileSync(files.output, "utf8");
  const lines = [...svg.matchAll(/<text x="16"[^>]*>([^<]*)<\/text>/g)].map((match) => match[1]);
  assert.equal(lines.join("").replace(/\s+/g, ""), `1. A1: ${title}`.replace(/\s+/g, ""));
  assert.ok(lines.every((line) => line.length <= 72));
});
