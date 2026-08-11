import type { OutlineItem, RichDocument, RichNode } from "$lib/domain/rich-content.js";
import { classifyContentUrl, slugify } from "./classify-url.js";
import { contentError } from "./diagnostic.js";
import type { MdastNode } from "./parse-markdown.js";
import { plainText } from "./parse-markdown.js";

type RichContext = Readonly<{
	sourcePath: string;
	ownerDirectory: string;
	knownRepositoryPaths: ReadonlySet<string>;
}>;

export function toRichDocument(root: MdastNode, context: RichContext) {
	const headingIds = new Map<string, string>();
	const headingNodes = new WeakMap<object, string>();
	const outline: OutlineItem[] = [];
	const duplicateCounts = new Map<string, number>();
	const definitions = new Map<string, { url: string; title?: string }>();

	for (const child of root.children ?? []) {
		if (child.type === "definition" && typeof child.identifier === "string" && typeof child.url === "string") {
			definitions.set(child.identifier.toLowerCase(), {
				url: child.url,
				...(typeof child.title === "string" ? { title: child.title } : {}),
			});
		}
		if (child.type !== "heading" || typeof child.depth !== "number") continue;
		const text = plainText(child).trim();
		const base = `content-${slugify(text)}`;
		const count = (duplicateCounts.get(base) ?? 0) + 1;
		duplicateCounts.set(base, count);
		const id = count === 1 ? base : `${base}-${count}`;
		headingNodes.set(child, id);
		headingIds.set(id, id);
		if (!headingIds.has(slugify(text))) headingIds.set(slugify(text), id);
		outline.push(Object.freeze({ id, depth: child.depth as OutlineItem["depth"], text }));
	}

	const urlContext = { ...context, headingIds };
	const transformChildren = (nodes: readonly MdastNode[] | undefined): readonly RichNode[] =>
		Object.freeze((nodes ?? []).flatMap((node) => {
			const transformed = transform(node);
			return transformed ? [transformed] : [];
		}));

	function transform(node: MdastNode): RichNode | undefined {
		switch (node.type) {
			case "definition":
				return undefined;
			case "text":
			case "html":
				return Object.freeze({ type: "text", value: String(node.value ?? "") });
			case "break":
				return Object.freeze({ type: "break" });
			case "thematicBreak":
				return Object.freeze({ type: "thematicBreak" });
			case "inlineCode":
				return Object.freeze({ type: "inlineCode", value: String(node.value ?? "") });
			case "code":
				return Object.freeze({
					type: "code",
					value: String(node.value ?? ""),
					...(typeof node.lang === "string" ? { language: node.lang } : {}),
					...(typeof node.meta === "string" ? { meta: node.meta } : {}),
				});
			case "paragraph":
			case "emphasis":
			case "strong":
			case "delete":
			case "blockquote":
			case "tableRow":
			case "tableCell":
				return Object.freeze({ type: node.type, children: transformChildren(node.children) });
			case "heading":
				return Object.freeze({
					type: "heading",
					depth: node.depth as 1 | 2 | 3 | 4 | 5 | 6,
					id: headingNodes.get(node)!,
					children: transformChildren(node.children),
				});
			case "list":
				return Object.freeze({
					type: "list",
					ordered: Boolean(node.ordered),
					...(typeof node.start === "number" ? { start: node.start } : {}),
					children: transformChildren(node.children),
				});
			case "listItem":
				return Object.freeze({
					type: "listItem",
					...(typeof node.checked === "boolean" ? { checked: node.checked } : {}),
					children: transformChildren(node.children),
				});
			case "table":
				return Object.freeze({
					type: "table",
					align: Object.freeze(Array.isArray(node.align) ? [...node.align] as ("left" | "right" | "center" | null)[] : []),
					children: transformChildren(node.children),
				});
			case "link": {
				const classified = classifyContentUrl(String(node.url ?? ""), urlContext);
				return Object.freeze({
					type: "link",
					...classified,
					...(typeof node.title === "string" ? { title: node.title } : {}),
					children: transformChildren(node.children),
				});
			}
			case "linkReference": {
				const definition = definitions.get(String(node.identifier ?? "").toLowerCase());
				if (!definition) unsupported(node, "Reference link has no definition.");
				const classified = classifyContentUrl(definition.url, urlContext);
				return Object.freeze({
					type: "link",
					...classified,
					...(definition.title ? { title: definition.title } : {}),
					children: transformChildren(node.children),
				});
			}
			case "image": {
				const classified = classifyContentUrl(String(node.url ?? ""), { ...urlContext, image: true });
				return Object.freeze({
					type: "image",
					src: classified.href,
					alt: String(node.alt ?? ""),
					...(typeof node.title === "string" ? { title: node.title } : {}),
				});
			}
			case "imageReference": {
				const definition = definitions.get(String(node.identifier ?? "").toLowerCase());
				if (!definition) unsupported(node, "Image reference has no definition.");
				const classified = classifyContentUrl(definition.url, { ...urlContext, image: true });
				return Object.freeze({ type: "image", src: classified.href, alt: String(node.alt ?? ""), ...(definition.title ? { title: definition.title } : {}) });
			}
			default:
				unsupported(node, `Markdown node ${JSON.stringify(node.type)} is not supported.`);
		}
	}

	function unsupported(node: MdastNode, message: string): never {
		throw contentError(
			"CONTENT_UNSUPPORTED_NODE",
			context.sourcePath,
			message,
			"Rewrite the content with supported CommonMark/GFM structure.",
		);
	}

	const document: RichDocument = Object.freeze({ type: "root", children: transformChildren(root.children) });
	return Object.freeze({ document, outline: Object.freeze(outline) });
}
