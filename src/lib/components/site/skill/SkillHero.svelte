<script lang="ts">
	import { resolve } from "$app/paths";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import type { SkillPageView } from "$lib/domain/catalog.js";
	import InstallCommand from "$lib/components/site/common/InstallCommand.svelte";

	interface Props {
		skill: SkillPageView;
	}

	let { skill }: Props = $props();
</script>

<header class="border-b">
	<PageFrame class="py-12 sm:py-16 lg:py-24">
		<Breadcrumb.Root aria-label="Breadcrumb">
			<Breadcrumb.List>
				<Breadcrumb.Item><Breadcrumb.Link href={resolve("/")}>LAB Skills</Breadcrumb.Link></Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item><Breadcrumb.Page>{skill.name}</Breadcrumb.Page></Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-end">
			<div class="min-w-0">
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{skill.category.replaceAll("-", " ")} / skill</p>
				<h1 class="mt-4 break-words text-5xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">{skill.name}</h1>
				<p class="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{skill.description}</p>
			</div>
			<InstallCommand command={skill.installCommand} sourceUrl={skill.sourceUrl} />
		</div>
	</PageFrame>
</header>
