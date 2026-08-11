<script lang="ts">
	import XIcon from "@lucide/svelte/icons/x";
	import { Button } from "$lib/components/ui/button/index.js";
	interface Props {
		message: string;
		onClear: () => void;
	}

	let { message, onClear }: Props = $props();
</script>

<div class="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
	<p class="text-xl font-semibold">{message}</p>
	<Button variant="outline" onclick={onClear}><XIcon data-icon="inline-start" aria-hidden="true" />Clear filters</Button>
</div>
