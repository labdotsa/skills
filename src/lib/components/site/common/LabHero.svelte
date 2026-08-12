<script lang="ts">
	import type { Snippet } from "svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";

	interface Props {
		eyebrow: string;
		title: string;
		description: string;
		accent?: string;
		titleId?: string;
		prelude?: Snippet;
		aside?: Snippet;
	}

	let {
		eyebrow,
		title,
		description,
		accent = "var(--lab-research)",
		titleId,
		prelude,
		aside,
	}: Props = $props();
</script>

<header class="border-b" data-lab-hero style={`--hero-accent: ${accent}`}>
	<PageFrame class="py-10 sm:py-14 lg:py-18">
		{#if prelude}
			{@render prelude()}
		{/if}
		<div
			class={[
				"grid min-w-0 gap-10 border-s-4 border-[var(--hero-accent)] ps-5 sm:ps-8",
				prelude ? "mt-9" : "",
				aside ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.65fr)] lg:items-end" : "",
			]}
		>
			<div class="min-w-0">
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
				<h1
					id={titleId}
					class="mt-4 max-w-[15ch] break-words font-display text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.055em]"
				>
					{title}
				</h1>
				<p class="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{description}</p>
			</div>
			{#if aside}
				<div class="min-w-0">{@render aside()}</div>
			{/if}
		</div>
	</PageFrame>
</header>
