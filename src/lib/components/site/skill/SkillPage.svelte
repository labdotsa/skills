<script lang="ts">
	import type { SkillPageView } from "$lib/domain/catalog.js";
	import { pillarForCategory } from "$lib/domain/directory.js";
	import { skillSeo } from "$lib/domain/seo.js";
	import PageHead from "$lib/components/site/common/PageHead.svelte";
	import PackageDirectory from "./PackageDirectory.svelte";
	import RelatedContent from "./RelatedContent.svelte";
	import SkillHero from "./SkillHero.svelte";
	import SkillInstructions from "./SkillInstructions.svelte";

	interface Props {
		skill: SkillPageView;
		catalogSnapshotId: string;
		canonicalOrigin: string;
		indexable: boolean;
	}

	let { skill, catalogSnapshotId, canonicalOrigin, indexable }: Props = $props();
	let seo = $derived(skillSeo(skill, canonicalOrigin, indexable));
	let pillar = $derived(pillarForCategory(skill.category));
</script>

<PageHead {seo} />

<article
	class="relative isolate overflow-hidden"
	data-pillar={pillar}
	data-page-pillar={pillar}
	data-catalog-snapshot={catalogSnapshotId}
>
	<SkillHero {skill} />
	<SkillInstructions {skill} />
	<PackageDirectory files={skill.packageFiles} />
	<RelatedContent entries={skill.related} />
</article>

<style>
	[data-pillar="research"] { --skill-accent: var(--lab-research); }
	[data-pillar="design"] { --skill-accent: var(--lab-design); }
	[data-pillar="development"] { --skill-accent: var(--lab-development); }
	[data-pillar="marketing"] { --skill-accent: var(--lab-marketing); }
</style>
