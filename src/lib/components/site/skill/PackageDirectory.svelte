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
			<OverflowDisclosure label="Package contents" collapsedHeight={420}>
				<div class="overflow-x-auto" data-package-table>
					<table class="w-full min-w-[42rem] border-collapse text-start">
						<caption class="sr-only">Maintained files included with this skill</caption>
						<thead>
							<tr class="border-b text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
								<th class="w-20 px-4 py-3 text-start font-semibold sm:px-5" scope="col">No.</th>
								<th class="px-4 py-3 text-start font-semibold sm:px-5" scope="col">File</th>
								<th class="w-36 px-4 py-3 text-start font-semibold sm:px-5" scope="col">Role</th>
								<th class="w-36 px-4 py-3 text-end font-semibold sm:px-5" scope="col">Source</th>
							</tr>
						</thead>
						<tbody>
							{#each files as file, index (file.path)}
								<tr class="group border-b last:border-b-0 hover:bg-muted/70" data-kind={file.kind}>
									<td class="px-4 py-3.5 font-mono text-xs text-subtle sm:px-5">{String(index + 1).padStart(2, "0")}</td>
									<th class="px-4 py-3.5 text-start sm:px-5" scope="row">
										<code class="break-all font-mono text-sm font-semibold text-foreground">{file.path}</code>
									</th>
									<td class="px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-5">{file.kind}</td>
									<td class="px-4 py-3.5 text-end sm:px-5">
										<a class="inline-flex min-h-9 items-center gap-2 font-semibold underline decoration-[var(--skill-accent)] decoration-2 underline-offset-4" href={file.sourceUrl} aria-label={`Open ${file.path} source`}>
											Open <ExternalLinkIcon class="size-4" aria-hidden="true" />
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</OverflowDisclosure>
		</div>
	</PageFrame>
</section>
