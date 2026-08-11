<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import OctagonXIcon from "@lucide/svelte/icons/octagon-x";
	import InfoIcon from "@lucide/svelte/icons/info";
	import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";

	let { theme = "light", ...restProps }: SonnerProps = $props();
</script>

<Sonner
	{theme}
	class="toaster group"
	style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
	{...restProps}
>
	{#snippet loadingIcon()}
		<Loader2Icon class="size-4 motion-safe:animate-spin" aria-hidden="true" />
	{/snippet}
	{#snippet successIcon()}
		<CircleCheckIcon class="size-4" aria-hidden="true" />
	{/snippet}
	{#snippet errorIcon()}
		<OctagonXIcon class="size-4" aria-hidden="true" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-4" aria-hidden="true" />
	{/snippet}
	{#snippet warningIcon()}
		<TriangleAlertIcon class="size-4" aria-hidden="true" />
	{/snippet}
</Sonner>
