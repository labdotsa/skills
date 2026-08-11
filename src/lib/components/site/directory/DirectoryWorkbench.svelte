<script lang="ts">
	import SearchIcon from "@lucide/svelte/icons/search";
	import XIcon from "@lucide/svelte/icons/x";
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		directoryCategories,
		filterDirectoryItems,
		type DirectoryItem,
		type DirectoryKind,
		type DirectoryPageView,
	} from "$lib/domain/directory.js";
	import CatalogRow from "./CatalogRow.svelte";

	interface Props {
		directory: DirectoryPageView;
	}

	let { directory }: Props = $props();
	let activeKind = $state<DirectoryKind>("skills");
	let query = $state("");
	let category = $state("all");
	let enhanced = $state(false);
	let searchInput = $state<HTMLInputElement | null>(null);
	let skillsTab = $state<HTMLAnchorElement | null>(null);
	let recipesTab = $state<HTMLAnchorElement | null>(null);

	let activeItems = $derived<readonly DirectoryItem[]>(activeKind === "skills" ? directory.skills : directory.recipes);
	let visibleItems = $derived(filterDirectoryItems(activeItems, { query, category }));
	let categories = $derived(directoryCategories(activeItems));
	let skillRows = $derived(activeKind === "skills" ? visibleItems : directory.skills);
	let recipeRows = $derived(activeKind === "recipes" ? visibleItems : directory.recipes);
	let searchLabel = $derived(activeKind === "skills" ? "Search skills" : "Search recipes");
	let searchPlaceholder = $derived(activeKind === "skills"
		? "Search by name, purpose, or file"
		: "Search by outcome, category, or status");

	onMount(() => {
		enhanced = true;
	});

	function selectKind(kind: DirectoryKind) {
		activeKind = kind;
		query = "";
		category = "all";
	}

	function clearFilters() {
		query = "";
		category = "all";
		searchInput?.focus();
	}

	function handleTabKey(event: KeyboardEvent) {
		let nextKind: DirectoryKind | undefined;
		if (event.key === "ArrowRight" || event.key === "End") nextKind = "recipes";
		if (event.key === "ArrowLeft" || event.key === "Home") nextKind = "skills";
		if (!nextKind) return;
		event.preventDefault();
		selectKind(nextKind);
		queueMicrotask(() => (nextKind === "skills" ? skillsTab : recipesTab)?.focus());
	}

	function handleShortcut(event: KeyboardEvent) {
		const target = document.activeElement;
		const ownsTextInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.getAttribute("contenteditable") === "true";
		if (event.key !== "/" || ownsTextInput || event.metaKey || event.ctrlKey || event.altKey) return;
		event.preventDefault();
		searchInput?.focus();
	}
</script>

<svelte:document onkeydown={handleShortcut} />

<section
	class="border-y"
	id="catalog"
	aria-labelledby="catalog-title"
	data-directory-enhanced={enhanced}
	data-skill-count={directory.skills.length}
	data-recipe-count={directory.recipes.length}
>
	<div class="grid border-b lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]">
		<div class="border-b p-5 sm:p-7 lg:border-b-0 lg:border-e">
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Public library</p>
			<h2 id="catalog-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Browse the working library.</h2>
			<p class="mt-3 max-w-xl leading-7 text-muted-foreground">
				Focused instructions and sequenced delivery recipes, generated from the repository’s validated source.
			</p>
		</div>
		<div class="flex min-w-0 flex-col justify-end p-5 sm:p-7">
			<div class="grid grid-cols-2 gap-2" role={enhanced ? "tablist" : undefined} aria-label="Browse the LAB library">
				<Button
					bind:ref={skillsTab}
					id="skills-tab"
					href="#skills-directory"
					role={enhanced ? "tab" : undefined}
					aria-selected={enhanced ? activeKind === "skills" : undefined}
					aria-controls={enhanced ? "skills-directory" : undefined}
					tabindex={enhanced && activeKind !== "skills" ? -1 : 0}
					variant={activeKind === "skills" ? "default" : "outline"}
					class="h-auto min-w-0 justify-between px-4 py-3 text-start"
					onclick={() => selectKind("skills")}
					onkeydown={handleTabKey}
				>
					<span class="font-display text-lg">Skills</span>
					<small class="font-mono">{String(directory.skills.length).padStart(2, "0")}</small>
				</Button>
				<Button
					bind:ref={recipesTab}
					id="recipes-tab"
					href="#recipes-directory"
					role={enhanced ? "tab" : undefined}
					aria-selected={enhanced ? activeKind === "recipes" : undefined}
					aria-controls={enhanced ? "recipes-directory" : undefined}
					tabindex={enhanced && activeKind !== "recipes" ? -1 : 0}
					variant={activeKind === "recipes" ? "default" : "outline"}
					class="h-auto min-w-0 justify-between px-4 py-3 text-start"
					onclick={() => selectKind("recipes")}
					onkeydown={handleTabKey}
				>
					<span class="font-display text-lg">Recipes</span>
					<small class="font-mono">{String(directory.recipes.length).padStart(2, "0")}</small>
				</Button>
			</div>
		</div>
	</div>

	<div class="bg-card">
		<div class="grid gap-4 border-b p-4 sm:p-5 lg:grid-cols-[minmax(18rem,1fr)_auto] lg:items-center">
			<label class="relative block min-w-0" for="directory-search">
				<span class="sr-only">{searchLabel}</span>
				<SearchIcon class="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
				<Input
					bind:ref={searchInput}
					bind:value={query}
					id="directory-search"
					type="search"
					aria-label={searchLabel}
					placeholder={searchPlaceholder}
					autocomplete="off"
					class="h-11 ps-10 pe-12"
				/>
				<kbd class="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 rounded border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">/</kbd>
			</label>
			<p class="font-mono text-sm text-muted-foreground" aria-live="polite">
				{visibleItems.length} of {activeItems.length} {activeKind}
			</p>
		</div>

		<div class="flex min-w-0 gap-2 overflow-x-auto border-b p-4 sm:flex-wrap sm:p-5" aria-label="Filter the directory by discipline">
			{#each categories as option (option.value)}
				<Button
					variant={category === option.value ? "secondary" : "ghost"}
					class="shrink-0"
					aria-pressed={category === option.value}
					onclick={() => category = option.value}
				>
					<span>{option.label}</span>
					<small class="font-mono">{String(option.count).padStart(2, "0")}</small>
				</Button>
			{/each}
		</div>

		<p class="border-b p-4 text-sm text-muted-foreground sm:p-5" hidden={enhanced}>
			Filtering needs JavaScript; the complete Skills and Recipes directories remain available below.
		</p>

		<section id="skills-directory" role={enhanced ? "tabpanel" : undefined} aria-labelledby={enhanced ? "skills-tab" : "skills-directory-title"} hidden={enhanced && activeKind !== "skills"}>
			<h3 id="skills-directory-title" class="sr-only">Skills</h3>
			<div role="list">
				{#each skillRows as item, index (item.slug)}
					<CatalogRow {item} {index} />
				{/each}
			</div>
		</section>

		<section id="recipes-directory" role={enhanced ? "tabpanel" : undefined} aria-labelledby={enhanced ? "recipes-tab" : "recipes-directory-title"} hidden={enhanced && activeKind !== "recipes"}>
			<h3 id="recipes-directory-title" class="sr-only">Recipes</h3>
			<div role="list">
				{#each recipeRows as item, index (item.slug)}
					<CatalogRow {item} {index} />
				{/each}
			</div>
		</section>

		{#if enhanced && visibleItems.length === 0}
			<div class="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
				<p class="text-xl font-semibold">No item matches that search.</p>
				<Button variant="outline" onclick={clearFilters}><XIcon data-icon="inline-start" />Clear filters</Button>
			</div>
		{/if}
	</div>
</section>
