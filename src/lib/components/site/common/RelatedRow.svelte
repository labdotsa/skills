<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import { resolve } from "$app/paths";
	import type { RelatedEntry } from "$lib/domain/catalog.js";
	import { pillarForCategory } from "$lib/domain/directory.js";

	interface Props {
		entry: RelatedEntry;
		index: number;
	}

	let { entry, index }: Props = $props();
	let pillar = $derived(pillarForCategory(entry.category));
</script>

<article role="listitem" data-pillar={pillar}>
	<a
		class="group grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-start gap-3 border-b border-s-4 border-b-border border-s-[var(--row-accent)] px-3 py-5 no-underline transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 sm:grid-cols-[3.25rem_minmax(0,1fr)_2.5rem] sm:gap-5 sm:px-5 sm:py-6 motion-reduce:transition-none"
		href={resolve(entry.kind === "skill" ? `/skills/${entry.slug}/` : `/recipes/${entry.slug}/`)}
		aria-label={`Open related ${entry.kind} ${entry.title}`}
	>
		<span class="pt-0.5 font-mono text-sm text-subtle" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
		<span class="min-w-0">
			<span class="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
				<span>{entry.category.replaceAll("-", " ")}</span><span>{entry.kind}</span>
			</span>
			<span class="mt-2 block break-words text-xl font-bold tracking-tight sm:text-2xl">{entry.title}</span>
			<span class="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{entry.description}</span>
		</span>
		<span class="flex size-8 items-center justify-center rounded-full border border-border-strong transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
			<ArrowRightIcon class="size-4" />
		</span>
	</a>
</article>

<style>
	[data-pillar="research"] { --row-accent: var(--lab-research); }
	[data-pillar="design"] { --row-accent: var(--lab-design); }
	[data-pillar="development"] { --row-accent: var(--lab-development); }
	[data-pillar="marketing"] { --row-accent: var(--lab-marketing); }
</style>
