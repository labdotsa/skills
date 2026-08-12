<script lang="ts">
	import type { DirectoryPillarCount } from "$lib/domain/directory.js";

	interface Props {
		counts: readonly DirectoryPillarCount[];
	}

	let { counts }: Props = $props();
	let visibleCounts = $derived(counts.filter((entry) => entry.count > 0));
	let total = $derived(visibleCounts.reduce((sum, entry) => sum + entry.count, 0));
</script>

{#if total > 0}
	<div
		class="flex h-0.5 w-full overflow-hidden"
		aria-hidden="true"
		data-skill-pillar-distribution
		data-total-skills={total}
	>
		{#each visibleCounts as entry (entry.pillar)}
			<span
				class="h-full min-w-0 basis-0"
				style:flex-grow={entry.count}
				data-pillar={entry.pillar}
				data-count={entry.count}
			></span>
		{/each}
	</div>
{/if}

<style>
	[data-pillar="research"] { background-color: var(--lab-research); }
	[data-pillar="design"] { background-color: var(--lab-design); }
	[data-pillar="development"] { background-color: var(--lab-development); }
	[data-pillar="marketing"] { background-color: var(--lab-marketing); }
</style>
