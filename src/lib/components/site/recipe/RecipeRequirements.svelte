<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import type { RecipeRequirementView } from "$lib/domain/catalog.js";

	interface Props {
		requirements: readonly RecipeRequirementView[];
	}

	let { requirements }: Props = $props();
</script>

<section class="border-y bg-card" aria-labelledby="recipe-requirements-title">
	<PageFrame class="py-16 sm:py-24">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Before you begin</p>
		<h2 id="recipe-requirements-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Skills used in this Recipe</h2>
		<div class="mt-8 overflow-hidden rounded-lg border bg-background" data-recipe-requirements-table>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[60rem] border-collapse text-start">
					<caption class="sr-only">Skills and tools required by this Recipe</caption>
					<thead>
						<tr class="border-b bg-muted text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
							<th class="w-14 px-4 py-3 text-start font-semibold" scope="col">No.</th>
							<th class="w-56 px-4 py-3 text-start font-semibold" scope="col">Skill</th>
							<th class="w-48 px-4 py-3 text-start font-semibold" scope="col">Source</th>
							<th class="px-4 py-3 text-start font-semibold" scope="col">Install or use</th>
							<th class="w-32 px-4 py-3 text-end font-semibold" scope="col">Reference</th>
						</tr>
					</thead>
					<tbody>
						{#each requirements as requirement, index (requirement.name)}
							<tr class="border-b last:border-b-0 hover:bg-muted/60">
								<td class="px-4 py-3 font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</td>
								<th class="px-4 py-3 text-start" scope="row">
									<span class="font-bold">${requirement.name}</span>
								</th>
								<td class="px-4 py-3 text-sm text-muted-foreground">{requirement.source}</td>
								<td class="px-4 py-2.5">
									{#if requirement.installCommand}
										<div class="flex min-w-0 items-center gap-2 rounded-md bg-code px-2 text-code-foreground">
											<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
											<!-- Keyboard access is required for horizontally scrolling long commands. -->
											<section class="min-w-0 flex-1 overflow-x-auto px-2 py-3" aria-label={`${requirement.name} install command`} tabindex="0">
												<code class="font-mono text-xs">{requirement.installCommand}</code>
											</section>
											<CopyButton text={requirement.installCommand} label={`Copy ${requirement.name} install command`} message={`${requirement.name} install command copied`} />
										</div>
									{:else}
										<code class="font-mono text-sm">Use ${requirement.name} in Codex</code>
									{/if}
								</td>
								<td class="px-4 py-3 text-end">
									{#if requirement.kind !== "builtin"}
										<a class="inline-flex min-h-9 items-center gap-2 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4" href={requirement.url}>
											Source <ExternalLinkIcon class="size-4" aria-hidden="true" />
										</a>
									{:else}
										<span class="text-sm text-muted-foreground">Built in</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</PageFrame>
</section>
