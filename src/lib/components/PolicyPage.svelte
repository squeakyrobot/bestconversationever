<script lang="ts">
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';

	export let policy: string;
</script>

<div class="flex flex-col w-full lg:w-3/4 max-w-6xl border-opacity-50 p-4 h-full">
	<Header />
	<article class="prose max-w-none">
		{@html policy}
	</article>
	<Footer />
</div>
