<script lang="ts">
	import { resolve } from "$app/paths";
	import DetailBreadcrumb from "$lib/components/site/common/DetailBreadcrumb.svelte";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import type { SkillPageView } from "$lib/domain/catalog.js";
	import InstallCommand from "$lib/components/site/common/InstallCommand.svelte";

	interface Props {
		skill: SkillPageView;
	}

	let { skill }: Props = $props();
</script>

<LabHero
	eyebrow={`${skill.category.replaceAll("-", " ")} / Skill`}
	title={skill.name}
	description={skill.description}
	accent="var(--skill-accent)"
>
	{#snippet prelude()}
		<DetailBreadcrumb collectionHref={resolve("/")} collection="Skills" subSubject={skill.name} />
	{/snippet}
	{#snippet aside()}
		<InstallCommand command={skill.installCommand} sourceUrl={skill.sourceUrl} accent="var(--skill-accent)" />
	{/snippet}
</LabHero>
