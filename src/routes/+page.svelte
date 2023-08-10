<script lang="ts">
	import type { PageData } from './$types';
	import NavigationLinks from './NavigationLinks.svelte';

	export let data: PageData;
</script>

<h1>Welcome to SvelteKit</h1>
{data.time}
<p>Visit <a href="post"> /post</a> to post a problem</p>

<NavigationLinks />
