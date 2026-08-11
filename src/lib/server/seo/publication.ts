import type { PublicationProfile } from "$lib/config/publication-profile.js";
import type { CatalogSnapshot } from "$lib/server/content/build-catalog.server.js";

export type SeoPublicationFile = Readonly<{
	contentType: "application/xml; charset=utf-8" | "text/plain; charset=utf-8";
	body: string;
}>;

export function createSeoPublication(
	snapshot: CatalogSnapshot,
	profile: PublicationProfile,
): ReadonlyMap<"sitemap.xml" | "robots.txt", SeoPublicationFile> {
	if (!profile.publishMachineSurfaces) return new Map();

	const skillUrls = snapshot.publication
		.filter((identity) => identity.kind === "skill")
		.map((identity) => identity.canonicalUrl);
	const recipeUrls = snapshot.publication
		.filter((identity) => identity.kind === "recipe")
		.map((identity) => identity.canonicalUrl);
	const urls = [
		`${profile.canonicalOrigin}/`,
		...skillUrls,
		`${profile.canonicalOrigin}/recipes/`,
		...recipeUrls,
	];

	return new Map<"sitemap.xml" | "robots.txt", SeoPublicationFile>([
		["sitemap.xml", Object.freeze({
			contentType: "application/xml; charset=utf-8" as const,
			body: sitemap(urls),
		})],
		["robots.txt", Object.freeze({
			contentType: "text/plain; charset=utf-8" as const,
			body: `User-agent: *\nAllow: /\nSitemap: ${profile.canonicalOrigin}/sitemap.xml\n`,
		})],
	]);
}

function sitemap(urls: readonly string[]) {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
		"</urlset>",
		"",
	].join("\n");
}

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
