<script lang="ts">
	import '../app.css';
	import HeadMeta from '$lib/components/HeadMeta.svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY, PUBLIC_ANALYTICS_ID } from '$env/static/public';
	import { page } from '$app/stores';
	import { userSession } from '$lib/stores/sessionStore';

	$userSession = $page.data.session;
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_ANALYTICS_ID}"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', PUBLIC_ANALYTICS_ID);
	</script>
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
