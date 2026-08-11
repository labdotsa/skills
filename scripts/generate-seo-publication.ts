import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { publicationProfile } from "../src/lib/config/publication-profile.js";
import { getCatalogSnapshot } from "../src/lib/server/content/index.js";
import { createSeoPublication } from "../src/lib/server/seo/publication.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [profileName, requestedOutput] = process.argv.slice(2);
const profile = publicationProfile(profileName);

if (!requestedOutput || (requestedOutput !== "site" && !requestedOutput.startsWith(".artifacts/"))) {
	throw new Error("A safe publication output directory is required");
}
if (requestedOutput.split(/[\\/]/).includes("..")) throw new Error("Publication output cannot escape its root");

const outputDirectory = path.join(repositoryRoot, requestedOutput);
await mkdir(outputDirectory, { recursive: true });
for (const filename of ["sitemap.xml", "robots.txt"] as const) {
	await rm(path.join(outputDirectory, filename), { force: true });
}

const files = createSeoPublication(await getCatalogSnapshot(), profile);
for (const [filename, file] of files) {
	await writeFile(path.join(outputDirectory, filename), file.body, "utf8");
}
