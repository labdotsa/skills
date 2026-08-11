<script lang="ts">
	import type { RecipeIndexPageView } from "$lib/domain/directory.js";
	import { recipeIndexSeo } from "$lib/domain/seo.js";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import RecipeDirectory from "./RecipeDirectory.svelte";
	import RecipeFlow from "./RecipeFlow.svelte";
	import RecipeIndexHero from "./RecipeIndexHero.svelte";

	interface Props {
		index: RecipeIndexPageView;
		catalogSnapshotId: string;
		canonicalOrigin: string;
		indexable: boolean;
	}

	let { index, catalogSnapshotId, canonicalOrigin, indexable }: Props = $props();
	let seo = $derived(recipeIndexSeo(index, canonicalOrigin, indexable));
</script>

<PageHead {seo} />

<div data-catalog-snapshot={catalogSnapshotId} data-recipe-index>
	<RecipeIndexHero />
	<RecipeFlow />
	<RecipeDirectory {index} />
</div>
