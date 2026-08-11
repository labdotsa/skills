<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import type { DirectoryCollection, RecipeIndexPageView } from "$lib/domain/directory.js";
	import DirectoryBrowser from "$lib/components/site/directory/DirectoryBrowser.svelte";

	interface Props {
		index: RecipeIndexPageView;
	}

	let { index }: Props = $props();
	let collections = $derived<readonly [DirectoryCollection]>([
		{ kind: "recipes", items: index.recipes },
	]);
	let countLabel = $derived(`${index.recipes.length} ${index.recipes.length === 1 ? "sequenced playbook" : "sequenced playbooks"}, maintained in source.`);
</script>

<PageFrame class="py-12 sm:py-18 lg:py-24">
	<section class="border-y" id="recipe-catalog" aria-labelledby="recipes-title" data-recipe-count={index.recipes.length}>
		<DirectoryBrowser {collections} idPrefix="recipe-index" rowDetail="phases" emptyMessage="No recipe matches that search.">
			{#snippet header()}
				<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Public delivery library</p>
						<h2 id="recipes-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Recipes</h2>
					</div>
					<p class="leading-7 text-muted-foreground">{countLabel}</p>
				</div>
			{/snippet}
		</DirectoryBrowser>
	</section>
</PageFrame>
