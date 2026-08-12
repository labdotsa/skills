<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import type { RecipeRequirementView } from "$lib/domain/catalog.js";
	import RequirementCommand from "./RequirementCommand.svelte";
	import RequirementReferenceLink from "./RequirementReferenceLink.svelte";

	interface Props {
		requirements: readonly RecipeRequirementView[];
	}

	let { requirements }: Props = $props();
</script>

<section class="border-y bg-card" aria-labelledby="recipe-requirements-title">
	<PageFrame class="py-16 sm:py-24">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Before you begin</p>
		<h2 id="recipe-requirements-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Skills used in this Recipe</h2>
		<ul
			class="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 xl:hidden"
			aria-label="Skills and tools required by this Recipe"
			data-recipe-requirements-cards
		>
			{#each requirements as requirement, index (requirement.name)}
				<li class="min-w-0 bg-background">
					<article class="p-4">
						<div class="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
							<span class="pt-0.5 font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
							<div class="min-w-0">
								<RequirementReferenceLink requirement={requirement} label={`$${requirement.name}`} class="break-words font-bold" />
								<div class="mt-1 text-sm text-muted-foreground">
									<RequirementReferenceLink requirement={requirement} label={requirement.source} class="break-words" />
								</div>
							</div>
						</div>
						<div class="mt-4">
							<RequirementCommand {requirement} />
						</div>
					</article>
				</li>
			{/each}
		</ul>

		<div class="mt-8 hidden overflow-hidden rounded-lg border bg-background xl:block" data-recipe-requirements-table>
			<div class="overflow-hidden">
				<table class="w-full table-fixed border-collapse text-start">
					<caption class="sr-only">Skills and tools required by this Recipe</caption>
					<thead>
						<tr class="border-b bg-muted text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
							<th class="w-14 px-4 py-3 text-start font-semibold" scope="col">No.</th>
							<th class="w-52 px-4 py-3 text-start font-semibold" scope="col">Skill</th>
							<th class="w-44 px-4 py-3 text-start font-semibold" scope="col">Source</th>
							<th class="px-4 py-3 text-start font-semibold" scope="col">Install or use</th>
						</tr>
					</thead>
					<tbody>
						{#each requirements as requirement, index (requirement.name)}
							<tr class="border-b last:border-b-0 hover:bg-muted/60">
								<td class="px-4 py-3 font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</td>
								<th class="px-4 py-3 text-start" scope="row">
									<RequirementReferenceLink requirement={requirement} label={`$${requirement.name}`} class="break-words font-bold" />
								</th>
								<td class="px-4 py-3 text-sm text-muted-foreground">
									<RequirementReferenceLink requirement={requirement} label={requirement.source} class="break-words" />
								</td>
								<td class="px-4 py-2.5">
									<RequirementCommand {requirement} />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</PageFrame>
</section>
