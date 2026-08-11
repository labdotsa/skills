import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { publicationProfile } from "../src/lib/config/publication-profile.js";
import { getCatalogSnapshot } from "../src/lib/server/content/index.js";
import { createLlmPublication } from "../src/lib/server/llm/publication.js";
import { createSeoPublication } from "../src/lib/server/seo/publication.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [profileName, requestedOutput] = process.argv.slice(2);
const profile = publicationProfile(profileName);

if (!requestedOutput || (requestedOutput !== "site" && !requestedOutput.startsWith(".artifacts/"))) {
	throw new Error("A safe publication output directory is required");
}
if (requestedOutput.split(/[\\/]/).includes("..")) throw new Error("Publication output cannot escape its root");

const outputDirectory = path.join(repositoryRoot, requestedOutput);
const snapshot = await getCatalogSnapshot();
const removablePaths = [
	"sitemap.xml",
	"robots.txt",
	"llms.txt",
	"llms-full.txt",
	"skills.json",
	"recipes.json",
	"LICENSE.txt",
	...snapshot.publication.map((identity) => identity.markdownPath),
];
for (const filename of removablePaths) await rm(outputPath(filename), { force: true });

const seoFiles = createSeoPublication(snapshot, profile);
const llmFiles = createLlmPublication(snapshot, profile);
const files = new Map([...seoFiles, ...llmFiles]);
if (files.size !== seoFiles.size + llmFiles.size) {
	throw new Error("Machine publication paths collide");
}
for (const [filename, file] of files) {
	const pathname = outputPath(filename);
	await mkdir(path.dirname(pathname), { recursive: true });
	await writeFile(pathname, file.body);
}

function outputPath(filename: string) {
	if (path.isAbsolute(filename) || filename.split(/[\\/]/).includes("..")) {
		throw new Error(`Unsafe machine publication path: ${filename}`);
	}
	const pathname = path.resolve(outputDirectory, filename);
	if (pathname !== outputDirectory && !pathname.startsWith(`${outputDirectory}${path.sep}`)) {
		throw new Error(`Machine publication path escapes output: ${filename}`);
	}
	return pathname;
}
