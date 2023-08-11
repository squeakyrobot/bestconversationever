<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Welcome to SvelteKit</h1>
{data.time}
<p>Visit <a href="rant"> /post</a> to post a problem</p>
