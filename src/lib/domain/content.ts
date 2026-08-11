export type ContentDigest = `sha256:${string}`;

export type SourceFile = Readonly<{
	relativePath: string;
	bytes: Uint8Array;
	text: string;
	contentDigest: ContentDigest;
}>;

export type DiscoveredSkillSource = Readonly<{
	slug: string;
	source: SourceFile;
	packageFiles: readonly string[];
}>;

export type DiscoveredRecipeSource = Readonly<{
	slug: string;
	source: SourceFile;
}>;

export type SourceCorpus = Readonly<{
	license: SourceFile;
	skills: readonly DiscoveredSkillSource[];
	recipes: readonly DiscoveredRecipeSource[];
}>;
