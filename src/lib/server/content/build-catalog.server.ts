import { createHash } from "node:crypto";
import type {
	RecipeEntry,
	RecipePageView,
	RelatedEntry,
	ResourceCounts,
	SkillEntry,
	SkillPageView,
} from "$lib/domain/catalog.js";
import type { DiscoveredRecipeSource, DiscoveredSkillSource, SourceFile } from "$lib/domain/content.js";
import { contentError } from "./diagnostic.js";
import { deriveRecipeStages } from "./derive-recipe.js";
import { parseFrontmatter } from "./parse-frontmatter.js";
import { parseMarkdown } from "./parse-markdown.js";
import { readSourceCorpus } from "./read-source.server.js";
import { resolveSkillRequirements } from "./resolve-relationships.js";
import { recipeSourceSchema, skillSourceSchema } from "./schemas.js";
import { toRichDocument } from "./to-rich-document.js";
import {
	projectRecipeCatalog,
	projectSkillCatalog,
	publicationIdentities,
	serializePublicJson,
	type PublicationIdentity,
} from "./projections.js";
import type { RecipeCatalogV2, SkillCatalogV2 } from "./public-schemas.js";

export type CatalogSnapshot = Readonly<{
	snapshotId: `sha256:${string}`;
	license: SourceFile;
	skills: readonly SkillEntry[];
	recipes: readonly RecipeEntry[];
	relationships: Readonly<{ skillToRecipes: Readonly<Record<string, readonly string[]>> }>;
	publication: readonly PublicationIdentity[];
	catalogSummary(): Readonly<{ skillCount: number; recipeCount: number }>;
	skillEntries(): readonly Readonly<{ name: string }>[];
	recipeEntries(): readonly Readonly<{ slug: string }>[];
	skillPage(slug: string, recommendationLimit?: number): SkillPageView;
	recipePage(slug: string, recommendationLimit?: number): RecipePageView;
	skillCatalogV2(): SkillCatalogV2;
	recipeCatalogV2(): RecipeCatalogV2;
	serializeSkillCatalogV2(): string;
	serializeRecipeCatalogV2(): string;
	markdownMirror(id: string): Readonly<{ bytes: Uint8Array; contentDigest: SourceFile["contentDigest"] }>;
	licenseMirror(): Readonly<{ bytes: Uint8Array; contentDigest: SourceFile["contentDigest"] }>;
}>;

export async function buildCatalogSnapshot(options: { repositoryRoot: string; onRead?: (relativePath: string) => void }): Promise<CatalogSnapshot> {
	const corpus = await readSourceCorpus(options);
	const skills = corpus.skills.map(buildSkill);
	const skillSlugs = new Set(skills.map((skill) => skill.slug));
	const recipes = corpus.recipes.map((recipe) => buildRecipe(recipe, skillSlugs));
	const skillToRecipes = Object.fromEntries(skills.map((skill) => [
		skill.slug,
		Object.freeze(recipes
			.filter((recipe) => recipe.skillRequirements.some((requirement) => requirement.kind === "local" && requirement.name === skill.slug))
			.map((recipe) => recipe.slug)),
	]));
	const publication = publicationIdentities(skills, recipes);
	const skillsBySlug = new Map(skills.map((skill) => [skill.slug, skill]));
	const recipesBySlug = new Map(recipes.map((recipe) => [recipe.slug, recipe]));
	const sourceById = new Map<string, SourceFile>([
		...skills.map((skill) => [`https://skills.lab.sa/skills/${encodeURIComponent(skill.slug)}/`, skill.source] as const),
		...recipes.map((recipe) => [`https://skills.lab.sa/recipes/${encodeURIComponent(recipe.slug)}/`, recipe.source] as const),
	]);
	let snapshot: CatalogSnapshot;
	snapshot = Object.freeze({
		snapshotId: snapshotDigest(corpus.license, skills, recipes),
		license: corpus.license,
		skills: Object.freeze(skills),
		recipes: Object.freeze(recipes),
		relationships: Object.freeze({ skillToRecipes: Object.freeze(skillToRecipes) }),
		publication,
		catalogSummary: () => Object.freeze({ skillCount: skills.length, recipeCount: recipes.length }),
		skillEntries: () => Object.freeze(skills.map((skill) => Object.freeze({ name: skill.slug }))),
		recipeEntries: () => Object.freeze(recipes.map((recipe) => Object.freeze({ slug: recipe.slug }))),
		skillPage: (slug, recommendationLimit = 3) => skillPage(skillsBySlug, recipesBySlug, skillToRecipes, slug, recommendationLimit),
		recipePage: (slug, recommendationLimit = 3) => recipePage(skillsBySlug, recipesBySlug, slug, recommendationLimit),
		skillCatalogV2: () => projectSkillCatalog(snapshot),
		recipeCatalogV2: () => projectRecipeCatalog(snapshot),
		serializeSkillCatalogV2: () => serializePublicJson(projectSkillCatalog(snapshot)),
		serializeRecipeCatalogV2: () => serializePublicJson(projectRecipeCatalog(snapshot)),
		markdownMirror: (id) => exactMirror(sourceById.get(id), id),
		licenseMirror: () => exactMirror(corpus.license, "LICENSE"),
	});
	return snapshot;
}

function exactMirror(source: SourceFile | undefined, id: string) {
	if (!source) {
		throw contentError("PUBLICATION_PATH", id, "No published Markdown source has this identity.", "Use an ID from the snapshot publication graph.");
	}
	return Object.freeze({ bytes: new Uint8Array(source.bytes), contentDigest: source.contentDigest });
}

function buildSkill(discovered: DiscoveredSkillSource): SkillEntry {
	const parsed = parseFrontmatter(discovered.source.text, discovered.source.relativePath);
	const input = parseSchema(skillSourceSchema, parsed.value, discovered.source.relativePath, "SKILL_SCHEMA");
	if (input.name !== discovered.slug) identityMismatch(discovered.source.relativePath, discovered.slug, input.name);
	const { name, description, license, compatibility, metadata, "allowed-tools": allowedTools, ...extensions } = input;
	const markdown = parseMarkdown(parsed.body, discovered.source.relativePath);
	const rich = toRichDocument(markdown.root, {
		sourcePath: discovered.source.relativePath,
		ownerDirectory: `skills/${discovered.slug}`,
		knownRepositoryPaths: new Set(discovered.packageFiles.map((file) => `skills/${discovered.slug}/${file}`)),
	});
	const resourceCounts = countResources(discovered.packageFiles);
	return Object.freeze({
		kind: "skill",
		slug: discovered.slug,
		name,
		title: markdown.title,
		description,
		category: metadata.category,
		lifecycle: "stable",
		...(license ? { license } : {}),
		...(compatibility ? { compatibility } : {}),
		metadata: Object.freeze({ ...metadata }),
		...(allowedTools ? { allowedTools } : {}),
		extensions: deepFreeze({ ...extensions }),
		packageFiles: discovered.packageFiles,
		resourceCounts,
		source: discovered.source,
		document: rich.document,
		outline: rich.outline,
	});
}

function countResources(files: readonly string[]): ResourceCounts {
	return Object.freeze({
		references: files.filter((file) => file.startsWith("references/")).length,
		scripts: files.filter((file) => file.startsWith("scripts/")).length,
		assets: files.filter((file) => file.startsWith("assets/")).length,
		evals: files.filter((file) => file.startsWith("evals/")).length,
	});
}

function skillPage(
	skillsBySlug: ReadonlyMap<string, SkillEntry>,
	recipesBySlug: ReadonlyMap<string, RecipeEntry>,
	skillToRecipes: Readonly<Record<string, readonly string[]>>,
	slug: string,
	recommendationLimit: number,
): SkillPageView {
	const skill = skillsBySlug.get(slug);
	if (!skill) missingEntry("skill", slug);
	const relatedRecipes = (skillToRecipes[slug] ?? []).map((recipeSlug) => related(recipesBySlug.get(recipeSlug)!));
	return deepFreeze({
		kind: "skill",
		slug: skill.slug,
		name: skill.name,
		title: skill.title,
		description: skill.description,
		category: skill.category,
		lifecycle: skill.lifecycle,
		...(skill.license ? { license: skill.license } : {}),
		...(skill.compatibility ? { compatibility: skill.compatibility } : {}),
		...(skill.allowedTools ? { allowedTools: skill.allowedTools } : {}),
		metadata: { ...skill.metadata },
		packageFiles: [...skill.packageFiles],
		resourceCounts: { ...skill.resourceCounts },
		document: skill.document,
		outline: skill.outline,
		relatedRecipes,
		recommendedSkills: recommendations([...skillsBySlug.values()], skill, recommendationLimit),
	});
}

function recipePage(
	skillsBySlug: ReadonlyMap<string, SkillEntry>,
	recipesBySlug: ReadonlyMap<string, RecipeEntry>,
	slug: string,
	recommendationLimit: number,
): RecipePageView {
	const recipe = recipesBySlug.get(slug);
	if (!recipe) missingEntry("recipe", slug);
	return deepFreeze({
		kind: "recipe",
		slug: recipe.slug,
		name: recipe.name,
		title: recipe.title,
		description: recipe.description,
		category: recipe.category,
		status: recipe.status,
		author: recipe.author,
		outcome: recipe.outcome,
		document: recipe.document,
		outline: recipe.outline,
		stages: recipe.stages,
		skillRequirements: recipe.skillRequirements,
		localSkills: recipe.skillRequirements.flatMap((requirement) =>
			requirement.kind === "local" ? [related(skillsBySlug.get(requirement.name)!)] : []),
		recommendedRecipes: recommendations([...recipesBySlug.values()], recipe, recommendationLimit),
	});
}

function recommendations<T extends SkillEntry | RecipeEntry>(entries: readonly T[], current: T, limit: number) {
	const safeLimit = Number.isInteger(limit) && limit >= 0 ? limit : 0;
	return entries
		.filter((entry) => entry.slug !== current.slug)
		.sort((left, right) => {
			const leftCategory = left.category === current.category ? 0 : 1;
			const rightCategory = right.category === current.category ? 0 : 1;
			return leftCategory - rightCategory || compareCodePoints(left.slug, right.slug);
		})
		.slice(0, safeLimit)
		.map(related);
}

function related(entry: SkillEntry | RecipeEntry): RelatedEntry {
	return Object.freeze({ kind: entry.kind, slug: entry.slug, title: entry.title, description: entry.description, category: entry.category });
}

function missingEntry(kind: "skill" | "recipe", slug: string): never {
	throw contentError("PUBLICATION_PATH", `${kind}:${slug}`, `No ${kind} has slug ${JSON.stringify(slug)}.`, `Use a slug from ${kind}Entries().`);
}

function snapshotDigest(license: SourceFile, skills: readonly SkillEntry[], recipes: readonly RecipeEntry[]) {
	const identity = JSON.stringify({
		version: 2,
		license: license.contentDigest,
		skills: skills.map((skill) => [skill.slug, skill.source.contentDigest, skill.packageFiles]),
		recipes: recipes.map((recipe) => [recipe.slug, recipe.source.contentDigest]),
	});
	return `sha256:${createHash("sha256").update(identity).digest("hex")}` as const;
}

function compareCodePoints(left: string, right: string) {
	return left < right ? -1 : left > right ? 1 : 0;
}

function deepFreeze<T>(value: T): T {
	if (value && typeof value === "object" && !Object.isFrozen(value)) {
		Object.freeze(value);
		for (const child of Object.values(value)) deepFreeze(child);
	}
	return value;
}

function buildRecipe(discovered: DiscoveredRecipeSource, skillSlugs: ReadonlySet<string>): RecipeEntry {
	const parsed = parseFrontmatter(discovered.source.text, discovered.source.relativePath);
	const input = parseSchema(recipeSourceSchema, parsed.value, discovered.source.relativePath, "RECIPE_SCHEMA");
	if (input.name !== discovered.slug) identityMismatch(discovered.source.relativePath, discovered.slug, input.name);
	const markdown = parseMarkdown(parsed.body, discovered.source.relativePath);
	const rich = toRichDocument(markdown.root, {
		sourcePath: discovered.source.relativePath,
		ownerDirectory: `recipes/${discovered.slug}`,
		knownRepositoryPaths: new Set([discovered.source.relativePath]),
	});
	const stages = deriveRecipeStages(
		markdown.root,
		rich.outline,
		input.metadata["conversation-layers"],
		discovered.source.relativePath,
	);
	const skillRequirements = resolveSkillRequirements(input.metadata.skills, skillSlugs, discovered.source.relativePath);
	return Object.freeze({
		kind: "recipe",
		slug: discovered.slug,
		name: input.name,
		title: markdown.title,
		description: input.description,
		category: input.metadata.category,
		status: input.metadata.status,
		author: input.metadata.author,
		outcome: input.metadata.outcome,
		source: discovered.source,
		document: rich.document,
		outline: rich.outline,
		stages,
		skillRequirements,
	});
}

function parseSchema<T>(
	schema: { safeParse(value: unknown): { success: true; data: T } | { success: false; error: { issues: readonly { path: PropertyKey[]; message: string }[] } } },
	value: unknown,
	sourcePath: string,
	code: string,
): T {
	const result = schema.safeParse(value);
	if (result.success) return result.data;
	const issue = result.error.issues[0];
	throw contentError(
		code,
		sourcePath,
		`${issue.path.join(".") || "frontmatter"}: ${issue.message}`,
		"Correct the named frontmatter field without relying on implicit coercion or fallback values.",
	);
}

function identityMismatch(sourcePath: string, slug: string, declaredName: string): never {
	throw contentError(
		"IDENTITY_MISMATCH",
		sourcePath,
		`Declared name ${JSON.stringify(declaredName)} does not match directory ${JSON.stringify(slug)}.`,
		"Make the frontmatter name exactly match its parent directory.",
	);
}
