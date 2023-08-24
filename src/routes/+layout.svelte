<script lang="ts">
	import '../app.css';
	import HeadMeta from '$lib/components/HeadMeta.svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { page } from '$app/stores';
	import { userSession } from '$lib/stores/session-store';
	import { afterUpdate, onMount } from 'svelte';
	import { returnPage } from '$lib/stores/return-page';

	$userSession = $page.data.session;

	afterUpdate(() => {
		$returnPage = $page.url.pathname;
	});
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

<!-- TEMP -->
{@html `<!-- ${JSON.stringify($page.data.session, null, 4)} -->`}
