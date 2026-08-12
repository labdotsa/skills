<script lang="ts">
	import MenuIcon from "@lucide/svelte/icons/menu";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import LabWordmark from "$lib/components/shared/LabWordmark.svelte";
	import ThemeToggle from "$lib/components/shared/ThemeToggle.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ResolvedTheme } from "$lib/theme/theme.js";
	import MobileNav from "./MobileNav.svelte";

	interface Props {
		theme: ResolvedTheme;
		onThemeChange: (theme: ResolvedTheme) => void;
	}

	let { theme, onThemeChange }: Props = $props();

	let skillsActive = $derived(!page.url.pathname.includes("/recipes"));
	let recipesActive = $derived(page.url.pathname.includes("/recipes"));
	let mobileTrigger = $state<HTMLButtonElement | null>(null);
</script>

<header class="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl" data-site-header>
	<Sidebar.Provider open={false} class="contents">
		<div class="mx-auto flex h-24 w-full max-w-site items-center px-8">
			<a class="inline-flex h-24 items-center no-underline" href={resolve("/")} aria-label="LAB Skills home">
				<LabWordmark variant="mark" />
			</a>
			<nav class="ms-auto hidden h-24 items-stretch text-sm font-semibold lg:flex" aria-label="Discovery" data-desktop-navigation>
				<a class="site-nav-link" class:active={skillsActive} aria-current={skillsActive ? "page" : undefined} href={resolve("/")}><span>Skills</span></a>
				<a class="site-nav-link" class:active={recipesActive} aria-current={recipesActive ? "page" : undefined} href={resolve("/recipes/")}><span>Recipes</span></a>
			</nav>
			<div class="hidden h-24 items-center lg:flex" data-desktop-theme-control>
				<ThemeToggle {theme} {onThemeChange} />
			</div>
			<Sidebar.Trigger
				bind:ref={mobileTrigger}
				label="Open navigation"
				class="ms-auto size-11 rounded-sm border-0 bg-transparent text-foreground hover:bg-muted lg:hidden"
			>
				<MenuIcon class="size-5" aria-hidden="true" />
			</Sidebar.Trigger>
		</div>
		<MobileNav trigger={mobileTrigger} {theme} {onThemeChange} />
	</Sidebar.Provider>
</header>

<style>
	.site-nav-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding-inline: 1.25rem;
		text-decoration: none;
	}

	.site-nav-link::after {
		position: absolute;
		inset-inline: 0;
		inset-block-end: 0;
		height: 3px;
		background: var(--page-accent);
		content: "";
		opacity: 0;
	}

	.site-nav-link:hover,
	.site-nav-link:focus-visible,
	.site-nav-link.active {
		color: var(--foreground);
	}

	.site-nav-link:hover::after,
	.site-nav-link:focus-visible::after,
	.site-nav-link.active::after {
		opacity: 1;
	}
</style>
