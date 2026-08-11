import { loadRecipePage } from "$lib/server/pages/recipe-page.server.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => loadRecipePage("functional-prototype");
