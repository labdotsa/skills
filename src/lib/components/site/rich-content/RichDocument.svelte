<script lang="ts">
	import type { RichDocument } from "$lib/domain/rich-content.js";
	import RichNode from "./RichNode.svelte";

	interface Props {
		document: RichDocument;
		class?: string;
		headingOffset?: 0 | 1;
		codeCopyLabel?: string;
		codeCopyMessage?: string;
	}

	let {
		document,
		class: className,
		headingOffset = 0,
		codeCopyLabel = "Copy code",
		codeCopyMessage = "Copied to clipboard",
	}: Props = $props();
</script>

<div class={className} data-rich-document>
	{#each document.children as node, index (`${node.type}-${index}`)}
		<RichNode {node} {headingOffset} {codeCopyLabel} {codeCopyMessage} />
	{/each}
</div>
