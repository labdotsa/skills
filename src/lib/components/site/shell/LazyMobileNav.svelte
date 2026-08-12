<script lang="ts">
	import MenuIcon from "@lucide/svelte/icons/menu";
	import { resolve } from "$app/paths";
	import { tick, type Component } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { ResolvedTheme, ThemePreference } from "$lib/theme/theme.js";

	interface Props {
		preference: ThemePreference;
		resolved: ResolvedTheme;
		onPreferenceChange: (preference: ThemePreference) => void;
	}

	let { preference, resolved, onPreferenceChange }: Props = $props();
	let trigger = $state<HTMLButtonElement | null>(null);
	let open = $state(false);
	let loading = $state(false);
	let MobileNavigation = $state<Component<Props & { open: boolean; trigger: HTMLButtonElement | null }> | null>(null);

	async function showNavigation() {
		if (loading) return;
		loading = true;
		MobileNavigation ??= (await import("./MobileNav.svelte")).default;
		await tick();
		open = true;
		loading = false;
	}
</script>

<Button
	bind:ref={trigger}
	variant="outline"
	size="icon"
	class="size-11 lg:hidden"
	aria-label="Open navigation"
	aria-busy={loading}
	onclick={showNavigation}
>
	<MenuIcon aria-hidden="true" />
</Button>

{#if MobileNavigation}
	<MobileNavigation bind:open {trigger} {preference} {resolved} {onPreferenceChange} />
{/if}

<noscript>
	<nav class="grid gap-2 lg:hidden" aria-label="Mobile navigation without JavaScript">
		<a href={resolve("/")}>Skills</a>
		<a href={resolve("/recipes/")}>Recipes</a>
	</nav>
</noscript>
