<script lang="ts">
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import CodePanelHeader from "./CodePanelHeader.svelte";

	interface Props {
		command: string;
		sourceUrl?: string;
		title?: string;
		accent?: string;
	}

	let {
		command,
		sourceUrl,
		title = "Installation",
		accent = "var(--page-accent)",
	}: Props = $props();
</script>

<aside class="w-fit max-w-full min-w-0" aria-label={title} style={`--command-accent: ${accent}`} data-install-command>
	<div class="w-fit max-w-full overflow-hidden rounded-lg border border-border-strong bg-code text-code-foreground" data-install-command-surface>
		<div
			class="grid min-h-14 min-w-0 grid-cols-[minmax(0,1fr)_auto] items-stretch rounded-none border-0 border-s-4 border-s-[var(--command-accent)] bg-transparent text-inherit"
			role="group"
			aria-label={title}
			data-code-panel
		>
			<CodePanelHeader {title} text={command} copyLabel="Copy install command" copyMessage="Install command copied" inline showTitle={false} />
			<div class="col-start-1 row-start-1 flex min-w-0 items-center gap-3 px-4">
				<span class="font-mono text-primary" aria-hidden="true">$</span>
				<code class="min-w-0 flex-1 truncate py-3 font-mono text-sm" title={command}>{command}</code>
			</div>
		</div>
	</div>
	{#if sourceUrl}
		<a class="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-primary decoration-2 underline-offset-4" href={sourceUrl}>
			Browse source on GitHub <ExternalLinkIcon class="size-4" aria-hidden="true" />
		</a>
	{/if}
</aside>
