<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import HeadMeta from '$lib/components/HeadMeta.svelte';
	import '../app.css';
</script>

<svelte:head>
	<script
		src="https://www.google.com/recaptcha/api.js?render={PUBLIC_RECAPTCHA_SITE_KEY}&trustedtypes=true"
	></script>
	<HeadMeta title={$page.data.pageTitle || 'Best Conversation Ever'} />
</svelte:head>

<div class="grid place-items-center h-[calc(100dvh)]">
	<slot />
</div>
