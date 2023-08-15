<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { userChat } from '$lib/stores/user-chat';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { nameFormat } from '$lib/util';

	let initialChat = '';

	userChat.subscribe((value) => {
		initialChat = value;
	});

	onMount(() => {
		userChat.update(() => '');
	});

	const onClose = () => goto('/');
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:scale={{ duration: 500 }}>
	{#key $page.url}
		<Chat {initialChat} {onClose} personName={nameFormat($page.params.person)} />
	{/key}
</div>
