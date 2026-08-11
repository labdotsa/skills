import { LineCounter, parseDocument } from "yaml";
import { contentError } from "./diagnostic.js";

export type ParsedFrontmatter = Readonly<{
	value: unknown;
	body: string;
	bodyOffset: number;
}>;

export function parseFrontmatter(text: string, sourcePath: string): ParsedFrontmatter {
	const openingEnd = lineEnd(text, 0);
	if (openingEnd === -1 || stripCarriageReturn(text.slice(0, openingEnd)) !== "---") {
		throw contentError(
			"FRONTMATTER_MISSING",
			sourcePath,
			"Source must begin with a YAML frontmatter delimiter at byte zero.",
			"Add an opening `---` line before the metadata.",
		);
	}

	let cursor = openingEnd + 1;
	let closingStart = -1;
	let closingEnd = -1;
	while (cursor <= text.length) {
		const end = lineEnd(text, cursor);
		const actualEnd = end === -1 ? text.length : end;
		if (stripCarriageReturn(text.slice(cursor, actualEnd)) === "---") {
			closingStart = cursor;
			closingEnd = actualEnd;
			break;
		}
		if (end === -1) break;
		cursor = end + 1;
	}
	if (closingStart === -1) {
		throw contentError(
			"FRONTMATTER_UNCLOSED",
			sourcePath,
			"YAML frontmatter does not have a closing delimiter line.",
			"Add a closing `---` line before the Markdown body.",
		);
	}

	const yamlText = text.slice(openingEnd + 1, closingStart);
	const lineCounter = new LineCounter();
	const document = parseDocument(yamlText, {
		lineCounter,
		merge: false,
		resolveKnownTags: false,
		schema: "core",
		strict: true,
		stringKeys: true,
		uniqueKeys: true,
		version: "1.2",
	});
	const problems = [...document.errors, ...document.warnings];
	if (problems.length > 0) {
		const problem = problems[0];
		const position = problem.linePos?.[0];
		const location = position ? ` at line ${position.line + 1}, column ${position.col}` : "";
		const code = /unique|duplicate/i.test(problem.message) ? "YAML_DUPLICATE_KEY" : /tag/i.test(problem.message) ? "YAML_TAG" : "YAML_SYNTAX";
		throw contentError(
			code,
			sourcePath,
			`Invalid YAML 1.2 frontmatter${location}: ${problem.message}`,
			"Use one unambiguous YAML 1.2 mapping with unique string keys.",
		);
	}

	let value: unknown;
	try {
		value = document.toJS({ maxAliasCount: 50 });
		assertJsonValue(value, new Set());
	} catch (cause) {
		throw contentError(
			"YAML_ALIAS_LIMIT",
			sourcePath,
			`Frontmatter cannot resolve to an acyclic JSON value: ${cause instanceof Error ? cause.message : String(cause)}`,
			"Remove recursive or excessive aliases and use JSON-shaped scalar, array, and mapping values.",
		);
	}

	const bodyOffset = closingEnd < text.length ? closingEnd + 1 : closingEnd;
	return Object.freeze({ value, body: text.slice(bodyOffset), bodyOffset });
}

function lineEnd(text: string, start: number) {
	return text.indexOf("\n", start);
}

function stripCarriageReturn(value: string) {
	return value.endsWith("\r") ? value.slice(0, -1) : value;
}

function assertJsonValue(value: unknown, ancestors: Set<object>) {
	if (value === null || typeof value === "string" || typeof value === "boolean") return;
	if (typeof value === "number" && Number.isFinite(value)) return;
	if (typeof value !== "object") throw new Error("unsupported non-JSON value");
	if (ancestors.has(value)) throw new Error("cyclic alias graph");
	ancestors.add(value);
	if (Array.isArray(value)) {
		for (const child of value) assertJsonValue(child, ancestors);
	} else {
		for (const [key, child] of Object.entries(value)) {
			if (typeof key !== "string") throw new Error("mapping key must be a string");
			assertJsonValue(child, ancestors);
		}
	}
	ancestors.delete(value);
}
