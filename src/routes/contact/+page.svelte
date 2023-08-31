<script lang="ts">
	import ContactForm from '$lib/components/ContactForm.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import Footer from '$lib/components/Footer.svelte';

	export let data: PageData;
</script>

<div class="flex flex-col w-full lg:w-3/4 max-w-6xl border-opacity-50 p-4 h-full">
	<Header />
	<ContactForm formSubmitted={data.formSubmitted} />
	<Footer />
</div>
