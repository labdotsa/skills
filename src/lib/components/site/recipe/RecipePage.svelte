<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import type { RecipePageView } from "$lib/domain/catalog.js";
	import { recipeSeo } from "$lib/domain/seo.js";
	import RecipeHero from "./RecipeHero.svelte";
	import RecipeNav from "./RecipeNav.svelte";
	import RecipePhase from "./RecipePhase.svelte";
	import RecipeRequirements from "./RecipeRequirements.svelte";
	import RecipeRichDocument from "./RecipeRichDocument.svelte";

	interface Props {
		recipe: RecipePageView;
		catalogSnapshotId: string;
		canonicalOrigin: string;
		indexable: boolean;
	}

	let { recipe, catalogSnapshotId, canonicalOrigin, indexable }: Props = $props();
	let seo = $derived(recipeSeo(recipe, canonicalOrigin, indexable));
</script>

<PageHead {seo} />

<article data-recipe-page data-catalog-snapshot={catalogSnapshotId}>
	<RecipeHero {recipe} />
	<RecipeRequirements requirements={recipe.requirements} />
	<PageFrame class="py-16 sm:py-24">
		{#if recipe.introduction.children.length > 0}
			<div class="mb-14 max-w-3xl"><RecipeRichDocument document={recipe.introduction} /></div>
		{/if}
		<div
			class="grid min-w-0 gap-14 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16"
			data-recipe-reading-layout
		>
			<div class="lg:col-start-2 lg:row-start-1" data-recipe-contents-rail>
				<RecipeNav phases={recipe.phases} />
			</div>
			<div class="min-w-0 lg:col-start-1 lg:row-start-1" data-recipe-reading>
				{#each recipe.phases as phase, index (phase.id)}
					<RecipePhase {phase} nextPhase={recipe.phases[index + 1]} />
				{/each}
			</div>
		</div>
	</PageFrame>
</article>
