<script lang="ts">
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import { resolve } from "$app/paths";
	import type { DirectoryPageView } from "$lib/domain/directory.js";
	import { homeSeo } from "$lib/domain/seo.js";
	import { homeCopy } from "$lib/domain/site-copy.js";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import InstallCommand from "$lib/components/site/common/InstallCommand.svelte";
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
			<InstallCommand command={installCommand} title="Install the collection" />
		{/snippet}
	</LabHero>
	<div class="mx-auto mt-14 w-full max-w-site px-4 sm:mt-18 sm:px-6 lg:px-8"><DirectoryWorkbench {directory} /></div>
</div>
