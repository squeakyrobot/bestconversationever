<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="flex flex-col w-full lg:w-3/4 border-opacity-50 p-4 h-full" in:fade={{ duration: 400 }}>
	<div class="flex-grow">
		<h1>About</h1>
		<p>TODO: add content to this page</p>
	</div>
	<Footer disabled={true} />
</div>
