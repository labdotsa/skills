<script lang="ts">
	import { resolve } from "$app/paths";
	import ThemeToggle from "$lib/components/shared/ThemeToggle.svelte";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import type { ResolvedTheme } from "$lib/theme/theme.js";

	interface Props {
		open: boolean;
		trigger: HTMLButtonElement | null;
		theme: ResolvedTheme;
		onThemeChange: (theme: ResolvedTheme) => void;
	}

	let { open = $bindable(false), trigger, theme, onThemeChange }: Props = $props();

	const services = [
		["Research", "https://lab.sa/services/research"],
		["Design", "https://lab.sa/services/design"],
		["Development", "https://lab.sa/services/development"],
		["Marketing", "https://lab.sa/services/marketing"],
	] as const;
</script>

<Sheet.Root bind:open>
	<Sheet.Content
		class="w-[min(24rem,90vw)] p-6"
		aria-label="Mobile navigation"
		onCloseAutoFocus={(event) => {
			event.preventDefault();
			trigger?.focus();
		}}
	>
		<Sheet.Header>
			<Sheet.Title>LAB Skills</Sheet.Title>
			<Sheet.Description>Public working knowledge and LAB services.</Sheet.Description>
		</Sheet.Header>
		<nav aria-label="Mobile navigation" class="grid gap-1 py-5">
			<a class="rounded-sm px-3 py-3 font-semibold hover:bg-muted" href={resolve("/")}>Skills</a>
			<a class="rounded-sm px-3 py-3 font-semibold hover:bg-muted" href={resolve("/recipes/")}>Recipes</a>
			{#each services as service (service[0])}
				<a class="rounded-sm px-3 py-3 hover:bg-muted" href={service[1]}>{service[0]} <span aria-hidden="true">↗</span></a>
			{/each}
		</nav>
		<div class="flex items-center justify-between border-t pt-4">
			<span class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Appearance</span>
			<ThemeToggle {theme} {onThemeChange} />
		</div>
	</Sheet.Content>
</Sheet.Root>
