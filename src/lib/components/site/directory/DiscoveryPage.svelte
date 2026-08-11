<script lang="ts">
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import type { DirectoryPageView } from "$lib/domain/directory.js";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import DirectoryWorkbench from "./DirectoryWorkbench.svelte";

	interface Props {
		canonicalOrigin: string;
		indexable: boolean;
		catalogSnapshotId: string;
		directory: DirectoryPageView;
	}

	let { canonicalOrigin, indexable, catalogSnapshotId, directory }: Props = $props();
	const installCommand = "npx skills add labdotsa/skills";
</script>

<PageHead
	title="LAB Skills — Public agent protocols"
	description="Reusable instructions shaped by how LAB researches, designs, develops, and markets digital products."
	canonicalUrl={`${canonicalOrigin}/`}
	{indexable}
/>

<PageFrame class="py-12 sm:py-18">
	<section class="grid items-end gap-10 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]" aria-labelledby="page-title" data-catalog-snapshot={catalogSnapshotId}>
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
	<DirectoryWorkbench {directory} />
</PageFrame>
