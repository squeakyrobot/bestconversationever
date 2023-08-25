<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { ChatEvents, sendChatEvent } from '$lib/analytics';
	import { goto } from '$app/navigation';
	import { nameFormat } from '$lib/util';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { userChat } from '$lib/stores/user-chat';
	import { returnPage } from '$lib/stores/return-page';
	import { conversationId } from '$lib/stores/conversation-id';
	import type { Conversation } from '$lib/conversation';
	import { getRecaptchaToken } from '$lib/recaptcha-client';

	export let closeRedirect: string | undefined;

	let initialChat = '';
	let convo: Conversation | undefined = undefined;

	userChat.subscribe((value) => {
		initialChat = value;
	});

	onMount(async () => {
		try {
			if (!closeRedirect) {
				closeRedirect = $returnPage;
			}

			userChat.update(() => '');

			const characterName = $page.params.character ? nameFormat($page.params.character) : 'not_set';

			if ($conversationId) {
				const apiCall = await fetch(`/api/conversation/${$conversationId}`, {
					method: 'POST',
					body: JSON.stringify({
						recaptchaToken: await getRecaptchaToken('inbox/loadConversation')
					})
				});

				const c = (await apiCall.json()) as Conversation;

				// TODO: this is all weird, fix it
				if (c.character === characterName) {
					convo = c;
				}
			}

			sendChatEvent(ChatEvents.chatStart, { character: characterName });
		} finally {
			$conversationId = undefined;
		}
	});

	const onClose = () => {
		const characterName = $page.params.character ? nameFormat($page.params.character) : 'not_set';
		sendChatEvent(ChatEvents.chatClosed, { character: characterName });

		goto(closeRedirect || '/');
	};
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:scale={{ duration: 500 }}>
	<!-- TODO: delay render until the conversatin is fetched? Or fetch it in the component? -->
	{#key $page.url || convo}
		<Chat
			{initialChat}
			{onClose}
			characterName={nameFormat($page.params.character)}
			conversation={convo}
		/>
	{/key}
</div>
