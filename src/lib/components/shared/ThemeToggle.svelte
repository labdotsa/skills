<script lang="ts">
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SunIcon from "@lucide/svelte/icons/sun";
	import { Button } from "$lib/components/ui/button/index.js";
	import { oppositeTheme, type ResolvedTheme } from "$lib/theme/theme.js";

	interface Props {
		theme: ResolvedTheme;
		onThemeChange: (theme: ResolvedTheme) => void;
	}

	let { theme, onThemeChange }: Props = $props();
	let nextTheme = $derived(oppositeTheme(theme));
	let actionLabel = $derived(`Switch to ${nextTheme} appearance`);
</script>

<Button
	variant="ghost"
	size="icon"
	class="size-11 rounded-full border border-transparent hover:border-border-strong hover:bg-transparent"
	aria-label={actionLabel}
	title={actionLabel}
	data-theme-toggle
	data-current-theme={theme}
	onclick={() => onThemeChange(nextTheme)}
>
	{#if theme === "light"}
		<MoonIcon class="size-5" aria-hidden="true" />
	{:else}
		<SunIcon class="size-5" aria-hidden="true" />
	{/if}
</Button>
