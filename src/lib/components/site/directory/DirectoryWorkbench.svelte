<script lang="ts">
	import type { DirectoryCollection, DirectoryPageView } from "$lib/domain/directory.js";
	import DirectoryBrowser from "./DirectoryBrowser.svelte";

	interface Props {
		directory: DirectoryPageView;
	}

	let { directory }: Props = $props();
	let collections = $derived<readonly [DirectoryCollection, DirectoryCollection]>([
		{ kind: "skills", items: directory.skills },
		{ kind: "recipes", items: directory.recipes },
	]);
</script>

<section
	class="border-y"
	id="catalog"
	aria-labelledby="catalog-title"
	data-skill-count={directory.skills.length}
	data-recipe-count={directory.recipes.length}
>
	<DirectoryBrowser {collections} idPrefix="directory">
		{#snippet header()}
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Public library</p>
			<h2 id="catalog-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Browse the working library.</h2>
			<p class="mt-3 max-w-xl leading-7 text-muted-foreground">
				Focused instructions and sequenced delivery recipes, generated from the repository’s validated source.
			</p>
		{/snippet}
	</DirectoryBrowser>
</section>
