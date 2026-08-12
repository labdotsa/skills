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
	<PageFrame class="py-14 sm:py-20">
		<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.6fr)] sm:items-end">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{fileCountLabel}</p>
				<h2 id="package-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Package contents</h2>
			</div>
			<p class="leading-7 text-muted-foreground">Every maintained file included with this skill.</p>
		</div>

		<div class="mt-8 overflow-hidden rounded-lg border bg-card">
			<OverflowDisclosure label="Package contents" collapsedHeight={420} fadeHeight={176}>
				<ol class="divide-y" aria-label="Maintained files included with this skill" data-package-list>
					{#each files as file, index (file.path)}
						<li data-kind={file.kind}>
							<a
								class="group grid min-h-16 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--skill-accent)_10%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--skill-accent)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--skill-accent)] sm:grid-cols-[3rem_minmax(0,1fr)_8rem_1.5rem] sm:gap-4 sm:px-5"
								href={file.sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`Open ${file.path} source in a new tab`}
							>
								<span class="font-mono text-xs text-subtle" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
								<code class="min-w-0 truncate font-mono text-sm font-semibold text-foreground decoration-[var(--skill-accent)] decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline" title={file.path}>{file.path}</code>
								<span class="hidden text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:block">{file.kind}</span>
								<ExternalLinkIcon class="size-4 text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground" aria-hidden="true" />
							</a>
						</li>
					{/each}
				</ol>
			</OverflowDisclosure>
		</div>
	</PageFrame>
</section>
