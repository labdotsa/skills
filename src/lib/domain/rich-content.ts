export type OutlineItem = Readonly<{
	id: string;
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
}>;

export type RichText = Readonly<{ type: "text"; value: string }>;
export type RichBreak = Readonly<{ type: "break" }>;
export type RichThematicBreak = Readonly<{ type: "thematicBreak" }>;
export type RichInlineCode = Readonly<{ type: "inlineCode"; value: string }>;
export type RichCode = Readonly<{ type: "code"; value: string; language?: string; meta?: string }>;
export type RichImage = Readonly<{ type: "image"; src: string; alt: string; title?: string }>;
export type RichLink = Readonly<{
	type: "link";
	href: string;
	kind: "external" | "mailto" | "fragment" | "source";
	title?: string;
	children: readonly RichNode[];
}>;
export type RichHeading = Readonly<{
	type: "heading";
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	id: string;
	children: readonly RichNode[];
}>;
export type RichList = Readonly<{
	type: "list";
	ordered: boolean;
	start?: number;
	children: readonly RichNode[];
}>;
export type RichListItem = Readonly<{
	type: "listItem";
	checked?: boolean;
	children: readonly RichNode[];
}>;
export type RichTable = Readonly<{
	type: "table";
	align: readonly ("left" | "right" | "center" | null)[];
	children: readonly RichNode[];
}>;
export type RichParent = Readonly<{
	type: "paragraph" | "emphasis" | "strong" | "delete" | "blockquote" | "tableRow" | "tableCell";
	children: readonly RichNode[];
}>;

export type RichNode =
	| RichText
	| RichBreak
	| RichThematicBreak
	| RichInlineCode
	| RichCode
	| RichImage
	| RichLink
	| RichHeading
	| RichList
	| RichListItem
	| RichTable
	| RichParent;

export type RichDocument = Readonly<{
	type: "root";
	children: readonly RichNode[];
}>;
