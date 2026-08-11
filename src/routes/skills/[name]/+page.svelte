<script lang="ts">
	import SkillPage from "$lib/components/site/skill/SkillPage.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<SkillPage
	skill={data.page}
	catalogSnapshotId={data.catalogSnapshotId}
	canonicalOrigin={data.publication.canonicalOrigin}
	indexable={data.publication.indexable}
/>
