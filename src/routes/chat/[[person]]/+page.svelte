<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { rantStore } from '$lib/store';
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

	const personName = $page.params.person
		? $page.params.person.charAt(0).toUpperCase() + $page.params.person.slice(1)
		: '';
</script>

{#key $page.url}
	<div in:scale={{ duration: 500 }} class="max-w-4xl h-full w-full overflow-hidden">
		<Chat
			{initialRant}
			{onClose}
			personName={$page.params.person
				? $page.params.person.charAt(0).toUpperCase() + $page.params.person.slice(1)
				: ''}
		/>
	</div>
{/key}
