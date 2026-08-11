import { createRecipeIndexPageView } from "$lib/domain/directory.js";
import { getCatalogSnapshot } from "$lib/server/content/index.js";

export async function loadRecipeIndexPage() {
	const snapshot = await getCatalogSnapshot();
	return {
		catalogSnapshotId: snapshot.snapshotId,
		recipeIndex: createRecipeIndexPageView(snapshot.recipes),
	};
}
