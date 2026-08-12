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
		actions?: Snippet;
		aside?: Snippet;
	}

	let {
		eyebrow,
		title,
		description,
		accent = "var(--lab-main)",
		titleId,
		prelude,
		actions,
		aside,
	}: Props = $props();
</script>

<header class="border-b" data-lab-hero style={`--hero-accent: ${accent}`}>
	<PageFrame class="py-10 sm:py-14 lg:py-18">
		{#if prelude}
			<div data-lab-hero-prelude>{@render prelude()}</div>
		{/if}
		<div class={prelude ? "mt-9" : ""} data-lab-hero-layout>
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" data-lab-hero-eyebrow>{eyebrow}</p>
			<h1
				id={titleId}
				class="mt-4 max-w-[14ch] break-words font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[0.95] tracking-normal"
				data-lab-hero-title
			>
				{title}
			</h1>
			<div
				class={[
					"mt-8 grid min-w-0 gap-8 lg:items-end lg:gap-12",
					aside ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]" : "",
				]}
				data-lab-hero-support
			>
				<div class="min-w-0" data-lab-hero-primary>
					<p class="max-w-4xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{description}</p>
				{#if actions}
					<div class="mt-7">{@render actions()}</div>
				{/if}
				</div>
				{#if aside}
					<div class="min-w-0" data-lab-hero-aside>{@render aside()}</div>
				{/if}
			</div>
		</div>
	</PageFrame>
</header>
