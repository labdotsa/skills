import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
import { createPublicationServer } from "./lib/publication-server.mjs";
import { representativeRoutes } from "./lib/quality-routes.mjs";
import { evaluateTransferBudget } from "./lib/transfer-budget.mjs";

const profiles = [
  { name: "canonical", output: ".artifacts/performance/canonical", basePath: "" },
  { name: "pages-project", output: ".artifacts/performance/pages-project", basePath: "/skills" },
];

for (const profile of profiles) build(profile);

const browser = await chromium.launch({ headless: true });
const reports = [];
try {
  for (const profile of profiles) {
    const rootDirectory = path.resolve(profile.output);
    const server = createPublicationServer({ rootDirectory, basePath: profile.basePath });
    await listen(server);
    try {
      const address = server.address();
      const origin = `http://127.0.0.1:${address.port}`;
      const routes = await loadRoutes(rootDirectory, profile.basePath);
      for (const route of routes) {
        const context = await browser.newContext({ serviceWorkers: "block" });
        const page = await context.newPage();
        const responses = [];
        page.on("response", (response) => responses.push(response));
        const navigation = await page.goto(`${origin}${route.pathname}`, { waitUntil: "networkidle" });
        if (!navigation || ![200, 404].includes(navigation.status())) {
          throw new Error(`${profile.name} ${route.pathname}: unexpected navigation status ${navigation?.status()}`);
        }
        const resources = await Promise.all(responses.map(async (response) => {
          const body = await response.body();
          return {
            url: response.url(),
            kind: response.request().resourceType(),
            rawBytes: body.byteLength,
            gzipBytes: gzipSync(body).byteLength,
          };
        }));
        const inlineStyles = await page.locator("style").allTextContents();
        for (const [index, css] of inlineStyles.entries()) {
          const body = Buffer.from(css);
          resources.push({
            url: `${origin}${route.pathname}#inline-style-${index}`,
            kind: "stylesheet",
            rawBytes: body.byteLength,
            gzipBytes: gzipSync(body).byteLength,
            includedInDocument: true,
          });
        }
        const report = evaluateTransferBudget({ route: route.pathname, origin, resources });
        reports.push({
          profile: profile.name,
          representative: route.id,
          ...report,
          resources: resources.map((resource) => ({
            ...resource,
            url: new URL(resource.url).pathname,
          })),
        });
        await context.close();
      }
    } finally {
      await close(server);
    }
  }
} finally {
  await browser.close();
}

const evidenceDirectory = path.resolve(".artifacts/quality");
await mkdir(evidenceDirectory, { recursive: true });
await writeFile(path.join(evidenceDirectory, "transfer.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  browser: chromium.name(),
  reports,
}, null, 2)}\n`);

const failed = reports.filter((report) => !report.pass);
if (failed.length > 0) {
  throw new Error(`Transfer budgets failed:\n${failed.map((report) =>
    `${report.profile} ${report.route}: ${report.failures.join(", ")}`).join("\n")}`);
}
console.log(`Transfer budgets pass for ${reports.length} representative profile routes.`);

function build(profile) {
  const result = spawnSync(process.execPath, ["scripts/build-publication.mjs", profile.name, profile.output], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function loadRoutes(rootDirectory, basePath) {
  const manifest = JSON.parse(await readFile(path.join(rootDirectory, "publication-manifest.json"), "utf8"));
  const htmlFiles = manifest.files.map((file) => file.path).filter((filename) => filename.endsWith(".html"));
  const files = new Map(await Promise.all(htmlFiles.map(async (filename) => [
    filename,
    await readFile(path.join(rootDirectory, filename), "utf8"),
  ])));
  return representativeRoutes(files, basePath);
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
