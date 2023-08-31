<script lang="ts">
	import type { MessageExchange, Participant } from '$lib/conversation';
	import { getAvatarInitials } from '$lib/util';
	import { sessionUser } from '$lib/stores/session-user';

	export let participant: Participant | undefined;
	export let message: MessageExchange;
</script>

{#if participant && participant.avatarUrl && (message.role === 'assistant' || $sessionUser?.settings?.useAvatarImage)}
	<div class="chat-image avatar" class:hidden={!$sessionUser?.settings?.showAvatarInChat}>
		<div class="w-16 rounded-full">
			<img
				crossorigin="anonymous"
				src={participant.avatarUrl}
				alt={participant.displayName}
				title={participant.displayName}
			/>
		</div>
	</div>
{:else}
	<div
		class="chat-image avatar placeholder"
		class:hidden={!$sessionUser?.settings?.showAvatarInChat}
	>
		<div
			class="w-16 rounded-full {message.role === 'user'
				? 'bg-secondary-focus'
				: 'bg-primary-focus'}"
		>
			<span class="text-xl">{getAvatarInitials(participant?.displayName || message.name)}</span>
		</div>
	</div>
{/if}
