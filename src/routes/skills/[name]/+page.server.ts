import { error } from "@sveltejs/kit";
import { getCatalogSnapshot } from "$lib/server/content/index.js";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = async () => [...(await getCatalogSnapshot()).skillEntries()];

export const load: PageServerLoad = async ({ params }) => {
	const snapshot = await getCatalogSnapshot();
	let page;
	try {
		page = snapshot.skillPage(params.name);
	} catch {
		error(404, "Skill not found");
	}
	return {
		page,
		sourceUrl: `https://github.com/labdotsa/skills/tree/master/skills/${encodeURIComponent(params.name)}`,
	};
};
