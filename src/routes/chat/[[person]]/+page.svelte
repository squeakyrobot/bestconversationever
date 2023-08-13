<script lang="ts">
	import Chat2 from '$lib/components/Chat2.svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { rantStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let initialRant = '';

	rantStore.subscribe((value) => {
		initialRant = value;
	});

	onMount(() => {
		rantStore.update(() => '');
	});

	const onClose = () => goto('/');
</script>

<div in:scale={{ duration: 500 }} class="max-w-4xl h-full w-full overflow-hidden">
	<Chat2 {initialRant} {onClose} personName={$page.params.person} />
</div>
