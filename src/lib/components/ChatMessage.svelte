<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import Typewriter from 'svelte-typewriter';
	import { marked } from 'marked';
	import type { ConversationItem } from '$lib/stores/conversation';

	export let message: ConversationItem;
	export let currentAnswer: boolean;

	const scrollToElement = (el: HTMLElement) => el.scrollIntoView();
</script>

{#if message.role === 'user'}
	<div class="chat chat-end">
		<div class="chat-image avatar">
			<div class="w-16 rounded-full">
				<img src="/images/personalities/User.svg" alt="User" />
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
		<div class="chat-bubble mt-2">
			<div class="m-3 overflow-x-auto" use:scrollToElement>
				{#if message.waitingForResponse}
					<span class="loading loading-dots loading-md" />
				{:else if currentAnswer}
					<!-- <Typewriter mode="cascade"> -->
					{@html DOMPurify.sanitize(marked.parse(message.text || ''))}
					<!-- </Typewriter> -->
				{:else}
					{@html DOMPurify.sanitize(marked.parse(message.text || ''))}
				{/if}
			</div>
		</div>
	</div>
{/if}
