import type { OutlineItem } from "$lib/domain/rich-content.js";
import type { RecipeStage, RecipeStep } from "$lib/domain/catalog.js";
import { slugify } from "./classify-url.js";
import { contentError } from "./diagnostic.js";
import type { MdastNode } from "./parse-markdown.js";
import { plainText } from "./parse-markdown.js";

export function deriveRecipeStages(
	root: MdastNode,
	outline: readonly OutlineItem[],
	declaredLayers: readonly string[],
	sourcePath: string,
): readonly RecipeStage[] {
	let outlineIndex = 0;
	let current: { id: string; slug: string; title: string; steps: RecipeStep[] } | undefined;
	const stages: { id: string; slug: string; title: string; steps: RecipeStep[] }[] = [];

	for (const node of root.children ?? []) {
		if (node.type !== "heading" || typeof node.depth !== "number") continue;
		const outlineItem = outline[outlineIndex++];
		const text = plainText(node).trim();
		if (node.depth === 2 && text.startsWith("Conversation - ")) {
			const title = text.slice("Conversation - ".length).trim();
			current = { id: outlineItem.id, slug: slugify(title.replace(/\s+layer$/i, "")), title: title.replace(/\s+layer$/i, ""), steps: [] };
			stages.push(current);
			continue;
		}
		if (current && node.depth >= 3 && text.startsWith("Step - ")) {
			current.steps.push(Object.freeze({
				id: outlineItem.id,
				depth: node.depth as RecipeStep["depth"],
				title: text.slice("Step - ".length).trim(),
			}));
		}
	}

	const actualLayers = stages.map((stage) => stage.slug);
	if (JSON.stringify(actualLayers) !== JSON.stringify(declaredLayers)) {
		throw contentError(
			"RECIPE_STAGE_MISMATCH",
			sourcePath,
			`Declared conversation layers ${JSON.stringify(declaredLayers)} do not match Markdown stages ${JSON.stringify(actualLayers)}.`,
			"Make metadata.conversation-layers match the Conversation headings in source order.",
		);
	}
	return Object.freeze(stages.map((stage) => Object.freeze({ ...stage, steps: Object.freeze(stage.steps) })));
}
