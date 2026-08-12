<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import OverflowDisclosure from "$lib/components/shared/OverflowDisclosure.svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import RichDocument from "$lib/components/site/rich-content/RichDocument.svelte";
	import type { SkillPageView } from "$lib/domain/catalog.js";
	import SkillNav from "./SkillNav.svelte";

	interface Props {
		skill: SkillPageView;
	}

	let { skill }: Props = $props();
	let instructionsOpen = $state(true);
</script>

<section class="border-b" aria-labelledby="instructions-title">
	<PageFrame class="py-16 sm:py-24">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">SKILL.md</p>
				<h2 id="instructions-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Skill instructions</h2>
			</div>
			<a class="inline-flex min-h-11 items-center gap-2 self-start font-semibold underline decoration-primary decoration-2 underline-offset-4 sm:self-auto" href={skill.fileUrl}>
				View raw source <ExternalLinkIcon class="size-4" aria-hidden="true" />
			</a>
		</div>

		<div class="mt-8 grid min-w-0 gap-14 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16" data-skill-reading-layout>
			<div class="lg:col-start-2 lg:row-start-1" data-skill-contents-rail>
				<SkillNav outline={skill.outline} collapsed={!instructionsOpen} onVisit={() => (instructionsOpen = true)} />
			</div>
			<div class="min-w-0 lg:col-start-1 lg:row-start-1" data-skill-reading>
				<OverflowDisclosure label="Skill instructions" bind:open={instructionsOpen}>
					<RichDocument
						document={skill.document}
						headingOffset={1}
						class="max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground"
					/>
				</OverflowDisclosure>
			</div>
		</div>
	</PageFrame>
</section>
