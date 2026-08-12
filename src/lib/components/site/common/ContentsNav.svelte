<script lang="ts">
	import { onMount } from "svelte";

	export type ContentsNavItem = Readonly<{
		id: string;
		title: string;
		depth: number;
	}>;

	interface Props {
		items: readonly ContentsNavItem[];
		label: string;
		onVisit?: () => void;
		listDataAttribute?: "recipe" | "skill";
		visibleOnly?: boolean;
		visibilityRegionSelector?: string;
	}

	let { items, label, onVisit, listDataAttribute = "skill", visibleOnly = false, visibilityRegionSelector }: Props = $props();
	let activeId = $state("");
	let visibleIds = $state<ReadonlySet<string>>(new Set());
	let mounted = $state(false);
	let topDepth = $derived(items.length > 0 ? Math.min(...items.map((item) => item.depth)) : 0);
	let displayedItems = $derived.by(() => {
		const visibilityFiltered = visibleOnly ? items.filter((item) => visibleIds.has(item.id)) : items;
		if (visibilityFiltered.length === 0) return visibilityFiltered;
		const branchDepth = topDepth + 1;
		const activeIndex = items.findIndex((item) => item.id === activeId);
		let activeBranchIndex = -1;
		for (let index = activeIndex; index >= 0; index -= 1) {
			if (items[index]?.depth === branchDepth) {
				activeBranchIndex = index;
				break;
			}
		}
		let activeBranchEnd = items.length;
		if (activeBranchIndex >= 0) {
			for (let index = activeBranchIndex + 1; index < items.length; index += 1) {
				if ((items[index]?.depth ?? branchDepth) <= branchDepth) {
					activeBranchEnd = index;
					break;
				}
			}
		}
		return visibilityFiltered.filter((item) => {
			if (item.depth <= branchDepth) return true;
			const index = items.indexOf(item);
			return activeBranchIndex >= 0 && index > activeBranchIndex && index < activeBranchEnd;
		});
	});

	function indentation(depth: number) {
		const relativeDepth = Math.max(0, depth - topDepth);
		if (relativeDepth === 0) return "-ms-px ps-4 font-bold";
		if (relativeDepth === 1) return "ps-7";
		return "ps-11 text-sm";
	}

	function measureVisibleItems() {
		if (!visibleOnly || !visibilityRegionSelector) {
			visibleIds = new Set(items.map((item) => item.id));
			return;
		}
		const region = document.querySelector<HTMLElement>(visibilityRegionSelector);
		if (!region) return;
		const visibleBottom = region.getBoundingClientRect().bottom + 1;
		visibleIds = new Set(
			items
				.filter((item) => {
					const heading = document.getElementById(item.id);
					return heading !== null && heading.getBoundingClientRect().top < visibleBottom;
				})
				.map((item) => item.id),
		);
	}

	function validHash() {
		const id = decodeURIComponent(location.hash.slice(1));
		return items.some((item) => item.id === id) ? id : "";
	}

	function updateFromViewport() {
		const candidates = items
			.map((item) => document.getElementById(item.id))
			.filter((element): element is HTMLElement => element !== null);
		const current = candidates.reduce(
			(selected, element) => (element.getBoundingClientRect().top <= 176 ? element : selected),
			candidates[0],
		);
		if (current) activeId = current.id;
	}

	function visit(event: MouseEvent, id: string) {
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		onVisit?.();
		activeId = id;
		location.hash = id;
		target.scrollIntoView({
			behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
			block: "start",
		});
		target.focus({ preventScroll: true });
	}

	onMount(() => {
		mounted = true;
		let frame = 0;
		const scheduleViewportUpdate = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const hashId = validHash();
				if (visibleOnly && hashId) activeId = hashId;
				else updateFromViewport();
				measureVisibleItems();
			});
		};
		const scheduleMeasurement = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measureVisibleItems);
		};
		const updateFromHash = () => {
			activeId = validHash() || items[0]?.id || "";
		};

		updateFromHash();
		if (!validHash()) updateFromViewport();
		measureVisibleItems();
		window.addEventListener("scroll", scheduleViewportUpdate, { passive: true });
		window.addEventListener("resize", scheduleMeasurement);
		window.addEventListener("hashchange", updateFromHash);
		const region = visibilityRegionSelector ? document.querySelector<HTMLElement>(visibilityRegionSelector) : null;
		const observer = new ResizeObserver(scheduleMeasurement);
		if (region) observer.observe(region);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener("scroll", scheduleViewportUpdate);
			window.removeEventListener("resize", scheduleMeasurement);
			window.removeEventListener("hashchange", updateFromHash);
		};
	});

	$effect(() => {
		if (!mounted) return;
		visibleOnly;
		items;
		if (!visibleOnly) activeId = validHash() || activeId;
		const frame = requestAnimationFrame(measureVisibleItems);
		return () => cancelAnimationFrame(frame);
	});
</script>

<nav class="lg:sticky lg:top-24 lg:self-start" aria-label={label}>
	<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Contents</p>
	<ol
		class="mt-4 border-s"
		data-recipe-contents={listDataAttribute === "recipe" ? "" : undefined}
		data-skill-contents={listDataAttribute === "skill" ? "" : undefined}
	>
		{#each displayedItems as item (item.id)}
			<li>
				<a
					class={`flex min-h-9 items-center gap-3 border-s-2 py-1.5 pe-2 transition-colors duration-[var(--motion-duration-standard)] motion-reduce:transition-none ${indentation(item.depth)}`}
					class:border-primary={activeId === item.id}
					class:border-transparent={activeId !== item.id}
					class:text-muted-foreground={item.depth > topDepth && activeId !== item.id}
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
