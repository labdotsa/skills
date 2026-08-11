import { publicationProfile } from "$lib/config/publication-profile";
import { PUBLICATION_PROFILE } from "$env/static/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => ({
	publication: publicationProfile(PUBLICATION_PROFILE),
});
