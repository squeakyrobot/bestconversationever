<script lang="ts">
	import type { MessageExchange, Participant } from '$lib/conversation';

	export let participant: Participant | undefined;
	export let message: MessageExchange;

	const getAvatarInitials = (name: string): string => {
		const names = name.split(' ');

		if (names.length > 1) {
			return name.charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
		}

		return name.charAt(0).toUpperCase();
	};
</script>

{#if participant && participant.avatarUrl}
	<div class="chat-image avatar">
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
	<div class="chat-image avatar placeholder">
		<div
			class="w-16 rounded-full {message.role === 'user'
				? 'bg-secondary-focus'
				: 'bg-primary-focus'}"
		>
			<span class="text-xl">{getAvatarInitials(participant?.displayName || message.name)}</span>
		</div>
	</div>
{/if}
