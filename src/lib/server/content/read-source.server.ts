import { createHash } from "node:crypto";
import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import type {
	DiscoveredRecipeSource,
	DiscoveredSkillSource,
	SourceCorpus,
	SourceFile,
} from "$lib/domain/content.js";
import { contentError } from "./diagnostic.js";

type ReadSourceOptions = Readonly<{
	repositoryRoot: string;
	onRead?: (relativePath: string) => void;
}>;

type PendingPrimary = Readonly<{
	kind: "license" | "recipe" | "skill";
	slug: string;
	relativePath: string;
	packageFiles?: readonly string[];
}>;

const compareCodePoints = (left: string, right: string) => (left < right ? -1 : left > right ? 1 : 0);

export async function readSourceCorpus(options: ReadSourceOptions): Promise<SourceCorpus> {
	const repositoryRoot = path.resolve(options.repositoryRoot);
	const canonicalRoot = await realpath(repositoryRoot).catch(() => {
		throw contentError("SOURCE_UNREADABLE", ".", "Repository root cannot be read.", "Pass an existing repository root.");
	});
	const pending: PendingPrimary[] = [
		{ kind: "license", slug: "license", relativePath: "LICENSE" },
	];

	for (const kind of ["recipe", "skill"] as const) {
		const collection = kind === "skill" ? "skills" : "recipes";
		const collectionPath = path.join(repositoryRoot, collection);
		const entries = await readdir(collectionPath, { withFileTypes: true }).catch((cause) => {
			throw contentError(
				"SOURCE_UNREADABLE",
				collection,
				`Public ${collection} directory cannot be read: ${cause instanceof Error ? cause.message : String(cause)}`,
				`Create a readable ${collection}/ directory.`,
			);
		});

		for (const entry of entries.sort((left, right) => compareCodePoints(left.name, right.name))) {
			const entryPath = path.join(collectionPath, entry.name);
			const relativeEntryPath = path.posix.join(collection, entry.name);
			if (entry.isSymbolicLink()) {
				throw contentError(
					"SOURCE_SPECIAL_FILE",
					relativeEntryPath,
					"Symbolic links are not allowed in the public corpus.",
					"Replace the link with regular files inside the owning package.",
				);
			}
			if (!entry.isDirectory()) continue;

			const primaryName = kind === "skill" ? "SKILL.md" : "RECIPE.md";
			const primaryPath = path.join(entryPath, primaryName);
			let primaryStat;
			try {
				primaryStat = await lstat(primaryPath);
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
				throw contentError(
					"SOURCE_UNREADABLE",
					path.posix.join(relativeEntryPath, primaryName),
					"Primary source cannot be inspected.",
					"Make the source file readable.",
				);
			}
			if (!primaryStat.isFile()) {
				throw contentError(
					"SOURCE_SPECIAL_FILE",
					path.posix.join(relativeEntryPath, primaryName),
					"Primary source must be a regular file.",
					"Replace it with a regular Markdown file.",
				);
			}

			const packageFiles = kind === "skill" ? await inventoryPackage(entryPath, "", relativeEntryPath, canonicalRoot) : undefined;
			pending.push({
				kind,
				slug: entry.name,
				relativePath: path.posix.join(relativeEntryPath, primaryName),
				packageFiles,
			});
		}
	}

	pending.sort((left, right) => compareCodePoints(left.relativePath, right.relativePath));
	const sources = new Map<string, SourceFile>();
	for (const item of pending) {
		sources.set(
			item.relativePath,
			await readExactSource(repositoryRoot, canonicalRoot, item.relativePath, options.onRead),
		);
	}

	const skills: DiscoveredSkillSource[] = pending
		.filter((item) => item.kind === "skill")
		.map((item) => Object.freeze({
			slug: item.slug,
			source: sources.get(item.relativePath)!,
			packageFiles: Object.freeze([...(item.packageFiles ?? [])]),
		}));
	const recipes: DiscoveredRecipeSource[] = pending
		.filter((item) => item.kind === "recipe")
		.map((item) => Object.freeze({ slug: item.slug, source: sources.get(item.relativePath)! }));

	return Object.freeze({
		license: sources.get("LICENSE")!,
		skills: Object.freeze(skills),
		recipes: Object.freeze(recipes),
	});
}

async function inventoryPackage(
	directory: string,
	packagePrefix: string,
	repositoryPrefix: string,
	canonicalRoot: string,
): Promise<readonly string[]> {
	const files: string[] = [];
	const entries = await readdir(directory, { withFileTypes: true });
	for (const entry of entries.sort((left, right) => compareCodePoints(left.name, right.name))) {
		const absolutePath = path.join(directory, entry.name);
		const packagePath = path.posix.join(packagePrefix, entry.name);
		const relativePath = path.posix.join(repositoryPrefix, packagePath);
		if (entry.isSymbolicLink()) {
			throw contentError(
				"SOURCE_SPECIAL_FILE",
				relativePath,
				"Symbolic links are not allowed in a public Skill package.",
				"Replace the link with a regular file inside the package.",
			);
		}
		if (entry.isDirectory()) {
			files.push(...(await inventoryPackage(absolutePath, packagePath, repositoryPrefix, canonicalRoot)));
			continue;
		}
		if (!entry.isFile()) {
			throw contentError(
				"SOURCE_SPECIAL_FILE",
				relativePath,
				"Only regular files and directories are allowed in a public Skill package.",
				"Remove the special filesystem entry.",
			);
		}
		await assertContained(absolutePath, canonicalRoot, relativePath);
		files.push(packagePath);
	}
	return files.sort((left, right) => {
		if (left === "SKILL.md") return -1;
		if (right === "SKILL.md") return 1;
		return compareCodePoints(left, right);
	});
}

async function readExactSource(
	repositoryRoot: string,
	canonicalRoot: string,
	relativePath: string,
	onRead?: (relativePath: string) => void,
): Promise<SourceFile> {
	const absolutePath = path.join(repositoryRoot, ...relativePath.split("/"));
	await assertContained(absolutePath, canonicalRoot, relativePath);
	onRead?.(relativePath);
	const bytes = await readFile(absolutePath).catch((cause) => {
		throw contentError(
			"SOURCE_UNREADABLE",
			relativePath,
			`Source cannot be read: ${cause instanceof Error ? cause.message : String(cause)}`,
			"Make the file readable and try again.",
		);
	});
	if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
		throw contentError("SOURCE_BOM", relativePath, "UTF-8 BOM is not allowed.", "Save the file as UTF-8 without a BOM.");
	}
	if (bytes.includes(0)) {
		throw contentError("SOURCE_NUL", relativePath, "NUL bytes are not allowed.", "Remove binary data from the text source.");
	}
	let text: string;
	try {
		text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch {
		throw contentError("SOURCE_INVALID_UTF8", relativePath, "Source is not valid UTF-8.", "Save the file as valid UTF-8.");
	}
	const exactBytes = new Uint8Array(bytes);
	return Object.freeze({
		relativePath,
		get bytes() {
			return new Uint8Array(exactBytes);
		},
		text,
		contentDigest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
	});
}

async function assertContained(absolutePath: string, canonicalRoot: string, relativePath: string) {
	const canonicalPath = await realpath(absolutePath).catch(() => {
		throw contentError("SOURCE_UNREADABLE", relativePath, "Source path cannot be resolved.", "Create a readable regular file.");
	});
	if (canonicalPath !== canonicalRoot && !canonicalPath.startsWith(`${canonicalRoot}${path.sep}`)) {
		throw contentError(
			"SOURCE_OUTSIDE_ROOT",
			relativePath,
			"Source resolves outside the repository root.",
			"Keep public source files inside the repository.",
		);
	}
}
