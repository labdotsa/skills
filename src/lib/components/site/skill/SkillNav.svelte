<script lang="ts">
	import ContentsNav from "$lib/components/site/common/ContentsNav.svelte";
	import type { OutlineItem } from "$lib/domain/rich-content.js";

	interface Props {
		outline: readonly OutlineItem[];
		onVisit?: () => void;
		collapsed?: boolean;
	}

	let { outline, onVisit, collapsed = false }: Props = $props();
	let primaryDepth = $derived(outline.length > 0 ? Math.min(...outline.map((item) => item.depth)) : 1);
	let items = $derived(
		outline.map((item) => ({
			id: item.id,
			title: item.text,
			depth: item.depth - primaryDepth,
		})),
	);
</script>

<ContentsNav
	{items}
	label="Skill contents"
	{onVisit}
	listDataAttribute="skill"
	visibleOnly={collapsed}
	visibilityRegionSelector='[data-skill-reading] [data-slot="collapsible-content"]'
/>
