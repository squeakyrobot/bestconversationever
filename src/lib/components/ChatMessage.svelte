<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import { marked } from 'marked';
	import type { ConversationItem } from '$lib/stores/conversation';
	import type { User } from '$lib/user';

	export let message: ConversationItem;
	export let currentAnswer: boolean;
	export let user: User = { name: 'Anonymous', avatar: `/images/user/missing-user.jpg` };

	const scrollToElement = (el: HTMLElement) =>
		el.scrollIntoView({ block: 'start', behavior: 'smooth' });
</script>

{#if message.role === 'user'}
	<div class="chat chat-end">
		<div class="chat-image avatar">
			<div class="w-16 rounded-full">
				<img src={user.avatar} alt="User" />
			</div>
		</div>
		<div class="chat-header">
			{message.name}
			<time class="text-xs opacity-70">
				{message.time ? new Date(message.time).toLocaleString() : ''}
			</time>
		</div>

		<div class="chat-bubble mt-2 chat-bubble-info">
			<div class="m-3" use:scrollToElement>
				{message.text || ''}
			</div>
		</div>
	</div>
{:else if (message.role === 'assistant' && message.text) || message.waitingForResponse}
	<div class="chat chat-start mt-5 mb-10 text-xl">
		<div class="chat-image avatar">
			<div class="w-16 rounded-full">
				<img
					src="/images/personalities/{message.name}.svg"
					alt={message.name}
					title={message.name}
				/>
			</div>
		</div>
		<div class="chat-header">
			{message.name || 'Finding someone who cares...'}
			<time class="text-xs opacity-50">
				{message.time ? new Date(message.time).toLocaleString() : ''}
			</time>
		</div>
		{#if message.waitingForResponse}
			<div class="chat-bubble mt-2" use:scrollToElement>
				<div class="m-3 overflow-x-auto">
					<span class="loading loading-dots loading-md" />
				</div>
			</div>
		{:else if currentAnswer}
			<div class="chat-bubble mt-2" use:scrollToElement>
				<div class="m-3 overflow-x-auto">
					<!-- TODO: Add animation -->
					{@html DOMPurify.sanitize(marked.parse(message.text || ''))}
				</div>
			</div>
		{:else}
			<div class="chat-bubble mt-2">
				<div class="m-3 overflow-x-auto">
					{@html DOMPurify.sanitize(marked.parse(message.text || ''))}
				</div>
			</div>
		{/if}
	</div>
{/if}
