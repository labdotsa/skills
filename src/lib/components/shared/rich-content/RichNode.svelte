<script lang="ts">
	import CopyButton from "$lib/components/shared/CopyButton.svelte";
	import type { RichNode as RichNodeModel } from "$lib/domain/rich-content.js";
	import RichNodeComponent from "./RichNode.svelte";

	interface Props {
		node: RichNodeModel;
		tableHeader?: boolean;
	}

	let { node, tableHeader = false }: Props = $props();
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
	<div class="my-6 overflow-hidden rounded-lg border border-border-strong bg-code text-code-foreground">
		<div class="flex min-h-11 items-center justify-between gap-3 border-b border-border-strong px-4">
			<span class="font-mono text-xs uppercase tracking-[0.12em]">{node.language ?? "text"}</span>
			<CopyButton text={node.value} label="Copy code" />
		</div>
		<pre class="overflow-x-auto p-4 text-sm leading-6"><code>{node.value}</code></pre>
	</div>
{:else if node.type === "image"}
	<img class="my-6 h-auto max-w-full rounded-lg border" src={node.src} alt={node.alt} title={node.title} loading="lazy" />
{:else if node.type === "link"}
	<a
		href={node.href}
		title={node.title}
		rel={node.kind === "external" || node.kind === "source" ? "noreferrer" : undefined}
	>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</a>
{:else if node.type === "heading"}
	{#if node.depth === 1}
		<h1 id={node.id} class="mt-10 scroll-mt-24 text-4xl font-bold tracking-tight">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</h1>
	{:else if node.depth === 2}
		<h2 id={node.id} class="mt-10 scroll-mt-24 text-3xl font-bold tracking-tight">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</h2>
	{:else if node.depth === 3}
		<h3 id={node.id} class="mt-8 scroll-mt-24 text-2xl font-semibold tracking-tight">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</h3>
	{:else if node.depth === 4}
		<h4 id={node.id} class="mt-7 scroll-mt-24 text-xl font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</h4>
	{:else if node.depth === 5}
		<h5 id={node.id} class="mt-6 scroll-mt-24 text-lg font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</h5>
	{:else}
		<h6 id={node.id} class="mt-6 scroll-mt-24 font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</h6>
	{/if}
{:else if node.type === "paragraph"}
	<p class="my-4 leading-7">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</p>
{:else if node.type === "emphasis"}
	<em>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</em>
{:else if node.type === "strong"}
	<strong>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</strong>
{:else if node.type === "delete"}
	<del>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</del>
{:else if node.type === "blockquote"}
	<blockquote class="my-6 border-s-4 border-primary ps-5 text-muted-foreground">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</blockquote>
{:else if node.type === "list"}
	{#if node.ordered}
		<ol class="my-4 list-decimal space-y-2 ps-6" start={node.start}>{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</ol>
	{:else}
		<ul class="my-4 list-disc space-y-2 ps-6">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</ul>
	{/if}
{:else if node.type === "listItem"}
	<li>
		{#if node.checked !== undefined}<input class="me-2" type="checkbox" checked={node.checked} disabled aria-label={node.checked ? "Completed" : "Not completed"} />{/if}
		{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}
	</li>
{:else if node.type === "table"}
	<div class="my-6 overflow-x-auto">
		<table class="w-full min-w-lg border-collapse text-start text-sm">
			{#if node.children[0]}<thead><RichNodeComponent node={node.children[0]} tableHeader /></thead>{/if}
			{#if node.children.length > 1}<tbody>{#each node.children.slice(1) as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</tbody>{/if}
		</table>
	</div>
{:else if node.type === "tableRow"}
	<tr class="border-b">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} {tableHeader} />{/each}</tr>
{:else if node.type === "tableCell"}
	{#if tableHeader}
		<th class="px-3 py-2 text-start font-semibold">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</th>
	{:else}
		<td class="px-3 py-2 align-top">{#each node.children as child, index (`${child.type}-${index}`)}<RichNodeComponent node={child} />{/each}</td>
	{/if}
{/if}
