<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
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
		<div class="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
			{#each requirements as requirement (requirement.name)}
				<article class="min-w-0 bg-background p-5 sm:p-6">
					<div class="flex items-start justify-between gap-4">
						<div class="min-w-0">
							<p class="break-words text-lg font-bold">${requirement.name}</p>
							<p class="mt-1 break-words text-sm text-muted-foreground">{requirement.source}</p>
						</div>
						{#if requirement.kind === "builtin"}<SparklesIcon class="size-5 shrink-0 text-primary" aria-hidden="true" />{/if}
					</div>
					{#if requirement.installCommand}
						<div class="mt-5 flex min-w-0 items-center gap-2 rounded-md border bg-code p-2 text-code-foreground">
							<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
							<!-- Axe requires keyboard access for horizontal scrolling. -->
							<code
								class="min-w-0 flex-1 overflow-x-auto px-2 py-2 font-mono text-xs"
								tabindex="0"
							>{requirement.installCommand}</code>
							<CopyButton
								text={requirement.installCommand}
								label={`Copy ${requirement.name} install command`}
								message={`${requirement.name} install command copied`}
							/>
						</div>
						<a class="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4" href={requirement.url}>
							View {requirement.name} source <ExternalLinkIcon class="size-4" aria-hidden="true" />
						</a>
					{:else}
						<p class="mt-5 rounded-md border bg-muted px-4 py-3 font-mono text-sm">Use ${requirement.name} in Codex</p>
					{/if}
				</article>
			{/each}
		</div>
	</PageFrame>
</section>
