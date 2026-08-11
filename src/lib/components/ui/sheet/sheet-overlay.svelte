<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay
	bind:ref
	data-slot="sheet-overlay"
	class={cn(
		"fixed inset-0 z-50 bg-black/25 transition-opacity duration-[var(--motion-duration-standard)] ease-[var(--motion-ease-standard)] supports-backdrop-filter:backdrop-blur-xs data-closed:opacity-0 data-open:opacity-100 motion-reduce:transition-none",
		className
	)}
	{...restProps}
/>
