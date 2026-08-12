<script lang="ts">
	import { resolve } from "$app/paths";
	import LabHero from "$lib/components/site/common/LabHero.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import type { SkillPageView } from "$lib/domain/catalog.js";
	import InstallCommand from "$lib/components/site/common/InstallCommand.svelte";

	interface Props {
		skill: SkillPageView;
	}

	let { skill }: Props = $props();
</script>

<LabHero
	eyebrow={`${skill.category.replaceAll("-", " ")} / skill`}
	title={skill.name}
	description={skill.description}
	accent="var(--skill-accent)"
>
	{#snippet prelude()}
		<Breadcrumb.Root aria-label="Breadcrumb">
			<Breadcrumb.List>
				<Breadcrumb.Item><Breadcrumb.Link href={resolve("/")}>LAB Skills</Breadcrumb.Link></Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item><Breadcrumb.Page>{skill.name}</Breadcrumb.Page></Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
	{#snippet aside()}
			<InstallCommand command={skill.installCommand} sourceUrl={skill.sourceUrl} />
	{/snippet}
</LabHero>
