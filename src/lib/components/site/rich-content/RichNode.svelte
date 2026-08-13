<script lang="ts">
	import type { RichNode as RichNodeModel } from "$lib/domain/rich-content.js";
	import CodePanelHeader from "$lib/components/site/common/CodePanelHeader.svelte";
	import RichNodeComponent from "./RichNode.svelte";

	interface Props {
		node: RichNodeModel;
		tableHeader?: boolean;
		headingOffset?: 0 | 1;
		codeCopyLabel?: string;
		codeCopyMessage?: string;
		nodePath?: string;
	}

	let {
		node,
		tableHeader = false,
		headingOffset = 0,
		codeCopyLabel = "Copy code",
		codeCopyMessage = "Copied to clipboard",
		nodePath = "1",
	}: Props = $props();
	let headingDepth = $derived(node.type === "heading" ? Math.min(6, node.depth + headingOffset) : undefined);
	let codeRegionLabel = $derived(
		node.type === "code"
			? `${codeCopyLabel} content ${nodePath}: ${node.value.split("\n", 1)[0]?.trim().slice(0, 80) || node.language || "text"}`
			: undefined,
	);
</script>

{#if node.type === "text"}
	{node.value}
{:else if node.type === "break"}
	<br />
{:else if node.type === "thematicBreak"}
	<hr class="my-8 border-border" />
{:else if node.type === "inlineCode"}
	<code class="rounded-sm bg-code px-1.5 py-0.5 font-mono text-sm text-code-foreground">{node.value}</code>
{:else if node.type === "code"}
	<div class="my-6 overflow-hidden rounded-lg border border-border-strong bg-code text-code-foreground" data-code-panel>
		<CodePanelHeader title={node.language ?? "text"} text={node.value} copyLabel={codeCopyLabel} copyMessage={codeCopyMessage} />
		<section class="min-w-0 overflow-x-hidden" aria-label={codeRegionLabel}>
			<pre class="whitespace-pre-wrap p-4 text-sm leading-6 [overflow-wrap:anywhere]" data-multiline-code><code>{node.value}</code></pre>
		</section>
	</div>
{:else if node.type === "image"}
	<img class="my-6 h-auto max-w-full rounded-lg border" src={node.src} alt={node.alt} title={node.title} loading="lazy" />
{:else if node.type === "link"}
	<a
		href={node.href}
		title={node.title}
		rel={node.kind === "external" || node.kind === "source" ? "noreferrer" : undefined}
	>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</a>
{:else if node.type === "heading"}
	{#if headingDepth === 1}
		<h1 id={node.id} tabindex="-1" class="mt-10 scroll-mt-24 text-4xl font-bold tracking-tight">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</h1>
	{:else if headingDepth === 2}
		<h2 id={node.id} tabindex="-1" class="mt-10 scroll-mt-24 text-3xl font-bold tracking-tight">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</h2>
	{:else if headingDepth === 3}
		<h3 id={node.id} tabindex="-1" class="mt-8 scroll-mt-24 text-2xl font-semibold tracking-tight">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</h3>
	{:else if headingDepth === 4}
		<h4 id={node.id} tabindex="-1" class="mt-7 scroll-mt-24 text-xl font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</h4>
	{:else if headingDepth === 5}
		<h5 id={node.id} tabindex="-1" class="mt-6 scroll-mt-24 text-lg font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</h5>
	{:else}
		<h6 id={node.id} tabindex="-1" class="mt-6 scroll-mt-24 font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</h6>
	{/if}
{:else if node.type === "paragraph"}
	<p class="my-4 leading-7">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</p>
{:else if node.type === "emphasis"}
	<em>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</em>
{:else if node.type === "strong"}
	<strong>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</strong>
{:else if node.type === "delete"}
	<del>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</del>
{:else if node.type === "blockquote"}
	<blockquote class="my-6 border-s-4 border-primary ps-5 text-muted-foreground">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</blockquote>
{:else if node.type === "list"}
	{#if node.ordered}
		<ol class="my-4 list-decimal space-y-2 ps-6" start={node.start}>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</ol>
	{:else}
		<ul class="my-4 list-disc space-y-2 ps-6">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</ul>
	{/if}
{:else if node.type === "listItem"}
	<li>
		{#if node.checked !== undefined}<input class="me-2" type="checkbox" checked={node.checked} disabled aria-label={node.checked ? "Completed" : "Not completed"} />{/if}
		{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}
	</li>
{:else if node.type === "table"}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables require keyboard access.) -->
	<section
		class="rich-table-scroll my-6 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
		aria-label={`Scrollable table ${nodePath}`}
		tabindex="0"
	>
		<table class="w-full min-w-lg border-collapse text-start text-sm">
			{#if node.children[0]}<thead><RichNodeComponent node={node.children[0]} nodePath={`${nodePath}.head`} tableHeader {headingOffset} {codeCopyLabel} {codeCopyMessage} /></thead>{/if}
			{#if node.children.length > 1}<tbody>{#each node.children.slice(1) as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.body.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</tbody>{/if}
		</table>
	</section>
{:else if node.type === "tableRow"}
	<tr class="border-b">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {tableHeader} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</tr>
{:else if node.type === "tableCell"}
	{#if tableHeader}
		<th class="px-3 py-2 text-start font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</th>
	{:else}
		<td class="px-3 py-2 align-top">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} nodePath={`${nodePath}.${index + 1}`} {headingOffset} {codeCopyLabel} {codeCopyMessage} />{/each}</td>
	{/if}
{/if}

<style>
	:global(.rich-table-scroll[data-overflow-tabindex]) {
		overflow-x: hidden;
	}
</style>
