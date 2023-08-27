<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import type { MessageExchange } from '$lib/conversation';
	import type { User } from '$lib/user';
	import { marked } from 'marked';
	import { page } from '$app/stores';

	export let currentAnswer: boolean = false;
	export let message: MessageExchange;
	export let user: User = $page.data.user;
	export let autoScroll = true;

	const doAutoScroll = (el: HTMLElement) => {
		if (autoScroll) {
			el.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}
	};
</script>

{#if message.role === 'user'}
	<div class="chat chat-end">
		<div class="chat-image avatar">
			<div class="w-16 rounded-full">
				<img crossorigin="anonymous" src={user.avatarUrl} alt="User" />
			</div>
		</div>
		<div class="chat-header">
			{message.name}
			<time class="text-xs opacity-70">
				{message.time ? new Date(message.time).toLocaleString() : ''}
			</time>
		</div>

		<div class="chat-bubble mt-2 chat-bubble-info">
			<div class="m-3" use:doAutoScroll>
				{message.text || ''}
			</div>
		</div>
	</div>
{:else if (message.role === 'assistant' && message.text) || message.waitingForResponse}
	<div class="chat chat-start mt-5 mb-10 text-xl">
		<div class="chat-image avatar">
			<div class="w-16 rounded-full">
				<img src="/images/characters/{message.name}.svg" alt={message.name} title={message.name} />
			</div>
		</div>
		<div class="chat-header">
			{message.name || 'Finding someone who cares...'}
			<time class="text-xs opacity-50">
				{message.time ? new Date(message.time).toLocaleString() : ''}
			</time>
		</div>
		{#if message.waitingForResponse}
			<div class="chat-bubble mt-2" use:doAutoScroll>
				<div class="m-3 overflow-x-auto">
					<span class="loading loading-dots loading-md" />
				</div>
			</div>
		{:else if currentAnswer}
			<div class="chat-bubble mt-2" use:doAutoScroll>
				<div class="m-3 overflow-x-auto">
					<!-- TODO: Add animation & audio -->
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
