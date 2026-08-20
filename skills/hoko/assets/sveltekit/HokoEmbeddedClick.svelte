<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import {
		buildHokoEmbeddedScriptUrl,
		hokoEmbeddedScriptElementId
	} from './hoko-embedded.js';

	export let shortId: string;
	export let source = 'site';
	export let medium = 'owned';
	export let campaign: string;
	export let content: string | undefined = undefined;
	export let term: string | undefined = undefined;
	export let referral: string | undefined = undefined;

	onMount(() => {
		if (dev) return;

		const id = hokoEmbeddedScriptElementId(shortId);
		if (document.getElementById(id)) return;

		const script = document.createElement('script');
		script.id = id;
		script.src = buildHokoEmbeddedScriptUrl(new URL(window.location.href), {
			shortId,
			source,
			medium,
			campaign,
			content,
			term,
			referral
		}).toString();
		script.defer = true;
		document.head.append(script);

		return () => script.remove();
	});
</script>
