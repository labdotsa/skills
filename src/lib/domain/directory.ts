import type { RecipeEntry, SkillEntry } from "./catalog.js";

export type DirectoryKind = "skills" | "recipes";
export type DirectoryPillar = "research" | "design" | "development" | "marketing";

export type DirectoryPillarCount = Readonly<{
	pillar: DirectoryPillar;
	count: number;
}>;

const directoryPillars = ["research", "design", "development", "marketing"] as const;

type DirectoryItemBase = Readonly<{
	kind: "skill" | "recipe";
	slug: string;
	title: string;
	description: string;
	category: string;
	pillar: DirectoryPillar;
}>;

export type SkillDirectoryItem = DirectoryItemBase & Readonly<{
	kind: "skill";
	files: readonly string[];
}>;

export type RecipeDirectoryItem = DirectoryItemBase & Readonly<{
	kind: "recipe";
	status: "draft" | "stable";
	conversations: number;
	phases: readonly string[];
}>;

export type DirectoryItem = SkillDirectoryItem | RecipeDirectoryItem;

export type DirectoryPageView = Readonly<{
	skills: readonly SkillDirectoryItem[];
	recipes: readonly RecipeDirectoryItem[];
}>;

export type RecipeIndexPageView = Readonly<{
	recipes: readonly RecipeDirectoryItem[];
}>;

export type DirectoryCollection = Readonly<{
	kind: DirectoryKind;
	items: readonly DirectoryItem[];
}>;

export type DirectoryFilter = Readonly<{
	query: string;
	category: string;
}>;

export type DirectoryCategory = Readonly<{
	value: string;
	label: string;
	count: number;
}>;

const categoryLabels: Readonly<Record<string, string>> = Object.freeze({
	all: "All",
	content: "Content",
	delivery: "Delivery",
	design: "Design",
	engineering: "Engineering",
	frontend: "Frontend",
	general: "General",
	growth: "Growth",
	integrations: "Integrations",
	marketing: "Marketing",
	product: "Product",
	"product-delivery": "Product delivery",
});

export function createDirectoryPageView(
	skills: readonly SkillEntry[],
	recipes: readonly RecipeEntry[],
): DirectoryPageView {
	return deepFreeze({
		skills: skills.map((skill) => ({
			kind: "skill" as const,
			slug: skill.slug,
			title: skill.name,
			description: skill.description,
			category: skill.category,
			pillar: pillarForCategory(skill.category),
			files: [...skill.packageFiles],
		})),
		recipes: createRecipeDirectoryItems(recipes),
	});
}

export function createRecipeIndexPageView(recipes: readonly RecipeEntry[]): RecipeIndexPageView {
	return deepFreeze({ recipes: createRecipeDirectoryItems(recipes) });
}

export function filterDirectoryItems<T extends DirectoryItem>(
	items: readonly T[],
	filter: DirectoryFilter,
): readonly T[] {
	const query = filter.query.trim().toLocaleLowerCase("en-US");
	return items.filter((item) => {
		if (filter.category !== "all" && item.category !== filter.category) return false;
		if (query.length === 0) return true;
		const details = item.kind === "skill"
			? item.files.join(" ")
			: `${item.status} ${item.conversations} ${item.phases.join(" ")}`;
		return `${item.title} ${item.description} ${item.category} ${details}`
			.toLocaleLowerCase("en-US")
			.includes(query);
	});
}

export function directoryCategories(items: readonly DirectoryItem[]): readonly DirectoryCategory[] {
	const counts = new Map<string, number>();
	for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
	return Object.freeze([
		Object.freeze({ value: "all", label: "All", count: items.length }),
		...[...counts.entries()]
			.sort(([left], [right]) => compareCodePoints(left, right))
			.map(([value, count]) => Object.freeze({ value, label: labelForCategory(value), count })),
	]);
}

export function labelForCategory(category: string) {
	return categoryLabels[category] ?? category.replaceAll("-", " ");
}

export function pillarForCategory(category: string): DirectoryPillar {
	if (category === "design") return "design";
	if (["frontend", "integrations", "engineering", "delivery"].includes(category)) return "development";
	if (["content", "growth", "marketing"].includes(category)) return "marketing";
	return "research";
}

export function countSkillPillars(
	skills: readonly Pick<SkillEntry, "category">[],
): readonly DirectoryPillarCount[] {
	const counts = new Map<DirectoryPillar, number>(
		directoryPillars.map((pillar) => [pillar, 0]),
	);
	for (const skill of skills) {
		const pillar = pillarForCategory(skill.category);
		counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
	}
	return Object.freeze(
		directoryPillars.map((pillar) => Object.freeze({ pillar, count: counts.get(pillar) ?? 0 })),
	);
}

function compareCodePoints(left: string, right: string) {
	return left < right ? -1 : left > right ? 1 : 0;
}

function createRecipeDirectoryItems(recipes: readonly RecipeEntry[]): readonly RecipeDirectoryItem[] {
	return recipes.map((recipe) => ({
		kind: "recipe" as const,
		slug: recipe.slug,
		title: recipe.title,
		description: recipe.description,
		category: recipe.category,
		pillar: pillarForCategory(recipe.category),
		status: recipe.status,
		conversations: recipe.stages.length,
		phases: recipe.stages.map((stage) => stage.title),
	}));
}

function deepFreeze<T>(value: T): T {
	if (value && typeof value === "object" && !Object.isFrozen(value)) {
		Object.freeze(value);
		for (const child of Object.values(value)) deepFreeze(child);
	}
	return value;
}
