import { getCatalogSnapshot } from "$lib/server/content/index.js";
import { createDirectoryPageView } from "$lib/domain/directory.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const snapshot = await getCatalogSnapshot();
	return {
		catalogSnapshotId: snapshot.snapshotId,
		directory: createDirectoryPageView(snapshot.skills, snapshot.recipes),
	};
};
