<script lang="ts">
	import { onMount } from "svelte";
	import type { RecipePagePhase } from "$lib/domain/catalog.js";

	interface Props {
		phases: readonly RecipePagePhase[];
	}

	let { phases }: Props = $props();
	let activeId = $state("");
	let items = $derived(phases.flatMap((phase) => [
		{ id: phase.id, title: phase.title, kind: "phase" as const },
		...phase.steps.map((step) => ({ id: step.id, title: step.title, kind: "step" as const })),
	]));

	function validHash() {
		const id = decodeURIComponent(location.hash.slice(1));
		return items.some((item) => item.id === id) ? id : "";
	}

	function updateFromViewport() {
		const candidates = items
			.map((item) => document.getElementById(item.id))
			.filter((element): element is HTMLElement => element !== null);
		const current = candidates.reduce((selected, element) =>
			element.getBoundingClientRect().top <= 176 ? element : selected, candidates[0]);
		if (current) activeId = current.id;
	}

	function visit(event: MouseEvent, id: string) {
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		activeId = id;
		location.hash = id;
		target.scrollIntoView({
			behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
			block: "start",
		});
		target.focus({ preventScroll: true });
	}

	onMount(() => {
		let frame = 0;
		const scheduleViewportUpdate = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(updateFromViewport);
		};
		const updateFromHash = () => {
			activeId = validHash() || items[0]?.id || "";
		};

		updateFromHash();
		if (!validHash()) updateFromViewport();
		window.addEventListener("scroll", scheduleViewportUpdate, { passive: true });
		window.addEventListener("resize", scheduleViewportUpdate);
		window.addEventListener("hashchange", updateFromHash);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", scheduleViewportUpdate);
			window.removeEventListener("resize", scheduleViewportUpdate);
			window.removeEventListener("hashchange", updateFromHash);
		};
	});
</script>

<nav class="lg:sticky lg:top-24 lg:self-start" aria-label="Recipe contents">
	<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Contents</p>
	<ol class="mt-4 border-s" data-recipe-contents>
		{#each items as item (item.id)}
			<li>
				<a
					class="flex min-h-11 items-center gap-3 border-s-2 py-2 pe-2 transition-colors motion-reduce:transition-none"
					class:-ms-px={item.kind === "phase"}
					class:ps-4={item.kind === "phase"}
					class:ps-8={item.kind === "step"}
					class:border-primary={activeId === item.id}
					class:border-transparent={activeId !== item.id}
					class:font-bold={item.kind === "phase"}
					class:text-muted-foreground={item.kind === "step" && activeId !== item.id}
					href={`#${item.id}`}
					aria-current={activeId === item.id ? "location" : undefined}
					onclick={(event) => visit(event, item.id)}
				>
					{item.title}
				</a>
			</li>
		{/each}
	</ol>
</nav>
