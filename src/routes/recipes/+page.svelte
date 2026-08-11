<script lang="ts">
	import RecipeIndexPage from "$lib/components/site/recipe/RecipeIndexPage.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<RecipeIndexPage
	index={data.recipeIndex}
	catalogSnapshotId={data.catalogSnapshotId}
	canonicalOrigin={data.publication.canonicalOrigin}
	indexable={data.publication.indexable}
/>
