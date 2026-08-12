<script lang="ts">
	import { onNavigate } from "$app/navigation";

	type DiscoverySection = "skills" | "recipes";

	function discoverySection(pathname: string): DiscoverySection {
		return pathname.includes("/recipes") ? "recipes" : "skills";
	}

	onNavigate((navigation) => {
		const fromUrl = navigation.from?.url;
		const toUrl = navigation.to?.url;
		if (
			typeof document === "undefined" ||
			!("startViewTransition" in document) ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			!fromUrl ||
			!toUrl
		) return;

		const from = discoverySection(fromUrl.pathname);
		const to = discoverySection(toUrl.pathname);
		if (from === to) return;

		document.documentElement.dataset.navigationDirection = from === "skills" ? "forward" : "backward";

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});

			transition.finished.finally(() => {
				delete document.documentElement.dataset.navigationDirection;
			});
		});
	});
</script>
