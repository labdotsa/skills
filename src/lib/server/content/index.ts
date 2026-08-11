import path from "node:path";
import { buildCatalogSnapshot, type CatalogSnapshot } from "./build-catalog.server.js";

type CatalogProviderOptions = Readonly<{
	repositoryRoot: string;
	onRead?: (relativePath: string) => void;
}>;

export function createCatalogProvider(options: CatalogProviderOptions) {
	let snapshotPromise: Promise<CatalogSnapshot> | undefined;
	return Object.freeze({
		getSnapshot() {
			snapshotPromise ??= buildCatalogSnapshot(options);
			return snapshotPromise;
		},
		invalidate() {
			snapshotPromise = undefined;
		},
	});
}

export const repositoryRoot = path.resolve(process.env.CONTENT_REPOSITORY_ROOT ?? process.cwd());
const defaultProvider = createCatalogProvider({ repositoryRoot });

export function getCatalogSnapshot() {
	return defaultProvider.getSnapshot();
}

export function invalidateCatalogSnapshot() {
	defaultProvider.invalidate();
}

export type { CatalogSnapshot } from "./build-catalog.server.js";
export type { RecipeEntry, RecipePageView, SkillEntry, SkillPageView } from "$lib/domain/catalog.js";
