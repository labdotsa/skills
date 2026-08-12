<script lang="ts">
	import type { RecipeRequirementView } from "$lib/domain/catalog.js";
	import CopyButton from "$lib/components/shared/CopyButton.svelte";

	interface Props {
		requirement: RecipeRequirementView;
		flush?: boolean;
	}

	let { requirement, flush = false }: Props = $props();
</script>

{#if requirement.installCommand}
	<div
		class={[
			"flex min-w-0 items-stretch overflow-hidden bg-code text-code-foreground transition-[border-color,background-color,box-shadow] duration-[var(--motion-duration-standard)] hover:bg-[var(--code-header)] focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring/25",
			flush
				? "min-h-14 rounded-none border-0 shadow-none sm:min-h-16"
				: "min-h-11 rounded-lg border border-border-strong/70 shadow-xs hover:border-primary/45 hover:shadow-sm focus-within:border-primary/60",
		]}
		data-code-panel
		data-code-panel-flush={flush}
	>
		<div class="flex min-w-0 flex-1 items-center gap-2 px-4">
			<span class="font-mono text-primary" aria-hidden="true">$</span>
			<code
				class="min-w-0 flex-1 truncate py-2.5 font-mono text-xs"
				title={requirement.installCommand}
				data-requirement-command-text
			>{requirement.installCommand}</code>
		</div>
		<CopyButton
			text={requirement.installCommand}
			label={`Copy ${requirement.name} install command`}
			message={`${requirement.name} install command copied`}
			class="border-0 bg-transparent text-muted-foreground hover:bg-[var(--code-header)] hover:text-foreground"
			fillCell
		/>
	</div>
{:else}
	<div
		class={[
			"flex min-w-0 items-center overflow-hidden bg-code text-code-foreground transition-[border-color,background-color,box-shadow] duration-[var(--motion-duration-standard)] hover:bg-[var(--code-header)] focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring/25",
			flush
				? "min-h-14 rounded-none border-0 shadow-none sm:min-h-16"
				: "min-h-11 rounded-lg border border-border-strong/70 shadow-xs hover:border-primary/45 hover:shadow-sm",
		]}
		data-code-panel
		data-code-panel-flush={flush}
	>
		<div class="flex min-w-0 flex-1 items-center px-4 py-2.5">
			<code class="min-w-0 flex-1 truncate font-mono text-sm" title={`Use $${requirement.name} in Codex`} data-requirement-command-text>Use ${requirement.name} in Codex</code>
		</div>
	</div>
{/if}
