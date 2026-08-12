<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import SiteShell from "$lib/components/site/shell/SiteShell.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	onMount(() => {
		document.documentElement.dataset.hydrated = "true";
		performance.mark("lab-hydrated");
	});
</script>

<SiteShell publicationProfile={data.publication.name}>
	{@render children()}
</SiteShell>
