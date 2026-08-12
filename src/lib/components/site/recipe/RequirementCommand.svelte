<script lang="ts">
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import type { RecipeRequirementView } from "$lib/domain/catalog.js";

	interface Props {
		requirement: RecipeRequirementView;
	}

	let { requirement }: Props = $props();
</script>

{#if requirement.installCommand}
	<div class="flex min-w-0 items-center gap-2 rounded-md bg-code px-2 text-code-foreground">
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- Keyboard access is required for horizontally scrolling long commands. -->
		<code class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-2 py-3 font-mono text-xs" aria-label={`${requirement.name} install command`} tabindex="0">{requirement.installCommand}</code>
		<CopyButton text={requirement.installCommand} label={`Copy ${requirement.name} install command`} message={`${requirement.name} install command copied`} />
	</div>
{:else}
	<div class="rounded-md border bg-muted px-4 py-3">
		<code class="font-mono text-sm">Use ${requirement.name} in Codex</code>
	</div>
{/if}
