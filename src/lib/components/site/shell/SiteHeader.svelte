<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import LabWordmark from "$lib/components/shared/LabWordmark.svelte";
	import ThemeToggle from "$lib/components/shared/ThemeToggle.svelte";
	import type { ResolvedTheme } from "$lib/theme/theme.js";
	import LazyMobileNav from "./LazyMobileNav.svelte";

	interface Props {
		theme: ResolvedTheme;
		onThemeChange: (theme: ResolvedTheme) => void;
	}

	let { theme, onThemeChange }: Props = $props();

	let skillsActive = $derived(!page.url.pathname.includes("/recipes"));
	let recipesActive = $derived(page.url.pathname.includes("/recipes"));
</script>

<header class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur" data-site-header>
	<div class="mx-auto flex min-h-20 w-full max-w-site items-center gap-5 px-4 sm:px-6 lg:px-8">
		<a class="no-underline" href={resolve("/")} aria-label="LAB Skills home">
			<LabWordmark class="text-2xl" />
		</a>
		<nav class="ms-auto hidden h-20 items-stretch text-sm font-semibold lg:flex" aria-label="Discovery">
			<a class="site-nav-link" class:active={skillsActive} aria-current={skillsActive ? "page" : undefined} href={resolve("/")}>Skills</a>
			<a class="site-nav-link" class:active={recipesActive} aria-current={recipesActive ? "page" : undefined} href={resolve("/recipes/")}>Recipes</a>
		</nav>
		<div class="hidden border-s ps-3 lg:block">
			<ThemeToggle {theme} {onThemeChange} />
		</div>
		<LazyMobileNav {theme} {onThemeChange} />
	</div>
</header>

<style>
	.site-nav-link {
		display: inline-flex;
		align-items: center;
		border-block-end: 3px solid transparent;
		padding-inline: 1.25rem;
		text-decoration: none;
	}

	.site-nav-link:hover,
	.site-nav-link:focus-visible,
	.site-nav-link.active {
		border-block-end-color: var(--lab-research);
	}
</style>
