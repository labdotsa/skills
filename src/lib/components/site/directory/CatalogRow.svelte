<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import { resolve } from "$app/paths";
	import type { DirectoryItem } from "$lib/domain/directory.js";

	interface Props {
		item: DirectoryItem;
		index: number;
	}

	let { item, index }: Props = $props();
	let itemKind = $derived(item.kind === "skill" ? "skill" : "recipe");
	let sourceLabel = $derived(item.kind === "skill"
		? `${item.files.length} ${item.files.length === 1 ? "file" : "files"}`
		: `${item.conversations} conversations`);
</script>

<article role="listitem" data-pillar={item.pillar}>
	<a
		class="group grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-start gap-3 border-b border-s-4 border-b-border border-s-[var(--row-accent)] px-3 py-5 no-underline transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 sm:grid-cols-[3.25rem_minmax(0,1fr)_2.5rem] sm:gap-5 sm:px-5 sm:py-6 motion-reduce:transition-none"
		href={resolve(item.kind === "skill" ? `/skills/${item.slug}/` : `/recipes/${item.slug}/`)}
		aria-label={`Open ${item.title} ${itemKind}`}
	>
		<span class="pt-0.5 font-mono text-sm text-subtle" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
		<span class="min-w-0">
			<span class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
				<span>{item.category.replaceAll("-", " ")}</span>
				<span>{sourceLabel}</span>
				{#if item.kind === "recipe"}<span>{item.status}</span>{/if}
			</span>
			<span class="mt-2 block break-words text-xl font-bold tracking-tight sm:text-2xl">{item.title}</span>
			<span class="mt-2 line-clamp-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{item.description}</span>
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
