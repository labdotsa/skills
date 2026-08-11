<script lang="ts">
	import "../app.css";
	import SiteShell from "$lib/components/site/shell/SiteShell.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<SiteShell publicationProfile={data.publication.name}>
	{@render children()}
</SiteShell>
