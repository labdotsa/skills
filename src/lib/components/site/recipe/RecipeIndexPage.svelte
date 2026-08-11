<script lang="ts">
	import type { RecipeIndexPageView } from "$lib/domain/directory.js";
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
</script>

<PageHead
	title="LAB Recipes — Skills assembled into delivery workflows"
	description="Repeatable delivery recipes with focused prompts, skills, artifacts, and deliberate handoffs."
	canonicalUrl={`${canonicalOrigin}/recipes/`}
	{indexable}
/>

<div data-catalog-snapshot={catalogSnapshotId} data-recipe-index>
	<RecipeIndexHero />
	<RecipeFlow />
	<RecipeDirectory {index} />
</div>
