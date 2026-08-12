<script lang="ts">
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import { resolve } from "$app/paths";
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import type { DirectoryPageView } from "$lib/domain/directory.js";
	import { homeSeo } from "$lib/domain/seo.js";
	import { homeCopy } from "$lib/domain/site-copy.js";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import DirectoryWorkbench from "./DirectoryWorkbench.svelte";
	import { Button } from "$lib/components/ui/button/index.js";

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
		eyebrow={homeCopy.eyebrow}
		title={homeCopy.heroTitle}
		description={homeCopy.description}
		titleId="page-title"
	>
		{#snippet actions()}
			<nav class="flex flex-col gap-3 sm:flex-row" aria-label="LAB Skills actions">
				<Button class="min-h-12 w-full justify-between px-5 sm:w-auto sm:min-w-48" href="#catalog" size="lg">
					{homeCopy.primaryCta} <ArrowDownIcon aria-hidden="true" />
				</Button>
				<Button
					class="min-h-12 w-full justify-between px-5 sm:w-auto sm:min-w-48"
					href={resolve("/recipes/")}
					variant="outline"
					size="lg"
				>
					{homeCopy.secondaryCta} <ArrowRightIcon aria-hidden="true" />
				</Button>
			</nav>
		{/snippet}
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
