<script lang="ts">
	import FoundationPage from "$lib/components/site/foundation/FoundationPage.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<FoundationPage
	canonicalOrigin={data.publication.canonicalOrigin}
	indexable={data.publication.indexable}
	catalogSnapshotId={data.catalogSnapshotId}
	skillCount={data.catalogSummary.skillCount}
	recipeCount={data.catalogSummary.recipeCount}
/>
