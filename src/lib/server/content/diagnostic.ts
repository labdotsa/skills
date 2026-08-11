export type ContentDiagnosticCode =
	| "SOURCE_UNREADABLE"
	| "SOURCE_SPECIAL_FILE"
	| "SOURCE_OUTSIDE_ROOT"
	| "SOURCE_INVALID_UTF8"
	| "SOURCE_BOM"
	| "SOURCE_NUL";

export type ContentDiagnostic = Readonly<{
	code: ContentDiagnosticCode | string;
	severity: "error";
	sourcePath: string;
	message: string;
	hint: string;
}>;

export class ContentError extends Error {
	readonly diagnostics: readonly ContentDiagnostic[];

	constructor(diagnostic: ContentDiagnostic | readonly ContentDiagnostic[]) {
		const diagnostics = Array.isArray(diagnostic) ? diagnostic : [diagnostic];
		super(diagnostics.map((item) => `${item.sourcePath} [${item.code}] ${item.message} ${item.hint}`).join("\n"));
		this.name = "ContentError";
		this.diagnostics = Object.freeze([...diagnostics]);
	}
}

export function contentError(
	code: ContentDiagnosticCode | string,
	sourcePath: string,
	message: string,
	hint: string,
) {
	return new ContentError({ code, severity: "error", sourcePath, message, hint });
}
