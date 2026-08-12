<script lang="ts">
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import { resolve } from "$app/paths";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { recipeIndexCopy } from "$lib/domain/site-copy.js";
</script>

<LabHero
	eyebrow={recipeIndexCopy.eyebrow}
	title={recipeIndexCopy.heroTitle}
	description={recipeIndexCopy.description}
	accent="var(--lab-main)"
	titleId="recipe-index-title"
>
	{#snippet actions()}
		<nav class="flex flex-col gap-3 sm:flex-row" aria-label="Recipe index actions">
			<Button class="min-h-12 w-full justify-between px-5 sm:w-auto sm:min-w-52" href="#recipe-catalog" size="lg">
				{recipeIndexCopy.primaryCta} <ArrowDownIcon aria-hidden="true" />
			</Button>
			<Button
				class="min-h-12 w-full justify-between px-5 sm:w-auto sm:min-w-48"
				href={`${resolve("/")}#catalog`}
				variant="outline"
				size="lg"
			>
				<ArrowLeftIcon aria-hidden="true" /> {recipeIndexCopy.secondaryCta}
			</Button>
		</nav>
	{/snippet}
</LabHero>
