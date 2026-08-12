<script lang="ts">
	import { asset } from "$app/paths";

	interface Props {
		label?: string;
		inverted?: boolean;
		class?: string;
	}

	let { label = "LAB", inverted = false, class: className = "" }: Props = $props();
</script>

<span class={["inline-flex items-center gap-2.5 font-display font-black tracking-[-0.03em]", className]} data-lab-wordmark>
	<img
		class={["h-[1.9em] w-auto", inverted ? "invert" : "dark:invert"]}
		src={asset("/brand/logo.svg")}
		alt=""
		width="146"
		height="195"
	/>
	<span>{label}</span>
</span>
