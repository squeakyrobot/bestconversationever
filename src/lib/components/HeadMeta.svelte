<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from '$env/static/public';

	export let ogImage = $page.data.pageOgImage || '/images/bce-logo-og.png';
	export let url = $page.url.href;
	export let title = $page.data.pageTitle || 'Best Conversation Ever';
	export let description =
		$page.data.pageDescription ||
		'A site where you can have captivating conversations with various AI personalities.';
</script>

<title>{title}</title>
<!-- TODO: Add canonical, beware of prerender -->
<!-- <link rel="canonical" href="https://bestconversationever.com/" /> -->
<meta name="description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content="{$page.url.origin}{ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta property="twitter:domain" content={$page.url.hostname} />
<meta property="twitter:url" content={url} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content="{$page.url.origin}{ogImage}" />
<meta
	name="google-signin-client_id"
	content="{PUBLIC_GOOGLE_OAUTH_CLIENT_ID}.apps.googleusercontent.com"
/>
