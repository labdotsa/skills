<script lang="ts">
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import type { DirectoryPageView } from "$lib/domain/directory.js";
	import { homeSeo } from "$lib/domain/seo.js";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import DirectoryWorkbench from "./DirectoryWorkbench.svelte";

	interface Props {
		canonicalOrigin: string;
		indexable: boolean;
		catalogSnapshotId: string;
		directory: DirectoryPageView;
	}

	let { canonicalOrigin, indexable, catalogSnapshotId, directory }: Props = $props();
	let seo = $derived(homeSeo(directory, canonicalOrigin, indexable));
	const installCommand = "npx skills add labdotsa/skills";
</script>

<PageHead {seo} />

<div data-catalog-snapshot={catalogSnapshotId}>
	<LabHero
		eyebrow="LAB Skills / public working knowledge"
		title="Working knowledge, kept in the open."
		description="Reusable instructions shaped by how LAB researches, designs, develops, and markets digital products."
		titleId="page-title"
	>
		{#snippet aside()}
			<div class="min-w-0 overflow-hidden rounded-lg border border-border-strong bg-code text-code-foreground" role="group" aria-label="Install the LAB Skills collection">
				<p class="border-b border-zinc-700 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Install the collection</p>
				<div class="flex min-w-0 items-center gap-3 p-3">
					<span class="font-mono text-primary" aria-hidden="true">$</span>
					<code class="min-w-0 flex-1 overflow-x-auto py-2 font-mono text-sm">{installCommand}</code>
					<CopyButton text={installCommand} label="Copy install command" message="Install command copied" />
				</div>
			</div>
		{/snippet}
	</LabHero>
	<div class="mx-auto mt-14 w-full max-w-site px-4 sm:mt-18 sm:px-6 lg:px-8"><DirectoryWorkbench {directory} /></div>
</div>
