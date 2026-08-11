<script lang="ts">
	import SearchIcon from "@lucide/svelte/icons/search";
	import { onMount, type Snippet } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		directoryCategories,
		filterDirectoryItems,
		type DirectoryCollection,
		type DirectoryItem,
		type DirectoryKind,
	} from "$lib/domain/directory.js";
	import CatalogRow from "./CatalogRow.svelte";
	import DirectoryEmptyState from "./DirectoryEmptyState.svelte";
	import DirectoryNavigation from "./DirectoryNavigation.svelte";

	interface Props {
		collections: readonly [DirectoryCollection, ...DirectoryCollection[]];
		idPrefix: string;
		rowDetail?: "summary" | "phases";
		header?: Snippet;
		emptyMessage?: string;
	}

	let { collections, idPrefix, rowDetail = "summary", header, emptyMessage = "No item matches that search." }: Props = $props();
	let activeIndex = $state(0);
	let query = $state("");
	let category = $state("all");
	let enhanced = $state(false);
	let searchInput = $state<HTMLInputElement | null>(null);

	let activeCollection = $derived(collections[activeIndex] ?? collections[0]);
	let activeKind = $derived<DirectoryKind>(activeCollection.kind);
	let activeItems = $derived<readonly DirectoryItem[]>(activeCollection.items);
	let visibleItems = $derived(filterDirectoryItems(activeItems, { query, category }));
	let categories = $derived(directoryCategories(activeItems));
	let searchLabel = $derived(activeKind === "skills" ? "Search skills" : "Search recipes");
	let searchPlaceholder = $derived(activeKind === "skills"
		? "Search by name, purpose, or file"
		: "Search by outcome, phase, or category");
	let noJavaScriptLabel = $derived(collections.length === 1
		? `Filtering needs JavaScript; the complete ${activeKind === "skills" ? "Skill" : "Recipe"} directory remains available below.`
		: "Filtering needs JavaScript; the complete Skills and Recipes directories remain available below.");
	let searchId = $derived(`${idPrefix}-search`);
	let headerLayoutClass = $derived(collections.length > 1
		? "grid border-b lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]"
		: "border-b");
	let headerContentClass = $derived(collections.length > 1
		? "border-b p-5 sm:p-7 lg:border-b-0 lg:border-e"
		: "p-5 sm:p-7");

	onMount(() => {
		enhanced = true;
	});

	function selectKind(kind: DirectoryKind) {
		const nextIndex = collections.findIndex((collection) => collection.kind === kind);
		if (nextIndex < 0) return;
		activeIndex = nextIndex;
		query = "";
		category = "all";
	}

	function clearFilters() {
		query = "";
		category = "all";
		searchInput?.focus();
	}

	function handleShortcut(event: KeyboardEvent) {
		const target = document.activeElement;
		const ownsTextInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.getAttribute("contenteditable") === "true";
		if (event.key !== "/" || ownsTextInput || event.metaKey || event.ctrlKey || event.altKey) return;
		event.preventDefault();
		searchInput?.focus();
	}

	function rowsFor(collection: DirectoryCollection) {
		return collection.kind === activeKind ? visibleItems : collection.items;
	}
</script>

<svelte:document onkeydown={handleShortcut} />

<div data-directory-enhanced={enhanced} data-active-kind={activeKind}>
	{#if header}
		<div class={headerLayoutClass}>
			<div class={headerContentClass}>
				{@render header()}
			</div>
			{#if collections.length > 1}
				<div class="flex min-w-0 flex-col justify-end p-5 sm:p-7">
					<DirectoryNavigation {collections} {activeKind} {enhanced} {idPrefix} onSelect={selectKind} />
				</div>
			{/if}
		</div>
	{/if}

	<div class="bg-card">
	{#if collections.length > 1 && !header}
		<div class="border-b p-4 sm:p-5">
			<DirectoryNavigation {collections} {activeKind} {enhanced} {idPrefix} onSelect={selectKind} />
		</div>
	{/if}

	<div class="grid gap-4 border-b p-4 sm:p-5 lg:grid-cols-[minmax(18rem,1fr)_auto] lg:items-center">
		<label class="relative block min-w-0" for={searchId}>
			<span class="sr-only">{searchLabel}</span>
			<SearchIcon class="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
			<Input
				bind:ref={searchInput}
				bind:value={query}
				id={searchId}
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

	<div class="flex min-w-0 gap-2 overflow-x-auto border-b p-4 sm:flex-wrap sm:p-5" aria-label={`Filter ${activeKind} by category`}>
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

	<p class="border-b p-4 text-sm text-muted-foreground sm:p-5" hidden={enhanced}>{noJavaScriptLabel}</p>

	{#each collections as collection (collection.kind)}
		<section
			id={`${collection.kind}-${idPrefix}`}
			role={enhanced && collections.length > 1 ? "tabpanel" : undefined}
			aria-labelledby={enhanced && collections.length > 1 ? `${collection.kind}-${idPrefix}-tab` : `${collection.kind}-${idPrefix}-title`}
			hidden={enhanced && collection.kind !== activeKind}
		>
			<h3 id={`${collection.kind}-${idPrefix}-title`} class="sr-only">{collection.kind === "skills" ? "Skills" : "Recipes"}</h3>
			<div role="list">
				{#each rowsFor(collection) as item, index (item.slug)}
					<CatalogRow {item} {index} detail={rowDetail} />
				{/each}
			</div>
		</section>
	{/each}

	{#if enhanced && visibleItems.length === 0}
		<DirectoryEmptyState message={emptyMessage} onClear={clearFilters} />
	{/if}
	</div>
</div>
