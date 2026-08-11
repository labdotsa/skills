import { contentError } from "./diagnostic.js";
import type { SkillRequirement } from "$lib/domain/catalog.js";

type DeclaredRequirement = Readonly<{
	name: string;
	source: string;
	url?: string;
	availability?: "built-in";
}>;

export function resolveSkillRequirements(
	declared: readonly DeclaredRequirement[],
	skillSlugs: ReadonlySet<string>,
	sourcePath: string,
): readonly SkillRequirement[] {
	const seen = new Set<string>();
	return Object.freeze(declared.map((requirement) => {
		if (seen.has(requirement.name)) {
			throw contentError("RELATIONSHIP_DUPLICATE", sourcePath, `Skill requirement ${JSON.stringify(requirement.name)} is duplicated.`, "Keep each requirement once.");
		}
		seen.add(requirement.name);
		if (requirement.availability === "built-in") {
			return Object.freeze({ kind: "builtin", name: requirement.name, source: requirement.source, availability: "built-in" as const });
		}
		if (!requirement.url) {
			throw contentError("RELATIONSHIP_KIND", sourcePath, `Skill requirement ${JSON.stringify(requirement.name)} has no URL.`, "Add an explicit HTTPS URL or mark it built-in.");
		}
		const url = new URL(requirement.url);
		if (url.protocol !== "https:") {
			throw contentError("URL_UNSAFE_SCHEME", sourcePath, `Skill requirement ${JSON.stringify(requirement.name)} must use HTTPS.`, "Replace the URL with an explicit HTTPS URL.");
		}
		if (requirement.source === "labdotsa/skills") {
			if (!skillSlugs.has(requirement.name)) {
				throw contentError("RELATIONSHIP_MISSING", sourcePath, `Local Skill ${JSON.stringify(requirement.name)} does not exist.`, "Publish the Skill or correct the local requirement name.");
			}
			return Object.freeze({
				kind: "local",
				name: requirement.name,
				skillId: `https://skills.lab.sa/skills/${encodeURIComponent(requirement.name)}/`,
				source: "labdotsa/skills" as const,
				url: url.href,
			});
		}
		return Object.freeze({ kind: "external", name: requirement.name, source: requirement.source, url: url.href });
	}));
}
