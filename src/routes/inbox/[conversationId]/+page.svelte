<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import type { PageData } from './$types';
	import { ChatEvents, sendChatEvent } from '$lib/analytics';
	import { afterUpdate, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { returnPage } from '$lib/stores/return-page';
	import { scale } from 'svelte/transition';

	export let data: PageData;

	const closeRedirect = $returnPage;

	onMount(() => {
		sendChatEvent(ChatEvents.chatStart, { character: data.conversation.character });
	});

	const onClose = async () => {
		sendChatEvent(ChatEvents.chatClosed, { character: data.conversation.character });

		goto(closeRedirect || '/inbox');
	};

	afterUpdate(() => {
		$returnPage = '/inbox';
	});
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:scale={{ duration: 500 }}>
	{#key $page.url}
		<Chat {onClose} conversation={data.conversation} />
	{/key}
</div>
