import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { contentError } from "./diagnostic.js";

export type MdastNode = {
	type: string;
	value?: string;
	depth?: number;
	children?: MdastNode[];
	[key: string]: unknown;
};

const parser = unified().use(remarkParse).use(remarkGfm);

export function parseMarkdown(body: string, sourcePath: string) {
	const root = parser.parse(body) as MdastNode;
	const titleNode = root.children?.find((node) => node.type === "heading" && node.depth === 1);
	if (!titleNode) {
		throw contentError("RECIPE_TITLE", sourcePath, "Markdown body needs an H1 title.", "Add one `# Title` heading.");
	}
	return Object.freeze({ root, title: plainText(titleNode).trim() });
}

export function plainText(node: MdastNode): string {
	if (typeof node.value === "string") return node.value;
	return node.children?.map(plainText).join("") ?? "";
}
