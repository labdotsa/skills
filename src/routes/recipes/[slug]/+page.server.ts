import { error } from "@sveltejs/kit";
import { getCatalogSnapshot } from "$lib/server/content/index.js";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = async () => [...(await getCatalogSnapshot()).recipeEntries()];

export const load: PageServerLoad = async ({ params }) => {
	const snapshot = await getCatalogSnapshot();
	let page;
	try {
		page = snapshot.recipePage(params.slug);
	} catch {
		error(404, "Recipe not found");
	}
	return {
		page,
		sourceUrl: `https://github.com/labdotsa/skills/blob/master/recipes/${encodeURIComponent(params.slug)}/RECIPE.md`,
	};
};
