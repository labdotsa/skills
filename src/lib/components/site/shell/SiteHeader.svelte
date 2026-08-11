<script lang="ts">
	import { asset, resolve } from "$app/paths";
	import ThemeToggle from "$lib/components/shared/ThemeToggle.svelte";
	import type { ResolvedTheme, ThemePreference } from "$lib/theme/theme.js";
	import MobileNav from "./MobileNav.svelte";

	interface Props {
		preference: ThemePreference;
		resolved: ResolvedTheme;
		onPreferenceChange: (preference: ThemePreference) => void;
	}

	let { preference, resolved, onPreferenceChange }: Props = $props();

	const services = [
		["Research", "https://lab.sa/services/research"],
		["Design", "https://lab.sa/services/design"],
		["Development", "https://lab.sa/services/development"],
		["Marketing", "https://lab.sa/services/marketing"],
	] as const;
</script>

<header class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
	<div class="mx-auto flex min-h-18 w-full max-w-site items-center gap-5 px-4 py-2 sm:px-6 lg:px-8">
		<a class="flex items-center gap-2 font-display text-xl font-black no-underline" href={resolve("/")} aria-label="LAB Skills home">
			<img class="h-9 w-auto dark:invert" src={asset("/brand/logo.svg")} alt="" width="146" height="195" />
			<span>LAB</span>
		</a>
		<nav class="ml-auto hidden items-center gap-5 text-sm lg:flex" aria-label="Discovery">
			<a class="no-underline hover:underline" href={resolve("/")}>Skills</a>
			<a class="no-underline hover:underline" href={resolve("/recipes/")}>Recipes</a>
		</nav>
		<nav class="hidden items-center gap-5 text-sm lg:flex" aria-label="LAB services">
			{#each services as service (service[0])}
				<a class="no-underline hover:underline" href={service[1]}>{service[0]}</a>
			{/each}
		</nav>
		<div class="hidden lg:block">
			<ThemeToggle {preference} {resolved} {onPreferenceChange} compact />
		</div>
		<MobileNav {preference} {resolved} {onPreferenceChange} />
	</div>
</header>
