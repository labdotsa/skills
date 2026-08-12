<script lang="ts">
	import { asset } from "$app/paths";

	interface Props {
		label?: string;
		inverted?: boolean;
		variant?: "mark" | "lockup";
		class?: string;
	}

	let { label = "LAB", inverted = false, variant = "lockup", class: className = "" }: Props = $props();
</script>

<span class={["inline-flex items-center gap-2 font-display font-bold tracking-wide", className]} data-lab-wordmark data-variant={variant}>
	<img
		class={["h-auto w-8 shrink-0", inverted ? "invert" : "dark:invert"]}
		src={asset("/brand/logo.svg")}
		alt=""
		width="146"
		height="195"
	/>
	{#if variant === "lockup"}<span>{label}</span>{/if}
</span>
