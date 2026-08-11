<script lang="ts">
	import type { RichDocument } from "$lib/domain/rich-content.js";
	import RichNode from "./RichNode.svelte";

	interface Props {
		document: RichDocument;
		class?: string;
	}

	let { document, class: className }: Props = $props();
</script>

<div class={className} data-rich-document>
	{#each document.children as node, index (`${node.type}-${index}`)}
		<RichNode {node} />
	{/each}
</div>
