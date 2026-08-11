import { getCatalogSnapshot } from "$lib/server/content/index.js";
import { loadRecipePage } from "$lib/server/pages/recipe-page.server.js";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = async () => [...(await getCatalogSnapshot()).recipeEntries()];

export const load: PageServerLoad = ({ params }) => loadRecipePage(params.slug);
