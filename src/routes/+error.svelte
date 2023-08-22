<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';

	let title = 'An error has occured';

	switch ($page.status) {
		case 404:
			title = 'Not Found';
			break;
		case 500:
			title = 'Internal Server Error';
			break;
	}
</script>

<div class="flex flex-col w-full lg:w-3/4 max-w-6xl border-opacity-50 p-4 h-full">
	<Header title={$page.status.toString()} titleLink={null} />
	<div class="text-xl flex-grow overflow-y-auto">
		<div class="hero">
			<div class="hero-content text-center">
				<div class="">
					<h1 class="text-5xl font-bold">{$page.status}: {title}</h1>
					<p class="py-6">
						<!-- {$page.error?.message} -->
					</p>
				</div>
			</div>
		</div>
	</div>

	<Footer />
</div>
