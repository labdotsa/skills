import type { RecipePageView, SkillPageView } from "./catalog.js";
import type { DirectoryPageView, RecipeIndexPageView } from "./directory.js";

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | readonly JsonValue[] | Readonly<{ [key: string]: JsonValue }>;
export type StructuredData = Readonly<{
	"@context": "https://schema.org";
	"@graph": readonly Readonly<Record<string, JsonValue>>[];
}>;

export type SeoPage = Readonly<{
	title: string;
	description: string;
	canonicalUrl?: string;
	alternate?: Readonly<{ type: "text/markdown"; href: string }>;
	robots: "index,follow" | "noindex,follow";
	openGraph: Readonly<{
		title: string;
		description: string;
		type: "website" | "article";
		url?: string;
		image: string;
		imageAlt: string;
		siteName: "LAB Skills";
	}>;
	twitter: Readonly<{
		card: "summary_large_image";
		title: string;
		description: string;
		image: string;
	}>;
	structuredData?: StructuredData;
}>;

const siteName = "LAB Skills" as const;
const socialImage = "https://skills.lab.sa/brand/social.png" as const;
const socialImageAlt = "LAB Skills — public agent protocols and delivery playbooks" as const;

const homeTitle = "LAB Skills — Public agent protocols";
const homeDescription = "Reusable instructions shaped by how LAB researches, designs, develops, and markets digital products.";
const recipeIndexTitle = "LAB Recipes — Skills assembled into delivery workflows";
const recipeIndexDescription = "Repeatable delivery recipes with focused prompts, skills, artifacts, and deliberate handoffs.";

export function homeSeo(directory: DirectoryPageView, canonicalOrigin: string, indexable: boolean): SeoPage {
	const canonicalUrl = canonicalUrlFor(canonicalOrigin, "/");
	const listId = `${canonicalUrl}#skills`;
	return createSeoPage({
		title: homeTitle,
		description: homeDescription,
		canonicalUrl,
		indexable,
		type: "website",
		structuredData: {
			"@context": "https://schema.org",
			"@graph": [
				{ "@type": "WebSite", "@id": `${canonicalUrl}#website`, name: siteName, url: canonicalUrl },
				{
					"@type": "CollectionPage",
					"@id": canonicalUrl,
					url: canonicalUrl,
					name: homeTitle,
					description: homeDescription,
					isPartOf: { "@id": `${canonicalUrl}#website` },
					mainEntity: { "@id": listId },
				},
				itemList(
					listId,
					"LAB Skills catalog",
					directory.skills.map((skill) => ({
						name: skill.title,
						url: canonicalUrlFor(canonicalOrigin, `/skills/${encodeURIComponent(skill.slug)}/`),
					})),
				),
			],
		},
	});
}

export function recipeIndexSeo(index: RecipeIndexPageView, canonicalOrigin: string, indexable: boolean): SeoPage {
	const canonicalUrl = canonicalUrlFor(canonicalOrigin, "/recipes/");
	const listId = `${canonicalUrl}#recipes`;
	return createSeoPage({
		title: recipeIndexTitle,
		description: recipeIndexDescription,
		canonicalUrl,
		indexable,
		type: "website",
		structuredData: {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "CollectionPage",
					"@id": canonicalUrl,
					url: canonicalUrl,
					name: recipeIndexTitle,
					description: recipeIndexDescription,
					mainEntity: { "@id": listId },
				},
				itemList(
					listId,
					"LAB Recipes catalog",
					index.recipes.map((recipe) => ({
						name: recipe.title,
						url: canonicalUrlFor(canonicalOrigin, `/recipes/${encodeURIComponent(recipe.slug)}/`),
					})),
				),
			],
		},
	});
}

export function skillSeo(skill: SkillPageView, canonicalOrigin: string, indexable: boolean): SeoPage {
	const canonicalUrl = canonicalUrlFor(canonicalOrigin, `/skills/${encodeURIComponent(skill.slug)}/`);
	const title = `${skill.name} — LAB Skills`;
	return createSeoPage({
		title,
		description: skill.description,
		canonicalUrl,
		alternate: markdownAlternate(canonicalUrl),
		indexable,
		type: "article",
		structuredData: skillStructuredData(skill, canonicalUrl, canonicalOrigin),
	});
}

export function recipeSeo(recipe: RecipePageView, canonicalOrigin: string, indexable: boolean): SeoPage {
	const canonicalUrl = canonicalUrlFor(canonicalOrigin, `/recipes/${encodeURIComponent(recipe.slug)}/`);
	const title = `${recipe.title} Recipe — LAB Skills`;
	const breadcrumbId = `${canonicalUrl}#breadcrumb`;
	return createSeoPage({
		title,
		description: recipe.description,
		canonicalUrl,
		alternate: markdownAlternate(canonicalUrl),
		indexable,
		type: "article",
		structuredData: {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": canonicalUrl,
					url: canonicalUrl,
					name: recipe.title,
					description: recipe.description,
					breadcrumb: { "@id": breadcrumbId },
				},
				{
					"@type": "BreadcrumbList",
					"@id": breadcrumbId,
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "LAB Recipes",
							item: canonicalUrlFor(canonicalOrigin, "/recipes/"),
						},
						{ "@type": "ListItem", position: 2, name: recipe.title, item: canonicalUrl },
					],
				},
			],
		},
	});
}

export function notFoundSeo(): SeoPage {
	return createSeoPage({
		title: "Page not found — LAB Skills",
		description: "The requested LAB Skills page does not exist.",
		indexable: false,
		type: "website",
	});
}

export function serializeJsonLd(value: JsonValue): string {
	return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => {
		switch (character) {
			case "<": return "\\u003c";
			case ">": return "\\u003e";
			case "&": return "\\u0026";
			case "\u2028": return "\\u2028";
			default: return "\\u2029";
		}
	});
}

function skillStructuredData(skill: SkillPageView, canonicalUrl: string, canonicalOrigin: string): StructuredData {
	const sourceId = `${canonicalUrl}#software-source`;
	const breadcrumbId = `${canonicalUrl}#breadcrumb`;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": canonicalUrl,
				url: canonicalUrl,
				name: skill.name,
				description: skill.description,
				breadcrumb: { "@id": breadcrumbId },
				mainEntity: { "@id": sourceId },
			},
			{
				"@type": "BreadcrumbList",
				"@id": breadcrumbId,
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: siteName, item: canonicalUrlFor(canonicalOrigin, "/") },
					{ "@type": "ListItem", position: 2, name: skill.name, item: canonicalUrl },
				],
			},
			{
				"@type": "SoftwareSourceCode",
				"@id": sourceId,
				name: skill.name,
				description: skill.description,
				url: canonicalUrl,
				codeRepository: skill.sourceUrl,
			},
		],
	};
}

function itemList(id: string, name: string, entries: readonly Readonly<{ name: string; url: string }>[]) {
	return {
		"@type": "ItemList",
		"@id": id,
		name,
		numberOfItems: entries.length,
		itemListElement: entries.map((entry, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: entry.name,
			url: entry.url,
		})),
	};
}

function createSeoPage(input: Readonly<{
	title: string;
	description: string;
	canonicalUrl?: string;
	alternate?: Readonly<{ type: "text/markdown"; href: string }>;
	indexable: boolean;
	type: "website" | "article";
	structuredData?: StructuredData;
}>): SeoPage {
	return deepFreeze({
		title: input.title,
		description: input.description,
		...(input.canonicalUrl ? { canonicalUrl: input.canonicalUrl } : {}),
		...(input.alternate ? { alternate: input.alternate } : {}),
		robots: input.indexable ? "index,follow" : "noindex,follow",
		openGraph: {
			title: input.title,
			description: input.description,
			type: input.type,
			...(input.canonicalUrl ? { url: input.canonicalUrl } : {}),
			image: socialImage,
			imageAlt: socialImageAlt,
			siteName,
		},
		twitter: {
			card: "summary_large_image",
			title: input.title,
			description: input.description,
			image: socialImage,
		},
		...(input.indexable && input.structuredData ? { structuredData: input.structuredData } : {}),
	});
}

function markdownAlternate(canonicalUrl: string) {
	return Object.freeze({ type: "text/markdown" as const, href: new URL("index.md", canonicalUrl).href });
}

function canonicalUrlFor(origin: string, pathname: string) {
	const parsed = new URL(origin);
	if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash) {
		throw new Error(`Invalid canonical origin: ${origin}`);
	}
	return new URL(pathname, `${parsed.origin}/`).href;
}

function deepFreeze<T>(value: T): T {
	if (value && typeof value === "object" && !Object.isFrozen(value)) {
		Object.freeze(value);
		for (const child of Object.values(value)) deepFreeze(child);
	}
	return value;
}
