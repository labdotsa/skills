<script lang="ts">
	import type { RecipePageStep } from "$lib/domain/catalog.js";
	import RecipeRichDocument from "./RecipeRichDocument.svelte";

	interface Props {
		step: RecipePageStep;
		phaseNumber: number;
	}

	let { step, phaseNumber }: Props = $props();
	let index = $derived(`${String(phaseNumber).padStart(2, "0")}.${String(step.number).padStart(2, "0")}`);
</script>

<article class="relative grid min-w-0 gap-5 border-t py-10 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-8" data-recipe-step={step.id}>
	<div class="sm:sticky sm:top-24 sm:self-start">
		<span class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border bg-card px-3 font-mono text-sm font-semibold" aria-hidden="true">{index}</span>
	</div>
	<div class="min-w-0">
		{#if step.depth === 3}
			<h3 id={step.id} tabindex="-1" class="scroll-mt-24 text-2xl font-bold tracking-tight sm:text-3xl">{step.title}</h3>
		{:else if step.depth === 4}
			<h4 id={step.id} tabindex="-1" class="scroll-mt-24 text-xl font-bold tracking-tight sm:text-2xl">{step.title}</h4>
		{:else if step.depth === 5}
			<h5 id={step.id} tabindex="-1" class="scroll-mt-24 text-lg font-bold tracking-tight sm:text-xl">{step.title}</h5>
		{:else}
			<h6 id={step.id} tabindex="-1" class="scroll-mt-24 font-bold tracking-tight">{step.title}</h6>
		{/if}
		<div class="mt-5"><RecipeRichDocument document={step.document} /></div>
	</div>
</article>
