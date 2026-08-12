<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import { onMount, type Snippet } from "svelte";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";

	interface Props {
		label: string;
		children: Snippet;
		collapsedHeight?: number;
		fadeHeight?: number;
		open?: boolean;
	}

	let { label, children, collapsedHeight = 496, fadeHeight = 80, open = $bindable(true) }: Props = $props();
	let enhanced = $state(false);
	let overflow = $state(false);
	let contentHeight = $state(0);
	let content = $state<HTMLDivElement | null>(null);
	let maximumHeight = $derived(enhanced && overflow ? `${open ? contentHeight : collapsedHeight}px` : "none");
	let contentMask = $derived(
		enhanced && overflow && !open
			? `linear-gradient(to bottom, black 0, black calc(100% - ${fadeHeight}px), transparent 100%)`
			: "none",
	);

	function restoreTabStop(element: HTMLElement) {
		const previous = element.dataset.overflowTabindex;
		if (previous === undefined) return;
		if (previous === "__none__") element.removeAttribute("tabindex");
		else element.setAttribute("tabindex", previous);
		delete element.dataset.overflowTabindex;
	}

	function synchronizeTabStops() {
		if (!content) return;
		const focusable = content.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]',
		);
		const visibleEdge = content.getBoundingClientRect().top + collapsedHeight;
		for (const element of focusable) {
			restoreTabStop(element);
			if (open || !overflow || element.getBoundingClientRect().bottom <= visibleEdge) continue;
			element.dataset.overflowTabindex = element.getAttribute("tabindex") ?? "__none__";
			element.setAttribute("tabindex", "-1");
		}
	}

	onMount(() => {
		enhanced = true;
		let previousOverflow = false;
		const measure = () => {
			if (!content) return;
			contentHeight = content.scrollHeight;
			const nextOverflow = contentHeight > collapsedHeight + 1;
			if (!nextOverflow) open = true;
			else if (!previousOverflow) open = false;
			overflow = nextOverflow;
			previousOverflow = nextOverflow;
			requestAnimationFrame(synchronizeTabStops);
		};
		const frame = requestAnimationFrame(measure);
		const observer = new ResizeObserver(measure);
		if (content) observer.observe(content);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	});

	$effect(() => {
		if (!enhanced) return;
		open;
		const frame = requestAnimationFrame(synchronizeTabStops);
		return () => cancelAnimationFrame(frame);
	});
</script>

<Collapsible.Root bind:open data-overflow-disclosure data-overflow={overflow} data-overflow-fade-height={fadeHeight}>
	<div class="relative">
		<Collapsible.Content
			bind:ref={content}
			forceMount
			class="overflow-hidden transition-[max-height] duration-[var(--motion-duration-editorial)] ease-[var(--motion-ease-expressive)] motion-reduce:transition-none"
			style={`max-height: ${maximumHeight}; -webkit-mask-image: ${contentMask}; mask-image: ${contentMask};`}
		>
			{@render children()}
		</Collapsible.Content>
	</div>
	{#if enhanced && overflow}
		<Collapsible.Trigger
			class={buttonVariants({ variant: "ghost", size: "lg", class: "mx-auto mt-5 flex min-w-36" })}
			aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
		>
			{open ? "Show less" : "Show more"}
			{#if open}<ChevronUpIcon aria-hidden="true" />{:else}<ChevronDownIcon aria-hidden="true" />{/if}
		</Collapsible.Trigger>
	{/if}
</Collapsible.Root>
