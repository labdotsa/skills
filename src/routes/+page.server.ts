import { getCatalogSnapshot } from "$lib/server/content/index.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const snapshot = await getCatalogSnapshot();
	return {
		catalogSnapshotId: snapshot.snapshotId,
		catalogSummary: snapshot.catalogSummary(),
	};
};
