<script lang="ts">
	import { resolve } from "$app/paths";
	import LabWordmark from "$lib/components/shared/LabWordmark.svelte";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";

	const serviceLinks = [
		["Research", "https://lab.sa/services/research"],
		["Design", "https://lab.sa/services/design"],
		["Development", "https://lab.sa/services/development"],
		["Marketing", "https://lab.sa/services/marketing"],
	] as const;
</script>

<footer id="site-footer" class="bg-[#111113] text-white" data-site-footer>
	<div class="grid h-1 grid-cols-4" aria-hidden="true">
		<span class="bg-research"></span>
		<span class="bg-design"></span>
		<span class="bg-development"></span>
		<span class="bg-marketing"></span>
	</div>
	<PageFrame class="py-10 sm:py-14">
		<div class="grid gap-10 lg:grid-cols-[minmax(18rem,1.3fr)_minmax(10rem,0.55fr)_minmax(15rem,0.8fr)]">
			<section aria-labelledby="footer-lab-title">
				<a class="inline-flex no-underline" href="https://lab.sa" aria-label="LAB home">
					<LabWordmark inverted class="text-2xl" />
				</a>
				<h2 id="footer-lab-title" class="mt-6 max-w-lg font-display text-3xl font-bold leading-tight tracking-normal sm:text-4xl">Open protocols for making things that matter.</h2>
				<p class="mt-4 max-w-xl text-sm leading-7 text-zinc-400">LAB Skills turns working product knowledge into reusable public instructions and delivery recipes.</p>
			</section>
			<nav class="grid content-start gap-3 text-sm" aria-label="Discovery footer navigation">
				<p class="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Discover</p>
				<a href={resolve("/")}>Skills</a>
				<a href={resolve("/recipes/")}>Recipes</a>
				<a href="https://github.com/labdotsa/skills">Source</a>
			</nav>
			<nav class="grid grid-cols-2 content-start gap-x-8 gap-y-3 text-sm" aria-label="LAB services">
				<p class="col-span-2 mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Work with LAB</p>
				{#each serviceLinks as service (service[0])}
					<a href={service[1]}>{service[0]}</a>
				{/each}
			</nav>
		</div>
		<div class="mt-12 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
			<p>© 2026 LAB LLC. All rights reserved.</p>
			<p class="font-mono uppercase tracking-[0.12em]">Research · Design · Development · Marketing</p>
		</div>
	</PageFrame>
</footer>
