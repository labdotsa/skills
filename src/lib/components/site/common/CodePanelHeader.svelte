<script lang="ts">
	import CopyButton from "$lib/components/shared/CopyButton.svelte";

	interface Props {
		title: string;
		text?: string;
		copyLabel?: string;
		copyMessage?: string;
		compact?: boolean;
		inline?: boolean;
		showTitle?: boolean;
	}

	let {
		title,
		text,
		copyLabel = "Copy code",
		copyMessage = "Copied to clipboard",
		compact = false,
		inline = false,
		showTitle = true,
	}: Props = $props();
</script>

<div
	class={inline
		? "contents"
		: `flex items-center justify-between gap-3 border-b border-border-strong/60 bg-[var(--code-header)] ${compact ? "min-h-8 px-3" : "min-h-11 px-4"}`}
	data-code-panel-header
>
	{#if showTitle}
		<span
			class={inline
				? "col-start-1 row-start-1 flex h-full min-w-18 items-center border-e border-border-strong/50 bg-[var(--code-header)] px-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground"
				: "font-mono text-xs uppercase tracking-[0.12em]"}
			data-code-language={title.toLowerCase()}
		>{title}</span>
	{/if}
	{#if text !== undefined}
		{#if inline}
			<div class={[showTitle ? "col-start-3" : "col-start-2", "row-start-1 flex h-full items-stretch border-s border-border-strong/50 bg-[var(--code-header)]"]}>
				<CopyButton {text} label={copyLabel} message={copyMessage} fillCell />
			</div>
		{:else}
			<CopyButton {text} label={copyLabel} message={copyMessage} {compact} />
		{/if}
	{/if}
</div>
