<script lang="ts">
	import '../app.css';
	import HeadMeta from '$lib/components/HeadMeta.svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { afterUpdate } from 'svelte';
	import { page } from '$app/stores';
	import { returnPage } from '$lib/stores/return-page';
	import { sessionUser } from '$lib/stores/session-user';

	afterUpdate(() => {
		// We are setting this here because having it in a +layout.server.ts
		// and then earlier in the cycle messed up prerendering on the pages
		// that need it. How it is now some pages may still need to pass in
		// the user in the PageData and set it on the sessionUer as needed
		if ($page.data.user) {
			$sessionUser = $page.data.user;
		}

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
