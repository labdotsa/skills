<script lang="ts">
	import RichDocument from "$lib/components/site/rich-content/RichDocument.svelte";
	import type { RichDocument as RichDocumentModel } from "$lib/domain/rich-content.js";

	interface Props {
		document: RichDocumentModel;
	}

	let { document }: Props = $props();
</script>

<RichDocument
	{document}
	codeCopyLabel="Copy prompt"
	codeCopyMessage="Prompt copied"
	class="min-w-0 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [&_a]:break-words [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:decoration-primary [&_a]:decoration-2 [&_a]:underline-offset-4 [&_strong]:text-foreground"
/>
