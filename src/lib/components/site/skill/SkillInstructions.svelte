<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import OverflowDisclosure from "$lib/components/shared/OverflowDisclosure.svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import RichDocument from "$lib/components/site/rich-content/RichDocument.svelte";
	import type { SkillPageView } from "$lib/domain/catalog.js";

	interface Props {
		skill: SkillPageView;
	}

	let { skill }: Props = $props();
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

		<div class="mt-8">
			<OverflowDisclosure label="Skill instructions">
				<RichDocument
					document={skill.document}
					headingOffset={1}
					class="max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground"
				/>
			</OverflowDisclosure>
		</div>
	</PageFrame>
</section>
