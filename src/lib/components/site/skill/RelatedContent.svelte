<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import RelatedRow from "$lib/components/site/common/RelatedRow.svelte";
	import type { RelatedEntry } from "$lib/domain/catalog.js";

	interface Props {
		entries: readonly RelatedEntry[];
	}

	let { entries }: Props = $props();
</script>

{#if entries.length > 0}
	<section aria-labelledby="related-title">
		<PageFrame class="py-16 sm:py-24">
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Continue with LAB</p>
			<h2 id="related-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Related skills &amp; recipes</h2>
			<ul class="mt-8 list-none divide-y divide-border overflow-hidden rounded-lg border p-0" data-related-rows>
				{#each entries as entry, index (`${entry.kind}-${entry.slug}`)}
					<RelatedRow {entry} {index} />
				{/each}
			</ul>
		</PageFrame>
	</section>
{/if}
