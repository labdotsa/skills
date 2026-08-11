import { error } from "@sveltejs/kit";
import { getCatalogSnapshot } from "$lib/server/content/index.js";

export async function loadRecipePage(slug: string) {
	const snapshot = await getCatalogSnapshot();
	try {
		return {
			page: snapshot.recipePage(slug),
			catalogSnapshotId: snapshot.snapshotId,
		};
	} catch {
		error(404, "Recipe not found");
	}
}
