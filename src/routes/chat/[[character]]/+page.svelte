<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import type { PageData } from './$types';
	import { ChatEvents, sendChatEvent } from '$lib/analytics';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { userChat } from '$lib/stores/user-chat';

	export let data: PageData;

	let initialChat = '';

	userChat.subscribe((value) => {
		initialChat = value;
	});

	onMount(() => {
		userChat.update(() => '');
		sendChatEvent(ChatEvents.chatStart, { character: data.characterName || 'NOT_SET' });
	});

	const onClose = () => {
		sendChatEvent(ChatEvents.chatClosed, { character: data.characterName || 'NOT_SET' });

		goto('/inbox');
	};
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:scale={{ duration: 500 }}>
	{#key $page.url}
		<Chat {initialChat} {onClose} characterName={data.characterName} checkExisting={true} />
	{/key}
</div>
