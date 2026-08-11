<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import OverflowDisclosure from "$lib/components/shared/OverflowDisclosure.svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import type { SkillPackageFile } from "$lib/domain/catalog.js";

	interface Props {
		files: readonly SkillPackageFile[];
	}

	let { files }: Props = $props();
	let fileCountLabel = $derived(`${files.length} ${files.length === 1 ? "file" : "files"}`);
</script>

<section class="border-b" aria-labelledby="package-title">
	<PageFrame class="py-16 sm:py-24">
		<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.6fr)] sm:items-end">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{fileCountLabel}</p>
				<h2 id="package-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Package contents</h2>
			</div>
			<p class="leading-7 text-muted-foreground">Every maintained file included with this skill.</p>
		</div>

		<div class="mt-8">
			<OverflowDisclosure label="Package contents" collapsedHeight={300}>
				<ol class="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each files as file, index (file.path)}
						<li class="flex min-h-64 min-w-0 flex-col overflow-hidden rounded-lg border bg-card" data-kind={file.kind}>
							<span class="flex min-h-32 items-center justify-center bg-[var(--skill-accent)] font-display text-5xl font-black text-[var(--lab-on-accent)]" aria-hidden="true">
								{String(index + 1).padStart(2, "0")}
							</span>
							<a class="flex min-w-0 flex-1 flex-col items-start justify-between gap-6 p-5 no-underline hover:bg-muted/60 focus-visible:bg-muted/60" href={file.sourceUrl} aria-label={`Open ${file.path} source`}>
								<code class="max-w-full break-words whitespace-normal font-sans text-base font-bold">{file.path}</code>
								<span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Open <ExternalLinkIcon class="size-4" aria-hidden="true" /></span>
							</a>
						</li>
					{/each}
				</ol>
			</OverflowDisclosure>
		</div>
	</PageFrame>
</section>
