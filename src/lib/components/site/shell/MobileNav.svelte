<script lang="ts">
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import FlaskConicalIcon from "@lucide/svelte/icons/flask-conical";
	import RouteIcon from "@lucide/svelte/icons/route";
	import XIcon from "@lucide/svelte/icons/x";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import LabWordmark from "$lib/components/shared/LabWordmark.svelte";
	import ThemeToggle from "$lib/components/shared/ThemeToggle.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ResolvedTheme } from "$lib/theme/theme.js";

	interface Props {
		trigger: HTMLButtonElement | null;
		theme: ResolvedTheme;
		onThemeChange: (theme: ResolvedTheme) => void;
	}

	let { trigger, theme, onThemeChange }: Props = $props();
	const sidebar = Sidebar.useSidebar();

	let skillsActive = $derived(!page.url.pathname.includes("/recipes"));
	let recipesActive = $derived(page.url.pathname.includes("/recipes"));

	const services = [
		["Research", "https://lab.sa/services/research"],
		["Design", "https://lab.sa/services/design"],
		["Development", "https://lab.sa/services/development"],
		["Marketing", "https://lab.sa/services/marketing"],
	] as const;

	function closeNavigation() {
		sidebar.setOpenMobile(false);
	}
</script>

<Sidebar.Root
	side="right"
	collapsible="offcanvas"
	class="border-s border-sidebar-border lg:hidden"
	mobileTitle="LAB Skills"
	mobileDescription="Public working knowledge and LAB services."
	onCloseAutoFocus={(event) => {
		event.preventDefault();
		trigger?.focus();
	}}
	data-mobile-navigation
>
	<Sidebar.Header class="border-b border-sidebar-border p-5">
		<div class="flex items-center justify-between gap-4">
			<LabWordmark class="text-2xl" />
			<Button variant="ghost" size="icon" aria-label="Close navigation" onclick={closeNavigation}>
				<XIcon aria-hidden="true" />
			</Button>
		</div>
		<p class="text-sm leading-6 text-muted-foreground">Public working knowledge and LAB services.</p>
	</Sidebar.Header>

	<Sidebar.Content class="py-3">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Discovery</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" isActive={skillsActive}>
							{#snippet child({ props })}
								<a href={resolve("/")} onclick={closeNavigation} {...props}>
									<BookOpenIcon aria-hidden="true" />
									<span>Skills</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" isActive={recipesActive}>
							{#snippet child({ props })}
								<a href={resolve("/recipes/")} onclick={closeNavigation} {...props}>
									<RouteIcon aria-hidden="true" />
									<span>Recipes</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Separator />

		<Sidebar.Group>
			<Sidebar.GroupLabel>LAB services</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each services as service (service[0])}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg">
								{#snippet child({ props })}
									<a href={service[1]} onclick={closeNavigation} {...props}>
										<FlaskConicalIcon aria-hidden="true" />
										<span>{service[0]}</span>
										<ArrowUpRightIcon class="ms-auto" aria-hidden="true" />
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="border-t border-sidebar-border p-5">
		<div class="flex items-center justify-between gap-4">
			<span class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Appearance</span>
			<ThemeToggle {theme} {onThemeChange} />
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
