<script lang="ts">
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import { resolve } from "$app/paths";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	interface Props {
		kind: "skill" | "recipe";
		slug: string;
		title: string;
		description: string;
		category: string;
		sourceUrl: string;
		canonicalOrigin: string;
		indexable: boolean;
	}

	let { kind, slug, title, description, category, sourceUrl, canonicalOrigin, indexable }: Props = $props();
	let canonicalUrl = $derived(`${canonicalOrigin}/${kind === "skill" ? "skills" : "recipes"}/${encodeURIComponent(slug)}/`);
</script>

<PageHead title={`${title} — LAB Skills`} {description} {canonicalUrl} {indexable} />

<PageFrame class="py-16 sm:py-24">
	<article class="max-w-4xl" aria-labelledby="entry-title">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{kind} / {category.replaceAll("-", " ")}</p>
		<h1 id="entry-title" class="mt-4 break-words text-5xl font-bold tracking-[-0.04em] sm:text-7xl">{title}</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<Button href={resolve("/")} variant="outline" size="lg"><ArrowLeftIcon aria-hidden="true" />Back to the directory</Button>
			<Button href={sourceUrl} size="lg"><ExternalLinkIcon aria-hidden="true" />Open source</Button>
		</div>
	</article>
</PageFrame>
