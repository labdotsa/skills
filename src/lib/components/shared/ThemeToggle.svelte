<script lang="ts">
	import MonitorIcon from "@lucide/svelte/icons/monitor";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SunIcon from "@lucide/svelte/icons/sun";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { ResolvedTheme, ThemePreference } from "$lib/theme/theme.js";

	interface Props {
		preference: ThemePreference;
		resolved: ResolvedTheme;
		onPreferenceChange: (preference: ThemePreference) => void;
		compact?: boolean;
	}

	let { preference, resolved, onPreferenceChange, compact = false }: Props = $props();
</script>

<div class="grid gap-1.5" data-theme-control>
	<span class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground" id="theme-label">
		Appearance
	</span>
	<div class="flex flex-wrap gap-1" role="group" aria-labelledby="theme-label">
		<Button
			variant="ghost"
			size={compact ? "icon" : "sm"}
			aria-label={compact ? "Use system appearance" : undefined}
			aria-pressed={preference === "system"}
			class="min-h-11 data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground"
			data-pressed={preference === "system"}
			onclick={() => onPreferenceChange("system")}
		>
			<MonitorIcon aria-hidden="true" />
			{#if !compact}<span>System</span>{/if}
		</Button>
		<Button
			variant="ghost"
			size={compact ? "icon" : "sm"}
			aria-label={compact ? "Use light appearance" : undefined}
			aria-pressed={preference === "light"}
			class="min-h-11 data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground"
			data-pressed={preference === "light"}
			onclick={() => onPreferenceChange("light")}
		>
			<SunIcon aria-hidden="true" />
			{#if !compact}<span>Light</span>{/if}
		</Button>
		<Button
			variant="ghost"
			size={compact ? "icon" : "sm"}
			aria-label={compact ? "Use dark appearance" : undefined}
			aria-pressed={preference === "dark"}
			class="min-h-11 data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground"
			data-pressed={preference === "dark"}
			onclick={() => onPreferenceChange("dark")}
		>
			<MoonIcon aria-hidden="true" />
			{#if !compact}<span>Dark</span>{/if}
		</Button>
	</div>
	<span class="sr-only" role="status">{preference} appearance, resolved {resolved}</span>
</div>
