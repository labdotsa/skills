<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import { resolve } from "$app/paths";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import type { RecipePageView } from "$lib/domain/catalog.js";

	interface Props {
		recipe: RecipePageView;
	}

	let { recipe }: Props = $props();
</script>

<LabHero
	eyebrow={`${recipe.category.replaceAll("-", " ")} / ${recipe.status} recipe`}
	title={recipe.title}
	description={recipe.description}
	accent="var(--lab-main)"
>
	{#snippet prelude()}
		<Breadcrumb.Root aria-label="Breadcrumb">
			<Breadcrumb.List>
				<Breadcrumb.Item><Breadcrumb.Link href={resolve("/recipes/")}>LAB Recipes</Breadcrumb.Link></Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item><Breadcrumb.Page>{recipe.title}</Breadcrumb.Page></Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
	{#snippet aside()}
		<aside class="overflow-hidden rounded-lg border" aria-label="Recipe details">
			<p class="border-b bg-muted px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Recipe details</p>
			<dl class="grid grid-cols-3 divide-x">
				<div class="px-4 py-4">
					<dt class="text-xs text-muted-foreground">Phases</dt>
					<dd class="mt-1 font-mono text-lg font-semibold">{String(recipe.phases.length).padStart(2, "0")}</dd>
				</div>
				<div class="px-4 py-4">
					<dt class="text-xs text-muted-foreground">Skills</dt>
					<dd class="mt-1 font-mono text-lg font-semibold">{String(recipe.requirements.length).padStart(2, "0")}</dd>
				</div>
				<div class="px-4 py-4">
					<dt class="text-xs text-muted-foreground">Author</dt>
					<dd class="mt-1 truncate font-semibold">{recipe.author}</dd>
				</div>
			</dl>
			<a class="flex min-h-11 items-center justify-between gap-3 border-t px-4 py-3 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4" href={recipe.sourceUrl}>
				Browse Recipe source on GitHub <ExternalLinkIcon class="size-4 shrink-0" aria-hidden="true" />
			</a>
		</aside>
	{/snippet}
</LabHero>
