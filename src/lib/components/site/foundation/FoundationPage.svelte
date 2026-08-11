<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import PageHead from "$lib/components/site/common/PageHead.svelte";

	interface Props {
		canonicalOrigin: string;
		indexable: boolean;
		catalogSnapshotId: string;
		skillCount: number;
		recipeCount: number;
	}

	let { canonicalOrigin, indexable, catalogSnapshotId, skillCount, recipeCount }: Props = $props();
	const installCommand = "npx skills add labdotsa/skills";
</script>

<PageHead
	title="LAB Skills — Public agent protocols"
	description="Reusable instructions shaped by how LAB researches, designs, develops, and markets digital products."
	canonicalUrl={`${canonicalOrigin}/`}
	{indexable}
/>

<PageFrame class="py-12 sm:py-18">
	<section class="grid items-end gap-10 border-b pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]" aria-labelledby="page-title">
		<div>
			<p class="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">LAB Skills / public working knowledge</p>
			<h1 id="page-title" class="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
				Working knowledge,<br /><span class="font-display">kept in the open.</span>
			</h1>
			<p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
				Reusable instructions shaped by how LAB researches, designs, develops, and markets digital products.
			</p>
		</div>
		<div class="flex min-w-0 items-center gap-3 rounded-lg border bg-code p-3 text-code-foreground shadow-[6px_6px_0_var(--lab-main)]" aria-label="Install the LAB Skills collection">
			<span class="font-mono text-primary" aria-hidden="true">$</span>
			<code class="min-w-0 flex-1 overflow-x-auto py-2 font-mono text-sm">{installCommand}</code>
			<CopyButton text={installCommand} label="Copy install command" message="Install command copied" />
		</div>
	</section>
	<section class="py-12" aria-labelledby="foundation-title" data-catalog-snapshot={catalogSnapshotId}>
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">SvelteKit foundation</p>
		<p class="mt-3 font-mono text-sm text-muted-foreground">
			{skillCount} {skillCount === 1 ? "Skill" : "Skills"} · {recipeCount} {recipeCount === 1 ? "Recipe" : "Recipes"}
		</p>
		<h2 id="foundation-title" class="mt-3 text-3xl font-bold tracking-tight">One source. Portable static output.</h2>
		<p class="mt-4 max-w-2xl leading-7 text-muted-foreground">
			Browse a growing collection of practical protocols for research, design, development, and marketing—from one fast, portable library.
		</p>
	</section>
</PageFrame>
