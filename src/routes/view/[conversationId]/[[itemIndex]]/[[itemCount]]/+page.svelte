<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import type { PageData } from './$types';
	import type { User } from '$lib/user';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	const user: User = data.session.user;
	const conversation = data.conversation;
</script>

<div class="max-w-4xl h-full w-full overflow-hidden py-10" in:fade={{ duration: 400 }}>
	<!-- <div class="flex flex-col overflow-hidden h-full p-2 w-full"> -->
	<div class="text-xl flex-grow overflow-y-auto">
		{#each conversation.messages as message}
			<ChatMessage {message} {user} />
		{/each}
	</div>
	<!-- </div> -->
</div>
