<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import CopyButton from "$lib/components/shared/CopyButton.svelte";

	interface Props {
		command: string;
		sourceUrl: string;
	}

	let { command, sourceUrl }: Props = $props();
</script>

<aside class="min-w-0" aria-labelledby="install-title">
	<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" id="install-title">Installation</p>
	<div class="mt-3 flex min-w-0 items-center gap-3 border border-border-strong border-s-4 border-s-[var(--skill-accent)] bg-code p-3 text-code-foreground">
		<span class="font-mono text-primary" aria-hidden="true">$</span>
		<code class="min-w-0 flex-1 overflow-x-auto py-2 font-mono text-sm">{command}</code>
		<CopyButton text={command} label="Copy install command" message="Install command copied" />
	</div>
	<a class="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-primary decoration-2 underline-offset-4" href={sourceUrl}>
		Browse source on GitHub <ExternalLinkIcon class="size-4" aria-hidden="true" />
	</a>
</aside>
