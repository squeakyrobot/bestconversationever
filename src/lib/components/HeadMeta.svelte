<script lang="ts">
	import { page } from '$app/stores';

	export let url = $page.url.origin;
	export let title = 'Best Conversation Ever';
	export let description =
		'A site where you can have captivating conversations with various AI personalities. But beware! We save all the messages so we can show them to your friends, family, colleagues, and neighbors.';
</script>

<title>Best Conversation Ever</title>
<meta name="description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content="{$page.url.origin}/images/bce-logo-og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta property="twitter:domain" content={$page.url.hostname} />
<meta property="twitter:url" content={url} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content="{$page.url.origin}/images/bce-logo-og.png" />
