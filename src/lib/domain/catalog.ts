import type { SourceFile } from "./content.js";
import type { OutlineItem, RichDocument } from "./rich-content.js";

export type ResourceCounts = Readonly<{
	references: number;
	scripts: number;
	assets: number;
	evals: number;
}>;

export type RecipeStep = Readonly<{
	id: string;
	depth: 3 | 4 | 5 | 6;
	title: string;
}>;

export type RecipeStage = Readonly<{
	id: string;
	slug: string;
	title: string;
	steps: readonly RecipeStep[];
}>;

export type SkillRequirement =
	| Readonly<{ kind: "local"; name: string; skillId: string; source: "labdotsa/skills"; url: string }>
	| Readonly<{ kind: "external"; name: string; source: string; url: string }>
	| Readonly<{ kind: "builtin"; name: string; source: string; availability: "built-in" }>;

type EntryBase = Readonly<{
	kind: "skill" | "recipe";
	slug: string;
	name: string;
	title: string;
	description: string;
	category: string;
	source: SourceFile;
	document: RichDocument;
	outline: readonly OutlineItem[];
}>;

export type SkillEntry = EntryBase & Readonly<{
	kind: "skill";
	lifecycle: "stable";
	license?: string;
	compatibility?: string;
	metadata: Readonly<Record<string, string>>;
	allowedTools?: string;
	extensions: Readonly<Record<string, unknown>>;
	packageFiles: readonly string[];
	resourceCounts: ResourceCounts;
}>;

export type RecipeEntry = EntryBase & Readonly<{
	kind: "recipe";
	status: "draft" | "stable";
	author: string;
	outcome: string;
	stages: readonly RecipeStage[];
	skillRequirements: readonly SkillRequirement[];
}>;

export type CatalogEntry = SkillEntry | RecipeEntry;

export type RelatedEntry = Readonly<{
	kind: "skill" | "recipe";
	slug: string;
	title: string;
	description: string;
	category: string;
}>;

export type SkillPackageFile = Readonly<{
	path: string;
	kind: "root" | "reference" | "support";
	sourceUrl: string;
}>;

export type SkillPageView = Readonly<{
	kind: "skill";
	slug: string;
	name: string;
	title: string;
	description: string;
	category: string;
	lifecycle: "stable";
	license?: string;
	compatibility?: string;
	allowedTools?: string;
	metadata: Readonly<Record<string, string>>;
	installCommand: string;
	sourceUrl: string;
	fileUrl: string;
	packageFiles: readonly SkillPackageFile[];
	resourceCounts: ResourceCounts;
	document: RichDocument;
	outline: readonly OutlineItem[];
	relatedRecipes: readonly RelatedEntry[];
	recommendedSkills: readonly RelatedEntry[];
	related: readonly RelatedEntry[];
}>;

export type RecipePageView = Readonly<{
	kind: "recipe";
	slug: string;
	name: string;
	title: string;
	description: string;
	category: string;
	status: "draft" | "stable";
	author: string;
	outcome: string;
	document: RichDocument;
	outline: readonly OutlineItem[];
	stages: readonly RecipeStage[];
	skillRequirements: readonly SkillRequirement[];
	localSkills: readonly RelatedEntry[];
	recommendedRecipes: readonly RelatedEntry[];
}>;
