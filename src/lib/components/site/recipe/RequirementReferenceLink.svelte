<script lang="ts">
	import type { RecipeRequirementView } from "$lib/domain/catalog.js";

	interface Props {
		requirement: RecipeRequirementView;
		label: string;
		class?: string;
	}

	let { requirement, label, class: className = "" }: Props = $props();
</script>

{#if requirement.kind !== "builtin"}
	<a
		class={[
			"rounded-sm decoration-primary decoration-2 underline-offset-4 transition-colors duration-[var(--motion-duration-standard)] hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline",
			className,
		]}
		href={requirement.url}
		target="_blank"
		rel="noopener noreferrer"
	>
		{label}<span class="sr-only"> (opens in a new tab)</span>
	</a>
{:else}
	<span class={className}>{label}</span>
{/if}
