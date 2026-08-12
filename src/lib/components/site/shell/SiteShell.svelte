<script lang="ts">
	import { onMount, tick, type Component, type Snippet } from "svelte";
	import type { NotificationKind } from "$lib/notifications.js";
	import type { DirectoryPillarCount } from "$lib/domain/directory.js";
	import RouteTransition from "$lib/components/shared/RouteTransition.svelte";
	import {
		createThemeController,
		type ThemePreference,
		type ThemeSnapshot,
	} from "$lib/theme/theme.js";
	import SiteFooter from "./SiteFooter.svelte";
	import SiteHeader from "./SiteHeader.svelte";

	interface Props {
		children: Snippet;
		publicationProfile: string;
		skillPillarCounts: readonly DirectoryPillarCount[];
	}

	let { children, publicationProfile, skillPillarCounts }: Props = $props();
	let theme = $state<ThemeSnapshot>({ preference: "light", resolved: "light" });
	let setPreference = $state<(preference: ThemePreference) => void>(() => undefined);
	let ToasterComponent = $state<Component<{ theme: ThemeSnapshot["resolved"]; richColors: boolean; closeButton: boolean }> | null>(null);

	onMount(() => {
		const controller = createThemeController(document, window, (snapshot) => {
			theme = snapshot;
		});
		theme = controller.snapshot;
		setPreference = controller.setPreference;
		const handleNotification = async (event: Event) => {
			const { kind, message } = (event as CustomEvent<{ kind: NotificationKind; message: string }>).detail;
			const [{ Toaster }, { toast }] = await Promise.all([
				import("$lib/components/ui/sonner/index.js"),
				import("svelte-sonner"),
			]);
			ToasterComponent = Toaster;
			await tick();
			toast[kind](message);
		};
		window.addEventListener("lab:notification", handleNotification);
		return () => {
			controller.destroy();
			window.removeEventListener("lab:notification", handleNotification);
		};
	});
</script>

<RouteTransition />
<div class="site-shell flex min-h-screen flex-col" data-publication-profile={publicationProfile} data-site-shell>
	<a class="fixed left-4 top-3 z-[100] -translate-y-24 rounded-sm bg-foreground px-4 py-3 font-semibold text-background transition-transform focus:translate-y-0 motion-reduce:transition-none" href="#main-content">
		Skip to main content
	</a>
	<SiteHeader
		theme={theme.resolved}
		onThemeChange={setPreference}
	/>
	<main id="main-content" tabindex="-1" class="flex-1 pb-16 sm:pb-24">
		{@render children()}
	</main>
	<SiteFooter {skillPillarCounts} />
	{#if ToasterComponent}
		<ToasterComponent theme={theme.resolved} richColors closeButton />
	{/if}
</div>

<style>
	.site-shell {
		--page-accent: var(--lab-main);
		--primary: var(--page-accent);
		--ring: var(--page-accent);
		--accent: color-mix(in oklab, var(--page-accent) 16%, var(--background));
		--lab-selection: color-mix(in srgb, var(--page-accent) 25%, transparent);
		--lab-code: color-mix(in oklab, var(--page-accent) 12%, var(--background));
		--lab-code-ink: var(--foreground);
		--code-header: color-mix(in oklab, var(--page-accent) 18%, var(--background));
		position: relative;
		isolation: isolate;
		background: var(--background);
	}

	.site-shell::before {
		position: absolute;
		inset: 0 0 auto;
		z-index: -1;
		height: 100vh;
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--page-accent) 6.7%, transparent),
			transparent
		);
		content: "";
		pointer-events: none;
	}

	.site-shell:has(:global([data-page-pillar="research"])) { --page-accent: var(--lab-research); }
	.site-shell:has(:global([data-page-pillar="design"])) { --page-accent: var(--lab-design); }
	.site-shell:has(:global([data-page-pillar="development"])) { --page-accent: var(--lab-development); }
	.site-shell:has(:global([data-page-pillar="marketing"])) { --page-accent: var(--lab-marketing); }

	main {
		view-transition-name: discovery-page;
	}
</style>
