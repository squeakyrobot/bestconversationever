<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import type { User } from '$lib/user';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	const user: User = data.user;
	const conversation = data.conversation;
</script>

<div
	class="flex flex-col w-full lg:w-3/4 max-w-6xl border-opacity-50 p-4 h-full"
	in:fade={{ duration: 400 }}
>
	<Header title={data.pageTitle} titleLink="/chat/{conversation.character}" />
	<div class="text-xl flex-grow overflow-y-auto">
		{#each conversation.messages as message}
			<ChatMessage {message} {user} autoScroll={false} />
		{/each}
	</div>

	<Footer />
</div>
