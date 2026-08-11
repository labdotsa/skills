<script lang="ts">
	import DiscoveryPage from "$lib/components/site/directory/DiscoveryPage.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<DiscoveryPage
	canonicalOrigin={data.publication.canonicalOrigin}
	indexable={data.publication.indexable}
	catalogSnapshotId={data.catalogSnapshotId}
	directory={data.directory}
/>
