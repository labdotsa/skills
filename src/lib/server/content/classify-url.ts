import path from "node:path";
import { contentError } from "./diagnostic.js";

export type ClassifiedContentUrl = Readonly<{
	href: string;
	kind: "external" | "mailto" | "fragment" | "source";
}>;

type UrlContext = Readonly<{
	sourcePath: string;
	ownerDirectory: string;
	knownRepositoryPaths: ReadonlySet<string>;
	headingIds: ReadonlyMap<string, string>;
	image?: boolean;
}>;

const repositoryBlobRoot = "https://github.com/labdotsa/skills/blob/master/";

export function classifyContentUrl(rawValue: string, context: UrlContext): ClassifiedContentUrl {
	const value = rawValue.trim();
	if (value.length === 0) invalid(context.sourcePath, "URL is empty.");
	if (value.startsWith("//")) unsafe(context.sourcePath, "Protocol-relative URLs are not allowed.");
	let decodedInputPath: string;
	try {
		decodedInputPath = decodeURIComponent(value.split(/[?#]/, 1)[0]);
	} catch {
		invalid(context.sourcePath, "URL contains invalid percent encoding.");
	}
	if (decodedInputPath.split(/[\\/]/).includes("..")) {
		throw contentError(
			"URL_OUTSIDE_PACKAGE",
			context.sourcePath,
			`URL ${JSON.stringify(rawValue)} contains a parent traversal segment.`,
			"Link directly to a validated file inside the same package.",
		);
	}

	if (value.startsWith("#")) {
		if (context.image) unsafe(context.sourcePath, "Images cannot use fragment URLs.");
		let fragment: string;
		try {
			fragment = decodeURIComponent(value.slice(1));
		} catch {
			invalid(context.sourcePath, "Fragment contains invalid percent encoding.");
		}
		const target = context.headingIds.get(fragment) ?? context.headingIds.get(slugify(fragment));
		if (!target) invalid(context.sourcePath, `Fragment ${JSON.stringify(value)} does not target a generated heading.`);
		return Object.freeze({ href: `#${target}`, kind: "fragment" });
	}

	let parsed: URL;
	try {
		parsed = new URL(value, `https://repository.invalid/${context.ownerDirectory}/`);
	} catch {
		invalid(context.sourcePath, `URL ${JSON.stringify(rawValue)} is invalid.`);
	}

	if (parsed.protocol === "http:" || parsed.protocol === "https:") {
		if (parsed.hostname !== "repository.invalid") {
			return Object.freeze({ href: parsed.href, kind: "external" });
		}
	} else if (parsed.protocol === "mailto:") {
		if (context.image) unsafe(context.sourcePath, "Images cannot use mailto URLs.");
		const address = parsed.pathname.trim();
		if (address.length === 0 || !address.includes("@")) invalid(context.sourcePath, "mailto URL needs a non-empty address.");
		return Object.freeze({ href: `mailto:${address}`, kind: "mailto" });
	} else {
		unsafe(context.sourcePath, `URL scheme ${JSON.stringify(parsed.protocol)} is not allowed.`);
	}

	if (value.startsWith("/")) unsafe(context.sourcePath, "Repository links must be relative to their owning package.");
	let decodedPath: string;
	try {
		decodedPath = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
	} catch {
		invalid(context.sourcePath, "Relative URL contains invalid percent encoding.");
	}
	const normalized = path.posix.normalize(decodedPath);
	if (normalized !== context.ownerDirectory && !normalized.startsWith(`${context.ownerDirectory}/`)) {
		throw contentError(
			"URL_OUTSIDE_PACKAGE",
			context.sourcePath,
			`Relative URL ${JSON.stringify(rawValue)} escapes its owning package.`,
			"Link only to a validated file inside the same Skill or Recipe package.",
		);
	}
	if (!context.knownRepositoryPaths.has(normalized)) {
		throw contentError(
			"SOURCE_LINK_MISSING",
			context.sourcePath,
			`Relative URL ${JSON.stringify(rawValue)} does not resolve to a known package file.`,
			"Add the referenced file or correct the relative path.",
		);
	}
	if (context.image && !/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(normalized)) {
		unsafe(context.sourcePath, "Local image URL must target a supported repository image file.");
	}
	const encodedPath = normalized.split("/").map(encodeURIComponent).join("/");
	return Object.freeze({ href: `${repositoryBlobRoot}${encodedPath}${parsed.search}${parsed.hash}`, kind: "source" });
}

export function slugify(value: string) {
	return value
		.normalize("NFKD")
		.toLowerCase()
		.replace(/[^\p{Letter}\p{Number}]+/gu, "-")
		.replace(/^-+|-+$/g, "") || "section";
}

function invalid(sourcePath: string, message: string): never {
	throw contentError("URL_INVALID", sourcePath, message, "Use a valid fragment, relative package path, or explicit HTTP(S) URL.");
}

function unsafe(sourcePath: string, message: string): never {
	throw contentError("URL_UNSAFE_SCHEME", sourcePath, message, "Use a safe explicit HTTPS URL or a validated local package link.");
}
