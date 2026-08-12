<script lang="ts">
	import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { useSidebar } from "./context.svelte.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		label = "Toggle Sidebar",
		onclick,
		...restProps
	}: ComponentProps<typeof Button> & {
		label?: string;
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<Button
	bind:ref
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	variant="ghost"
	size="icon-sm"
	class={cn("cn-sidebar-trigger", className)}
	type="button"
	aria-label={label}
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<PanelLeftIcon aria-hidden="true" />
	{/if}
	<span class="sr-only">{label}</span>
</Button>
