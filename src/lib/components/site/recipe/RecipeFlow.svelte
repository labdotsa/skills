<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import FileCheck2Icon from "@lucide/svelte/icons/file-check-2";
	import MessageCircleIcon from "@lucide/svelte/icons/message-circle";
	import PackageCheckIcon from "@lucide/svelte/icons/package-check";
	import PuzzleIcon from "@lucide/svelte/icons/puzzle";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";

	const steps = [
		{ number: "01", title: "Conversation", description: "One context, one responsibility.", icon: MessageCircleIcon },
		{ number: "02", title: "Skill", description: "A reusable way of working.", icon: PuzzleIcon },
		{ number: "03", title: "Artifact", description: "A durable source of truth.", icon: FileCheck2Icon },
		{ number: "04", title: "Handoff", description: "The next layer starts cleanly.", icon: PackageCheckIcon },
	] as const;
</script>

<section class="border-y bg-card" aria-label="Recipe workflow">
	<PageFrame class="grid sm:grid-cols-2 lg:grid-cols-4">
		{#each steps as step, index (step.number)}
			<article class="relative min-w-0 border-b p-5 last:border-b-0 sm:p-7 sm:odd:border-e sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:border-e lg:last:border-e-0">
				<div class="flex items-center justify-between gap-4">
					<span class="font-mono text-sm text-muted-foreground">{step.number}</span>
					<step.icon class="size-5" aria-hidden="true" />
				</div>
				<h2 class="mt-6 text-xl font-bold">{step.title}</h2>
				<p class="mt-2 leading-7 text-muted-foreground">{step.description}</p>
				{#if index < steps.length - 1}
					<ArrowRightIcon class="absolute -end-3 top-1/2 z-10 hidden size-6 rounded-full border bg-background p-1 lg:block" aria-hidden="true" />
				{/if}
			</article>
		{/each}
	</PageFrame>
</section>
