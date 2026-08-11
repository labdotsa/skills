<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import { resolve } from "$app/paths";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import type { RecipePageView } from "$lib/domain/catalog.js";

	interface Props {
		recipe: RecipePageView;
	}

	let { recipe }: Props = $props();
</script>

<header class="border-b">
	<PageFrame class="py-12 sm:py-16 lg:py-24">
		<Breadcrumb.Root aria-label="Breadcrumb">
			<Breadcrumb.List>
				<Breadcrumb.Item><Breadcrumb.Link href={resolve("/recipes/")}>LAB Recipes</Breadcrumb.Link></Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item><Breadcrumb.Page>{recipe.title}</Breadcrumb.Page></Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
			<div class="min-w-0">
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
					{recipe.category.replaceAll("-", " ")} / {recipe.status} recipe
				</p>
				<h1 class="mt-4 max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
					{recipe.title}
				</h1>
				<p class="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{recipe.description}</p>
			</div>
			<aside class="border-s-4 border-primary ps-5" aria-label="Recipe summary">
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Outcome</p>
				<p class="mt-2 break-words text-xl font-bold">{recipe.outcome.replaceAll("-", " ")}</p>
				<p class="mt-3 text-sm text-muted-foreground">{recipe.phases.length} phases · {recipe.requirements.length} skills · by {recipe.author}</p>
				<a class="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-primary decoration-2 underline-offset-4" href={recipe.sourceUrl}>
					Browse Recipe source on GitHub <ExternalLinkIcon class="size-4 shrink-0" aria-hidden="true" />
				</a>
			</aside>
		</div>
	</PageFrame>
</header>
