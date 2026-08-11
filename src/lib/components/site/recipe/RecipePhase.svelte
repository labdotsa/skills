<script lang="ts">
	import type { RecipePagePhase } from "$lib/domain/catalog.js";
	import HandoffNotice from "./HandoffNotice.svelte";
	import RecipeRichDocument from "./RecipeRichDocument.svelte";
	import RecipeStep from "./RecipeStep.svelte";

	interface Props {
		phase: RecipePagePhase;
		nextPhase?: RecipePagePhase;
	}

	let { phase, nextPhase }: Props = $props();
</script>

<section class="min-w-0 pb-10" aria-labelledby={phase.id} data-recipe-phase={phase.slug}>
	<header class="border-b-4 border-primary pb-6">
		<p class="font-mono text-sm text-muted-foreground">PHASE {String(phase.number).padStart(2, "0")}</p>
		<h2 id={phase.id} tabindex="-1" class="mt-3 scroll-mt-24 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{phase.title}</h2>
		{#if phase.introduction.children.length > 0}
			<div class="mt-5"><RecipeRichDocument document={phase.introduction} /></div>
		{/if}
	</header>

	{#each phase.steps as step (step.id)}
		<RecipeStep {step} phaseNumber={phase.number} />
	{/each}

	{#if nextPhase}<HandoffNotice from={phase.title} to={nextPhase.title} />{/if}
</section>
