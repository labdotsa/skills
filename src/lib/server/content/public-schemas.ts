import { z } from "zod";

const absoluteHttpsUrl = z.url().refine((value) => value.startsWith("https://"), "must be an absolute HTTPS URL");
const digest = z.string().regex(/^sha256:[0-9a-f]{64}$/);
const licenseExpression = z.literal("MIT");
const licenseUrl = z.literal("https://skills.lab.sa/LICENSE.txt");
const resources = z.object({ references: z.int().nonnegative(), scripts: z.int().nonnegative(), assets: z.int().nonnegative(), evals: z.int().nonnegative() }).strict();

const commonItem = {
	index: z.int().positive(),
	id: absoluteHttpsUrl,
	description: z.string().min(1),
	category: z.string().min(1),
	canonicalUrl: absoluteHttpsUrl,
	markdownUrl: absoluteHttpsUrl,
	sourceUrl: absoluteHttpsUrl,
	licenseExpression,
	licenseUrl,
	contentDigest: digest,
};

export const skillCatalogItemSchema = z.object({
	index: commonItem.index,
	id: commonItem.id,
	kind: z.literal("skill"),
	name: z.string().min(1),
	description: commonItem.description,
	category: commonItem.category,
	files: z.array(z.string().min(1)),
	resources,
	detailUrl: z.string().startsWith("/skills/"),
	canonicalUrl: commonItem.canonicalUrl,
	markdownUrl: commonItem.markdownUrl,
	sourceUrl: commonItem.sourceUrl,
	fileUrl: absoluteHttpsUrl,
	licenseExpression,
	licenseUrl,
	contentDigest: digest,
}).strict();

export const recipeCatalogItemSchema = z.object({
	index: commonItem.index,
	id: commonItem.id,
	kind: z.literal("recipe"),
	slug: z.string().min(1),
	title: z.string().min(1),
	description: commonItem.description,
	category: commonItem.category,
	status: z.enum(["draft", "stable"]),
	conversations: z.int().positive(),
	relatedSkills: z.array(z.string().min(1)),
	detailUrl: z.string().startsWith("/recipes/"),
	canonicalUrl: commonItem.canonicalUrl,
	markdownUrl: commonItem.markdownUrl,
	sourceUrl: commonItem.sourceUrl,
	licenseExpression,
	licenseUrl,
	contentDigest: digest,
}).strict();

const catalogRoot = {
	schemaVersion: z.literal(2),
	siteUrl: z.literal("https://skills.lab.sa/"),
	repositoryUrl: z.literal("https://github.com/labdotsa/skills"),
	licenseExpression,
	licenseUrl,
};

export const skillCatalogV2Schema = z.object({
	...catalogRoot,
	installCommand: z.literal("npx skills add labdotsa/skills"),
	skills: z.array(skillCatalogItemSchema),
}).strict();

export const recipeCatalogV2Schema = z.object({
	...catalogRoot,
	recipes: z.array(recipeCatalogItemSchema),
}).strict();

export type SkillCatalogV2 = z.infer<typeof skillCatalogV2Schema>;
export type RecipeCatalogV2 = z.infer<typeof recipeCatalogV2Schema>;
