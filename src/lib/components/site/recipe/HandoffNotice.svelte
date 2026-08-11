<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";

	interface Props {
		from: string;
		to: string;
	}

	let { from, to }: Props = $props();
</script>

<aside class="my-12 border-y bg-card px-5 py-6 sm:px-7" aria-label={`Handoff from ${from} to ${to}`}>
	<div class="flex items-start gap-4">
		<ArrowRightIcon class="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Layer handoff</p>
			<p class="mt-2 text-lg font-bold">Carry the durable context from {from} into {to}.</p>
		</div>
	</div>
</aside>
