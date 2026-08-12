<script lang="ts">
	import { resolve } from "$app/paths";
	import LabWordmark from "$lib/components/shared/LabWordmark.svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import PillarDistributionBar from "$lib/components/site/common/PillarDistributionBar.svelte";
	import type { DirectoryPillarCount } from "$lib/domain/directory.js";

	interface Props {
		skillPillarCounts: readonly DirectoryPillarCount[];
	}

	let { skillPillarCounts }: Props = $props();

	const serviceLinks = [
		["Research", "https://lab.sa/services/research"],
		["Design", "https://lab.sa/services/design"],
		["Development", "https://lab.sa/services/development"],
		["Marketing", "https://lab.sa/services/marketing"],
	] as const;
</script>

<footer id="site-footer" class="border-t bg-background text-foreground" data-site-footer>
	<PillarDistributionBar counts={skillPillarCounts} />
	<PageFrame class="py-12 sm:py-16">
		<div class="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(8rem,0.5fr)_minmax(10rem,0.65fr)] lg:gap-x-16" data-footer-primary>
			<div class="max-w-md">
				<a
					class="inline-flex no-underline opacity-90 transition-opacity duration-300 hover:opacity-100"
					href="https://lab.sa"
					aria-label="LAB home"
				>
					<LabWordmark size="production" />
				</a>
				<p id="footer-lab-title" class="mt-8 text-base font-semibold leading-7 sm:text-lg sm:leading-8">We are a product innovation company. Built to explore, design, develop, and scale what matters.</p>
			</div>
			<nav class="grid content-start gap-4 text-sm" aria-label="Discovery footer navigation">
				<h2 class="mb-1 font-semibold">Discover</h2>
				<a class="w-fit text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href={resolve("/")}>Skills</a>
				<a class="w-fit text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href={resolve("/recipes/")}>Recipes</a>
				<a class="w-fit text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href="https://github.com/labdotsa/skills">Source</a>
			</nav>
			<nav class="grid content-start gap-4 text-sm" aria-label="LAB services">
				<h2 class="mb-1 font-semibold">Work with LAB</h2>
				{#each serviceLinks as service (service[0])}
					<a class="w-fit text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href={service[1]}>{service[0]}</a>
				{/each}
			</nav>
		</div>
		<div class="mt-12 border-t pt-6 text-xs text-muted-foreground sm:mt-16" data-footer-meta>
			<p>© 2026 LAB LLC. All rights reserved.</p>
		</div>
	</PageFrame>
</footer>
