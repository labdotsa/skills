<script lang="ts">
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import { resolve } from "$app/paths";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<PageFrame class="py-12 sm:py-18 lg:py-24">
	<section class="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]" aria-labelledby="recipe-index-title">
		<div>
			<p class="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">LAB Recipes / sequenced delivery</p>
			<h1 id="recipe-index-title" class="max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
				<span class="font-display">LAB Recipes</span> turn focused skills into complete delivery.
			</h1>
			<p class="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
				Move from idea to outcome with clear conversations, durable artifacts, and deliberate handoffs.
			</p>
		</div>
		<nav class="flex flex-col gap-3 sm:flex-row lg:flex-col" aria-label="Recipe index actions">
			<Button href="#recipe-catalog" size="lg">Browse the recipes <ArrowDownIcon aria-hidden="true" /></Button>
			<Button href={`${resolve("/")}#catalog`} variant="outline" size="lg"><ArrowLeftIcon aria-hidden="true" />Explore skills</Button>
		</nav>
	</section>
</PageFrame>
