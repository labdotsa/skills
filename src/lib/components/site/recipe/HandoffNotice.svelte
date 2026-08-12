<script lang="ts">
	interface Props {
		from: string;
		to: string;
	}

	let { from, to }: Props = $props();
</script>

<blockquote class="my-12 border-s-4 border-primary py-2 ps-5 sm:ps-7">
	<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Handoff · {from} → {to}</p>
	<p class="mt-2 text-lg font-bold leading-8">Carry the durable context from {from} into {to}.</p>
</blockquote>
