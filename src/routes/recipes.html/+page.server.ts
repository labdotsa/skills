import { loadRecipeIndexPage } from "$lib/server/pages/recipe-index-page.server.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = loadRecipeIndexPage;
