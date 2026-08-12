<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { toast } from "svelte-sonner";

	let count = $state(0);
	let value = $state("");
	let tab = $state("overview");
	let disclosed = $state(false);
</script>

<main class="grid gap-6 p-8">
	<h1 class="text-3xl font-bold">Component contract</h1>
	<section aria-labelledby="controls-title" class="grid max-w-md gap-3">
		<h2 id="controls-title" class="text-xl font-bold">Controls</h2>
		<Button class="h-11" onclick={() => count += 1}>Increment</Button>
		<p aria-live="polite">Count {count}</p>
		<Button disabled>Unavailable</Button>
		<label for="component-input">Component input</label>
		<Input id="component-input" bind:value />
		<output for="component-input">{value}</output>
	</section>
	<section aria-labelledby="composition-title" class="grid max-w-md gap-4">
		<h2 id="composition-title" class="text-xl font-bold">Composition</h2>
		<Breadcrumb.Root aria-label="Component breadcrumb">
			<Breadcrumb.List>
				<Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item><Breadcrumb.Page>Current page</Breadcrumb.Page></Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<Separator />
		<Tabs.Root bind:value={tab}>
			<Tabs.List aria-label="Component views">
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="details">Details</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="overview">Overview panel</Tabs.Content>
			<Tabs.Content value="details">Details panel</Tabs.Content>
		</Tabs.Root>
		<Collapsible.Root bind:open={disclosed}>
			<Collapsible.Trigger>Component disclosure</Collapsible.Trigger>
			<Collapsible.Content>Disclosed content</Collapsible.Content>
		</Collapsible.Root>
		<Sheet.Root>
			<Sheet.Trigger>Open component sheet</Sheet.Trigger>
			<Sheet.Content aria-label="Component sheet">
				<Sheet.Header>
					<Sheet.Title>Component sheet</Sheet.Title>
					<Sheet.Description>Sheet behavior through the public API.</Sheet.Description>
				</Sheet.Header>
				<button type="button">Sheet action</button>
			</Sheet.Content>
		</Sheet.Root>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>Component help</Tooltip.Trigger>
				<Tooltip.Content>Helpful component detail</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<Button onclick={() => toast.success("Component saved")}>Notify success</Button>
	</section>
	<Toaster />
</main>
