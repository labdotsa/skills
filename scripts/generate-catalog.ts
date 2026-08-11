import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { buildCatalogSnapshot } from "../src/lib/server/content/build-catalog.server.js";
import { projectDocumentationCatalog } from "../src/lib/server/content/projections.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(repositoryRoot, "docs", "catalog.md");
const checkOnly = process.argv.includes("--check");
const snapshot = await buildCatalogSnapshot({ repositoryRoot });
const generatedCatalog = projectDocumentationCatalog(snapshot);

if (checkOnly) {
	const currentCatalog = await readFile(catalogPath, "utf8");
	if (currentCatalog !== generatedCatalog) {
		console.error("docs/catalog.md is stale. Run `npm run catalog`.");
		process.exit(1);
	}
	console.log("Skill catalog is current.");
} else {
	await writeFile(catalogPath, generatedCatalog);
	console.log(`Wrote ${path.relative(repositoryRoot, catalogPath)} from ${snapshot.snapshotId}.`);
}
