<script lang="ts">
	import { asset } from "$app/paths";
	import { serializeJsonLd, type SeoPage } from "$lib/domain/seo.js";

	interface Props {
		seo: SeoPage;
	}

	let { seo }: Props = $props();
	let structuredData = $derived(seo.structuredData ? serializeJsonLd(seo.structuredData) : undefined);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content={seo.robots} />
	<meta property="og:title" content={seo.openGraph.title} />
	<meta property="og:description" content={seo.openGraph.description} />
	<meta property="og:type" content={seo.openGraph.type} />
	{#if seo.openGraph.url}<meta property="og:url" content={seo.openGraph.url} />{/if}
	<meta property="og:image" content={seo.openGraph.image} />
	<meta property="og:image:type" content={seo.openGraph.imageType} />
	<meta property="og:image:width" content={String(seo.openGraph.imageWidth)} />
	<meta property="og:image:height" content={String(seo.openGraph.imageHeight)} />
	<meta property="og:image:alt" content={seo.openGraph.imageAlt} />
	<meta property="og:site_name" content={seo.openGraph.siteName} />
	<meta name="twitter:card" content={seo.twitter.card} />
	<meta name="twitter:title" content={seo.twitter.title} />
	<meta name="twitter:description" content={seo.twitter.description} />
	<meta name="twitter:image" content={seo.twitter.image} />
	<meta name="twitter:image:alt" content={seo.twitter.imageAlt} />
	{#if seo.canonicalUrl}<link rel="canonical" href={seo.canonicalUrl} />{/if}
	{#if seo.alternate}<link rel="alternate" type={seo.alternate.type} href={seo.alternate.href} />{/if}
	<link rel="icon" href={asset("/brand/favicon.svg")} />
	<link rel="apple-touch-icon" href={asset("/brand/apple-touch-icon.png")} />
	{#if structuredData}
		<svelte:element this={"script"} type="application/ld+json">{structuredData}</svelte:element>
	{/if}
</svelte:head>
