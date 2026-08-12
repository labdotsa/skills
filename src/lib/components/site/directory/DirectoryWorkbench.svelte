<script lang="ts">
	import { resolve } from "$app/paths";
	import type { DirectoryCollection, DirectoryPageView } from "$lib/domain/directory.js";
	import DirectoryBrowser from "./DirectoryBrowser.svelte";

	interface Props {
		directory: DirectoryPageView;
	}

	let { directory }: Props = $props();
	let collection = $derived<DirectoryCollection>({ kind: "skills", items: directory.skills });
</script>

<section
	class="overflow-hidden rounded-lg border bg-card"
	id="catalog"
	aria-labelledby="catalog-title"
	data-skill-count={directory.skills.length}
>
	<DirectoryBrowser {collection} idPrefix="directory">
		{#snippet header()}
			<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Public skill library</p>
					<h2 id="catalog-title" class="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-5xl">Methods built in the work.</h2>
					<p class="mt-4 max-w-2xl leading-7 text-muted-foreground">
						Focused instructions generated directly from LAB’s validated repository source.
					</p>
				</div>
				<a class="inline-flex min-h-11 items-center gap-2 self-start font-semibold underline decoration-primary decoration-2 underline-offset-4 lg:self-end" href={resolve("/recipes/")}>
					Need a sequence? Browse Recipes <span aria-hidden="true">→</span>
				</a>
			</div>
		{/snippet}
	</DirectoryBrowser>
</section>
