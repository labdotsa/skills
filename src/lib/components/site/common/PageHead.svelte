<script lang="ts">
	import { asset } from "$app/paths";

	interface Props {
		title: string;
		description: string;
		canonicalUrl?: string;
		indexable?: boolean;
	}

	let { title, description, canonicalUrl, indexable = true }: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={indexable ? "index,follow" : "noindex,follow"} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://skills.lab.sa/brand/social.png" />
	{#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}
	<link rel="icon" href={asset("/brand/favicon.svg")} />
	<link rel="apple-touch-icon" href={asset("/brand/apple-touch-icon.png")} />
</svelte:head>
