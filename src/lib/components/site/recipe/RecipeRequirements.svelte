<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import InstallCommand from "$lib/components/site/common/InstallCommand.svelte";
	import type { RecipeRequirementView } from "$lib/domain/catalog.js";
	import RequirementCommand from "./RequirementCommand.svelte";
	import RequirementReferenceLink from "./RequirementReferenceLink.svelte";

	interface Props {
		requirements: readonly RecipeRequirementView[];
		installCommand?: string;
		fallbackInstallCommand?: string;
	}

	let { requirements, installCommand, fallbackInstallCommand }: Props = $props();
</script>

<section class="border-y bg-card" aria-labelledby="recipe-requirements-title" data-theme-transition-surface>
	<PageFrame class="py-16 sm:py-24">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Before you begin</p>
		<h2 id="recipe-requirements-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Skills used in this Recipe</h2>
		{#if installCommand}
			<div class="mt-8" data-recipe-install-all>
				<InstallCommand command={installCommand} title="Install all Recipe skills" accent="var(--page-accent)" />
			</div>
			{#if fallbackInstallCommand}
				<details class="mt-4 max-w-3xl text-sm text-muted-foreground" data-recipe-install-fallback>
					<summary class="w-fit cursor-pointer font-semibold text-foreground underline-offset-4 hover:underline">Install without the Pack</summary>
					<div class="mt-4">
						<InstallCommand command={fallbackInstallCommand} title="Install Recipe skills by repository" accent="var(--page-accent)" />
					</div>
				</details>
			{/if}
		{/if}
		<ul
			class="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 xl:hidden"
			aria-label="Skills and tools required by this Recipe"
			data-recipe-requirements-cards
		>
			{#each requirements as requirement, index (requirement.name)}
				<li class="min-w-0 bg-background">
					<article>
						<div class="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 p-4">
							<span class="pt-0.5 font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
							<div class="min-w-0">
								<RequirementReferenceLink requirement={requirement} label={`$${requirement.name}`} class="break-words font-bold" />
								<div class="mt-1 text-sm text-muted-foreground">
									<RequirementReferenceLink requirement={requirement} label={requirement.source} class="break-words" />
								</div>
							</div>
						</div>
						<div class="border-t" data-requirement-command-cell>
							<RequirementCommand {requirement} flush />
						</div>
					</article>
				</li>
			{/each}
		</ul>

		<div class="mt-8 hidden overflow-hidden rounded-xl border bg-background shadow-sm xl:block" data-recipe-requirements-table>
			<div class="overflow-hidden">
				<table class="w-full table-fixed border-collapse text-start">
					<caption class="sr-only">Skills and tools required by this Recipe</caption>
					<thead>
						<tr class="border-b bg-muted/70 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
							<th class="w-20 px-5 py-3.5 text-start font-semibold" scope="col">No.</th>
							<th class="w-60 px-4 py-3.5 text-start font-semibold" scope="col">Skill</th>
							<th class="w-52 px-4 py-3.5 text-start font-semibold" scope="col">Source</th>
							<th class="border-s px-4 py-3.5 text-start font-semibold" scope="col">Install or use</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border/80">
						{#each requirements as requirement, index (requirement.name)}
							<tr class="group/requirement transition-colors duration-[var(--motion-duration-standard)] hover:bg-accent/35 focus-within:bg-accent/35">
								<td class="px-5 py-3.5 font-mono text-xs text-subtle">
									<span class="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-muted/50 transition-colors duration-[var(--motion-duration-standard)] group-hover/requirement:border-primary/35 group-hover/requirement:bg-accent/70 group-hover/requirement:text-foreground">{String(index + 1).padStart(2, "0")}</span>
								</td>
								<th class="px-4 py-3.5 text-start" scope="row">
									<RequirementReferenceLink requirement={requirement} label={`$${requirement.name}`} class="break-words font-bold" />
								</th>
								<td class="px-4 py-3.5 text-sm text-muted-foreground">
									<RequirementReferenceLink requirement={requirement} label={requirement.source} class="break-words" />
								</td>
								<td class="border-s p-0" data-requirement-command-cell>
									<RequirementCommand {requirement} flush />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</PageFrame>
</section>
