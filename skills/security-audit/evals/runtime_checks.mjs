import { pathToFileURL } from "node:url";

const targetPath = process.argv[2];
const mode = process.argv[3] ?? "baseline";
if (!targetPath || !["baseline", "patched"].includes(mode)) {
  console.error("usage: node runtime_checks.mjs <target-module.mjs> baseline|patched");
  process.exit(2);
}

const timeoutMs = 1500;
const target = await import(pathToFileURL(targetPath).href);
if (typeof target.createServer !== "function") throw new Error("target must export createServer");
const server = target.createServer();
const evidence = [];
let failed = false;

function expect(name, actual, expected, bodyOwner) {
  const pass = actual === expected.status && (expected.owner === undefined || bodyOwner === expected.owner);
  evidence.push({ name, actual, expected, bodyOwner, pass });
  if (!pass) failed = true;
}

async function request(path, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { headers, signal: controller.signal });
    const body = await response.text();
    let parsed;
    try { parsed = JSON.parse(body); } catch { parsed = {}; }
    return { status: response.status, body, owner: parsed.owner };
  } finally {
    clearTimeout(timer);
  }
}

try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const crossOwnerPaths = [
    "/documents/bob-notes?as=bob",
    "/documents/bob-notes?as=%62ob",
    "/documents/bob-notes?as=bob&as=alice",
    "/v1/documents/bob-notes?as=bob"
  ];
  for (const path of crossOwnerPaths) {
    const result = await request(path, { authorization: "Bearer alice-token" });
    expect(`${path} cross-owner`, result.status, mode === "baseline" ? { status: 200, owner: "bob" } : { status: 403 }, result.owner);
  }

  const alice = await request("/documents/alice-plan", { authorization: "Bearer alice-token" });
  expect("vulnerable route Alice owner", alice.status, { status: 200, owner: "alice" }, alice.owner);
  const bobAlias = await request("/v1/documents/bob-notes", { authorization: "Bearer bob-token" });
  expect("vulnerable alias Bob owner", bobAlias.status, { status: 200, owner: "bob" }, bobAlias.owner);
  const missingVulnerable = await request("/documents/bob-notes?as=bob");
  expect("vulnerable route missing token", missingVulnerable.status, { status: 401 }, missingVulnerable.owner);
  const malformedVulnerable = await request("/documents/bob-notes?as=bob", { authorization: "Bearer alice-token junk" });
  expect("vulnerable route malformed token", malformedVulnerable.status, { status: 401 }, malformedVulnerable.owner);
  const inheritedVulnerable = await request("/documents/bob-notes?as=bob", { authorization: "Bearer constructor" });
  expect("vulnerable route inherited token name", inheritedVulnerable.status, { status: 401 }, inheritedVulnerable.owner);
  const bob = await request("/safe/documents/bob-notes", { authorization: "Bearer bob-token" });
  expect("secure route Bob owner", bob.status, { status: 200, owner: "bob" }, bob.owner);
  const secureCross = await request("/safe/documents/bob-notes", { authorization: "Bearer alice-token" });
  expect("secure route Alice cross-owner", secureCross.status, { status: 403 }, secureCross.owner);
  const missing = await request("/safe/documents/bob-notes");
  expect("secure route missing token", missing.status, { status: 401 }, missing.owner);
  const malformed = await request("/safe/documents/bob-notes", { authorization: "Bearer alice-token junk" });
  expect("secure route malformed token", malformed.status, { status: 401 }, malformed.owner);
  const inherited = await request("/safe/documents/bob-notes", { authorization: "Bearer constructor" });
  expect("secure route inherited token name", inherited.status, { status: 401 }, inherited.owner);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

const result = { target: targetPath, mode, evidence, passed: !failed, childrenClosed: true };
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
if (failed) process.exitCode = 1;
