<script lang="ts">
	import { asset } from "$app/paths";
	import PageFrame from "$lib/components/shared/PageFrame.svelte";

	const serviceLinks = [
		["Research", "https://lab.sa/services/research"],
		["Design", "https://lab.sa/services/design"],
		["Development", "https://lab.sa/services/development"],
		["Marketing", "https://lab.sa/services/marketing"],
	] as const;
</script>

<footer class="mt-auto border-t bg-card py-10">
	<PageFrame>
		<div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
			<div class="max-w-xl">
				<a class="inline-flex items-center gap-3 font-display text-xl font-black no-underline" href="https://lab.sa" aria-label="LAB home">
					<img class="h-10 w-auto dark:invert" src={asset("/brand/logo.svg")} alt="" width="146" height="195" />
					<span>LAB</span>
				</a>
				<p class="mt-4 text-sm leading-7 text-muted-foreground">
					We are a product innovation company. Built to explore, design, develop, and scale what matters.
				</p>
			</div>
			<nav class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm" aria-label="Footer navigation">
				{#each serviceLinks as service (service[0])}
					<a href={service[1]}>{service[0]}</a>
				{/each}
			</nav>
		</div>
		<p class="mt-8 border-t pt-5 text-xs text-muted-foreground">© 2026 LAB LLC. All rights reserved.</p>
	</PageFrame>
</footer>
