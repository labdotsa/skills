<script lang="ts">
	import DirectoryDestinationPage from "$lib/components/site/directory/DirectoryDestinationPage.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<DirectoryDestinationPage
	kind="skill"
	slug={data.page.slug}
	title={data.page.title}
	description={data.page.description}
	category={data.page.category}
	sourceUrl={data.sourceUrl}
	canonicalOrigin={data.publication.canonicalOrigin}
	indexable={data.publication.indexable}
/>
