<script lang="ts">
	import { asset } from "$app/paths";

	interface Props {
		label?: string;
		inverted?: boolean;
		size?: "compact" | "production";
		variant?: "mark" | "lockup";
		class?: string;
	}

	let { label = "LAB", inverted = false, size = "compact", variant = "lockup", class: className = "" }: Props = $props();
</script>

<span
	class={[
		"inline-flex items-center gap-2 font-display font-bold leading-none tracking-wide",
		size === "compact" && variant === "lockup" && "h-8",
		size === "production" && "h-12 text-5xl leading-none",
		className,
	]}
	data-lab-wordmark
	data-variant={variant}
	data-size={size}
>
	<img
		class={[
			"shrink-0",
			size === "production" ? "h-12 w-8 object-contain" : size === "compact" && variant === "lockup" ? "h-8 w-auto" : "h-auto w-8",
			inverted ? "invert" : "dark:invert",
		]}
		src={asset("/brand/logo.svg")}
		alt=""
		width="146"
		height="195"
		data-lab-wordmark-mark
	/>
	{#if variant === "lockup"}
		<span
			class={size === "compact" ? "inline-flex h-8 items-center" : "inline-flex h-12 items-center pt-3"}
			data-lab-wordmark-label
		>{label}</span>
	{/if}
</span>
