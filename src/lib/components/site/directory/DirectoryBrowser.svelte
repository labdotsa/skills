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
	} from "$lib/domain/directory.js";
	import CatalogRow from "./CatalogRow.svelte";
	import DirectoryEmptyState from "./DirectoryEmptyState.svelte";

	interface Props {
		collection: DirectoryCollection;
		idPrefix: string;
		rowDetail?: "summary" | "phases";
		header?: Snippet;
		emptyMessage?: string;
	}

	let { collection, idPrefix, rowDetail = "summary", header, emptyMessage = "No item matches that search." }: Props = $props();
	let query = $state("");
	let category = $state("all");
	let enhanced = $state(false);
	let searchInput = $state<HTMLInputElement | null>(null);

	let activeKind = $derived(collection.kind);
	let activeItems = $derived<readonly DirectoryItem[]>(collection.items);
	let visibleItems = $derived(filterDirectoryItems(activeItems, { query, category }));
	let categories = $derived(directoryCategories(activeItems));
	let searchLabel = $derived(activeKind === "skills" ? "Search skills" : "Search recipes");
	let searchPlaceholder = $derived(activeKind === "skills"
		? "Search by name, purpose, or file"
		: "Search by outcome, phase, or category");
	let noJavaScriptLabel = $derived(`Filtering needs JavaScript; the complete ${activeKind === "skills" ? "Skill" : "Recipe"} directory remains available below.`);
	let searchId = $derived(`${idPrefix}-search`);

	onMount(() => {
		enhanced = true;
	});

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

</script>

<svelte:document onkeydown={handleShortcut} />

<div data-directory-enhanced={enhanced} data-active-kind={activeKind}>
	{#if header}
		<div class="border-b">
			<div class="p-5 sm:p-8 lg:p-10">
				{@render header()}
			</div>
		</div>
	{/if}

	<div class="bg-card">
	<div class="grid gap-4 border-b p-4 sm:p-5 lg:grid-cols-[minmax(18rem,1fr)_auto] lg:items-center">
		<label class="relative block min-w-0">
			<span class="sr-only">{searchLabel}</span>
			<SearchIcon class="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
			<Input
				bind:ref={searchInput}
				bind:value={query}
				id={searchId}
				type="search"
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

	<div class="flex min-w-0 gap-2 overflow-x-auto border-b p-4 sm:flex-wrap sm:p-5" role="group" aria-label={`Filter ${activeKind} by category`}>
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

	<section id={`${collection.kind}-${idPrefix}`} aria-labelledby={`${collection.kind}-${idPrefix}-title`}>
		<h3 id={`${collection.kind}-${idPrefix}-title`} class="sr-only">{collection.kind === "skills" ? "Skill directory" : "Recipe directory"}</h3>
		<ul class="m-0 list-none p-0">
			{#each visibleItems as item, index (item.slug)}
				<CatalogRow {item} {index} detail={rowDetail} />
			{/each}
		</ul>
	</section>

	{#if enhanced && visibleItems.length === 0}
		<DirectoryEmptyState message={emptyMessage} onClear={clearFilters} />
	{/if}
	</div>
</div>
