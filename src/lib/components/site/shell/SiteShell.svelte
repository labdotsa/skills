<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
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

	onMount(() => {
		const controller = createThemeController(document, window, (snapshot) => {
			theme = snapshot;
		});
		theme = controller.snapshot;
		setPreference = controller.setPreference;
		return controller.destroy;
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
	<Toaster theme={theme.resolved} richColors closeButton />
</div>
