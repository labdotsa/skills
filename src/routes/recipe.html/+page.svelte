<script lang="ts">
	import RecipePage from "$lib/components/site/recipe/RecipePage.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<RecipePage
	recipe={data.page}
	catalogSnapshotId={data.catalogSnapshotId}
	canonicalOrigin={data.publication.canonicalOrigin}
	indexable={data.publication.indexable}
/>
