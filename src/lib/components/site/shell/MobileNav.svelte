<script lang="ts">
	import MenuIcon from "@lucide/svelte/icons/menu";
	import { resolve } from "$app/paths";
	import ThemeToggle from "$lib/components/shared/ThemeToggle.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import type { ResolvedTheme, ThemePreference } from "$lib/theme/theme.js";

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

<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon" class="size-11 lg:hidden" aria-label="Open navigation">
				<MenuIcon aria-hidden="true" />
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content class="w-[min(24rem,90vw)] p-6" aria-label="Mobile navigation">
		<Sheet.Header>
			<Sheet.Title>LAB Skills</Sheet.Title>
			<Sheet.Description>Public working knowledge and LAB services.</Sheet.Description>
		</Sheet.Header>
		<nav aria-label="Mobile navigation" class="grid gap-1 py-5">
			<a class="rounded-sm px-3 py-3 font-semibold hover:bg-muted" href={resolve("/")}>Skills</a>
			{#each services as service (service[0])}
				<a class="rounded-sm px-3 py-3 hover:bg-muted" href={service[1]}>{service[0]} <span aria-hidden="true">↗</span></a>
			{/each}
		</nav>
		<ThemeToggle {preference} {resolved} {onPreferenceChange} />
	</Sheet.Content>
</Sheet.Root>
