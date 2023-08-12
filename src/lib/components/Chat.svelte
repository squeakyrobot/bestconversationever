<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import Typewriter from 'svelte-typewriter';
	import type { RantResponse } from '$lib/rant-response';
	import type { RantRequest } from '$lib/rant-request';
	import { onMount } from 'svelte';
	import { Personality } from '$lib/query-options';

	export let personName = '';
	export let initialRant = '';

	export let onClose: () => void;

	let rantBox: HTMLInputElement;
	let rantResponse: RantResponse | undefined = undefined;
	let currentRant = '';
	let rant = '';
	let rantTime = new Date();
	let waitingForResponse = false;
	let personality: Personality;
	const messages: { role: 'user' | 'assistant'; content: string }[] = [];

	// const init = (el: HTMLElement) => el.focus();

	onMount(() => {
		if (personName) {
			personName = personName.charAt(0).toUpperCase() + personName.slice(1);
			personality = (Personality as any)[personName];
			if (!personality) {
				personName = '';
			}
		}

		if (initialRant) {
			currentRant = initialRant;
			sendRant();
		} else {
			rantBox.focus();
		}
	});

	const sendRant = (e?: SubmitEvent) => {
		const rantRequest: RantRequest = {
			rant: currentRant,
			// TODO: Re-enable sticky personality
			personality: personality // || rantResponse?.personality
		};

		if (personality) {
			rantRequest.previousMessages = messages;
		}

		rant = currentRant;
		rantTime = new Date();
		setTimeout(() => (waitingForResponse = true), 250);
		setTimeout(async () => {
			currentRant = '';
			const result = await fetch('/api/rant', {
				method: 'POST',
				body: JSON.stringify(rantRequest)
			});

			rantResponse = await result.json();
			personName = rantResponse?.personName || '';

			messages.push(
				{ role: 'user', content: rant },
				{ role: 'assistant', content: rantResponse?.response || '' }
			);

			waitingForResponse = false;
		}, 10);
	};
</script>

<div class="flex flex-col overflow-hidden h-full p-2 w-full">
	<div class="sticky z-50 top-0 border-b-2 border-neutral mb-2">
		<div class="navbar">
			<div class="flex-1">
				Chatting with {personName || "anyone who'll listen"}
			</div>
			<div class="flex-none">
				{#if onClose}
					<button on:click={onClose} class="btn btn-square btn-sm btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
					</button>
				{/if}
			</div>
		</div>
	</div>
	<div class="text-xl flex-grow overflow-y-auto">
		{#if rant}
			<div class="chat chat-end">
				<div class="chat-image avatar">
					<div class="w-16 rounded-full">
						<img src="/images/personalities/User.svg" alt="User" />
					</div>
				</div>
				<div class="chat-header">
					Anonymous

					<time class="text-xs opacity-70">{new Date(rantTime).toLocaleString()}</time>
				</div>
				{#key rant}
					<div class="chat-bubble mt-2 chat-bubble-info">
						<div class="m-3">
							{rant}
						</div>
					</div>
				{/key}
			</div>
		{/if}

		{#if rantResponse?.response || waitingForResponse}
			<div class="chat chat-start mt-10 text-xl">
				{#if personName}
					<div class="chat-image avatar">
						<div class="w-16 rounded-full">
							<img
								src="/images/personalities/{personName || 'default'}.svg"
								alt={personName || '[auto]'}
								title={personName}
							/>
						</div>
					</div>
				{/if}
				<div class="chat-header">
					{personName || 'Finding someone who cares...'}
					{#if rantResponse}
						<time class="text-xs opacity-50">
							{new Date(rantResponse.responseTime).toLocaleString()}
						</time>
					{/if}
				</div>
				<div class="chat-bubble mt-2">
					<div class="m-3">
						{#if waitingForResponse}
							<span class="loading loading-dots loading-md" />
						{:else}
							<Typewriter>{DOMPurify.sanitize(rantResponse?.response)}</Typewriter>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div class=" bottom-0 mt-2">
		<form on:submit|preventDefault={sendRant}>
			<div class="form-control">
				<div class="input-group input-group-lg w-full">
					<input
						bind:this={rantBox}
						type="text"
						name="rant"
						placeholder="What do you have to say?"
						class="input input-bordered w-full"
						bind:value={currentRant}
					/>
					<button type="submit" disabled={!currentRant} class="btn btn-square btn-neutral">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="none"
							class="h-4 w-4 m-1 md:m-0"
							stroke-width="2"
							><path
								d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
								fill="currentColor"
							/></svg
						>
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
