<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import type { DirectoryCollection, DirectoryKind } from "$lib/domain/directory.js";

	interface Props {
		collections: readonly DirectoryCollection[];
		activeKind: DirectoryKind;
		enhanced: boolean;
		idPrefix: string;
		onSelect: (kind: DirectoryKind) => void;
	}

	let { collections, activeKind, enhanced, idPrefix, onSelect }: Props = $props();

	function label(kind: DirectoryKind) {
		return kind === "skills" ? "Skills" : "Recipes";
	}

	function handleKey(event: KeyboardEvent, index: number) {
		let nextIndex: number | undefined;
		if (event.key === "ArrowRight") nextIndex = (index + 1) % collections.length;
		if (event.key === "ArrowLeft") nextIndex = (index - 1 + collections.length) % collections.length;
		if (event.key === "Home") nextIndex = 0;
		if (event.key === "End") nextIndex = collections.length - 1;
		if (nextIndex === undefined) return;
		event.preventDefault();
		const nextKind = collections[nextIndex].kind;
		onSelect(nextKind);
		queueMicrotask(() => document.getElementById(`${nextKind}-${idPrefix}-tab`)?.focus());
	}
</script>

<div class="grid grid-cols-2 gap-2" role={enhanced ? "tablist" : undefined} aria-label={enhanced ? "Browse the LAB library" : undefined}>
	{#each collections as collection, index (collection.kind)}
		<Button
			id={`${collection.kind}-${idPrefix}-tab`}
			href={`#${collection.kind}-${idPrefix}`}
			role={enhanced ? "tab" : undefined}
			aria-selected={enhanced ? activeKind === collection.kind : undefined}
			aria-controls={enhanced ? `${collection.kind}-${idPrefix}` : undefined}
			tabindex={enhanced && activeKind !== collection.kind ? -1 : 0}
			variant={activeKind === collection.kind ? "default" : "outline"}
			class="h-auto min-w-0 justify-between px-4 py-3 text-start"
			onclick={() => onSelect(collection.kind)}
			onkeydown={(event) => handleKey(event, index)}
		>
			<span class="font-display text-lg">{label(collection.kind)}</span>
			<small class="font-mono">{String(collection.items.length).padStart(2, "0")}</small>
		</Button>
	{/each}
</div>
