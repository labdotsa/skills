<script lang="ts">
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import { resolve } from "$app/paths";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<LabHero
	eyebrow="LAB Recipes / sequenced delivery"
	title="LAB Recipes turn focused skills into complete delivery."
	description="Move from idea to outcome with clear conversations, durable artifacts, and deliberate handoffs."
	accent="var(--lab-main)"
	titleId="recipe-index-title"
>
	{#snippet aside()}
		<nav class="flex flex-col gap-3 sm:flex-row lg:flex-col" aria-label="Recipe index actions">
			<Button href="#recipe-catalog" size="lg">Browse the recipes <ArrowDownIcon aria-hidden="true" /></Button>
			<Button href={`${resolve("/")}#catalog`} variant="outline" size="lg"><ArrowLeftIcon aria-hidden="true" />Explore skills</Button>
		</nav>
	{/snippet}
</LabHero>
