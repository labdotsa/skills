<script lang="ts">
	import type { RichDocument } from "$lib/domain/rich-content.js";
	import RichNode from "./RichNode.svelte";

	interface Props {
		document: RichDocument;
		class?: string;
		headingOffset?: 0 | 1;
	}

	let { document, class: className, headingOffset = 0 }: Props = $props();
</script>

<div class={className} data-rich-document>
	{#each document.children as node, index (`${node.type}-${index}`)}
		<RichNode {node} {headingOffset} />
	{/each}
</div>
