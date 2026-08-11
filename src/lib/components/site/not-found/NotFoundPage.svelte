<script lang="ts">
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import { resolve } from "$app/paths";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<PageHead
	title="Page not found — LAB Skills"
	description="The requested LAB Skills page does not exist."
	indexable={false}
/>

<PageFrame class="py-20 sm:py-28">
	<section class="max-w-2xl" aria-labelledby="not-found-title">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">404 / not found</p>
		<h1 id="not-found-title" class="mt-4 text-5xl font-bold tracking-[-0.04em] sm:text-7xl">This page is not in the library.</h1>
		<p class="mt-6 text-lg leading-8 text-muted-foreground">The address may have moved, or the requested protocol may not exist.</p>
		<Button href={resolve("/")} size="lg" class="mt-8">
			<ArrowLeftIcon aria-hidden="true" />
			Return to LAB Skills
		</Button>
	</section>
</PageFrame>
