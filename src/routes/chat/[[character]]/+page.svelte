<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { ChatEvents, sendChatEvent } from '$lib/analytics';
	import { goto } from '$app/navigation';
	import { nameFormat } from '$lib/util';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { userChat } from '$lib/stores/user-chat';

	let initialChat = '';

	userChat.subscribe((value) => {
		initialChat = value;
	});

	onMount(async () => {
		userChat.update(() => '');

		const characterName = $page.params.character ? nameFormat($page.params.character) : 'not_set';

		sendChatEvent(ChatEvents.chatStart, { character: characterName });
	});

	const onClose = () => {
		const characterName = $page.params.character ? nameFormat($page.params.character) : 'not_set';
		sendChatEvent(ChatEvents.chatClosed, { character: characterName });
		goto('/');
	};
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:scale={{ duration: 500 }}>
	{#key $page.url}
		<Chat {initialChat} {onClose} characterName={nameFormat($page.params.character)} />
	{/key}
</div>
