import { publicationProfile } from "$lib/config/publication-profile";
import { countSkillPillars } from "$lib/domain/directory.js";
import { getCatalogSnapshot } from "$lib/server/content/index.js";
import { PUBLICATION_PROFILE } from "$env/static/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	const snapshot = await getCatalogSnapshot();
	return {
		publication: publicationProfile(PUBLICATION_PROFILE),
		skillPillarCounts: countSkillPillars(snapshot.skills),
	};
};
