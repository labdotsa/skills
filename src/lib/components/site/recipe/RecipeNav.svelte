<script lang="ts">
	import ContentsNav from "$lib/components/site/common/ContentsNav.svelte";
	import type { RecipePagePhase } from "$lib/domain/catalog.js";

	interface Props {
		phases: readonly RecipePagePhase[];
	}

	let { phases }: Props = $props();
	let items = $derived(
		phases.flatMap((phase) => [
			{ id: phase.id, title: phase.title, depth: 0 },
			...phase.steps.map((step) => ({ id: step.id, title: step.title, depth: 1 })),
		]),
	);
</script>

<ContentsNav {items} label="Recipe contents" listDataAttribute="recipe" />
