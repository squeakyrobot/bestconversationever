<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { userChat } from '$lib/stores/user-chat';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { nameFormat } from '$lib/util';
	import { ChatEvents, sendChatEvent } from '$lib/analytics';

	let initialChat = '';

	userChat.subscribe((value) => {
		initialChat = value;
	});

	onMount(async () => {
		userChat.update(() => '');

		const personName = $page.params.person ? nameFormat($page.params.person) : 'not_set';

		sendChatEvent(ChatEvents.chatStart, { character: personName });
	});

	const onClose = () => {
		const personName = $page.params.person ? nameFormat($page.params.person) : 'not_set';
		sendChatEvent(ChatEvents.chatClosed, { character: personName });
		goto('/');
	};
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:scale={{ duration: 500 }}>
	{#key $page.url}
		<Chat {initialChat} {onClose} personName={nameFormat($page.params.person)} />
	{/key}
</div>
