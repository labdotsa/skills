<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
	import { Button } from "$lib/components/ui/button/index.js";
	import { notify } from "$lib/notifications.js";

	interface Props {
		text: string;
		label: string;
		message?: string;
	}

	let { text, label, message = "Copied to clipboard" }: Props = $props();
	let state = $state<"idle" | "busy" | "success" | "error">("idle");
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function writeClipboard(value: string) {
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(value);
				return;
			} catch {
				// Continue to the selection fallback when the Clipboard API is denied.
			}
		}

		const textarea = document.createElement("textarea");
		textarea.value = value;
		textarea.setAttribute("readonly", "");
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.append(textarea);
		textarea.select();
		const copied = document.execCommand("copy");
		textarea.remove();
		if (!copied) throw new Error("Clipboard unavailable");
	}

	async function copy() {
		if (state === "busy") return;
		state = "busy";
		clearTimeout(resetTimer);

		try {
			await writeClipboard(text);
			state = "success";
			notify("success", message);
		} catch {
			state = "error";
			notify("error", "Copy failed. Select and copy the command manually.");
		}

		resetTimer = setTimeout(() => {
			state = "idle";
		}, 1800);
	}
</script>

<Button
	variant="ghost"
	size="icon"
	class="size-11 shrink-0"
	aria-label={state === "success" ? `${label}: copied` : label}
	aria-busy={state === "busy"}
	data-copy-state={state}
	onclick={copy}
>
	{#if state === "busy"}
		<LoaderCircleIcon data-icon="busy" class="animate-spin motion-reduce:animate-none" aria-hidden="true" />
	{:else if state === "success"}
		<CheckIcon aria-hidden="true" />
	{:else}
		<CopyIcon aria-hidden="true" />
	{/if}
</Button>
