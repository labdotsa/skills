<script lang="ts">
	import { onMount, tick, type Component, type Snippet } from "svelte";
	import type { NotificationKind } from "$lib/notifications.js";
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
	}

	let { children, publicationProfile }: Props = $props();
	let theme = $state<ThemeSnapshot>({ preference: "system", resolved: "light" });
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

<div class="flex min-h-screen flex-col" data-publication-profile={publicationProfile}>
	<a class="fixed left-4 top-3 z-[100] -translate-y-24 rounded-sm bg-foreground px-4 py-3 font-semibold text-background transition-transform focus:translate-y-0 motion-reduce:transition-none" href="#main-content">
		Skip to main content
	</a>
	<SiteHeader
		preference={theme.preference}
		resolved={theme.resolved}
		onPreferenceChange={setPreference}
	/>
	<main id="main-content" tabindex="-1" class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
	{#if ToasterComponent}
		<ToasterComponent theme={theme.resolved} richColors closeButton />
	{/if}
</div>
