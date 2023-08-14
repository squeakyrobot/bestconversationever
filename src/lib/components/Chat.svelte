<script lang="ts">
	import ChatMessage from './ChatMessage.svelte';
	import { onMount } from 'svelte';
	import { Person, Personality, Traits } from '$lib/personality';
	import { ConversationStore } from '$lib/stores/conversation';
	import PeopleList from './PeopleList.svelte';

	export let personName = '';
	export let initialRant = '';

	export let onClose: () => void;

	let chatBox: HTMLInputElement;

	let currentRant = '';

	const personality = new Personality();
	const conversationStore = new ConversationStore(personality);

	onMount(() => {
		if (personName) {
			personName = personName.charAt(0).toUpperCase() + personName.slice(1);
			conversationStore.setPersonality(new Personality({ person: (Person as any)[personName] }));
		} else {
			personality.lock(Traits.Person);
		}

		if (initialRant) {
			currentRant = initialRant;
			sendRant();
		} else {
			chatBox.focus();
		}
	});

	const sendRant = (e?: SubmitEvent) => {
		conversationStore.set(currentRant);
		currentRant = '';

		if (!personName) {
			personName = personality.getName(personality.person);
		}
	};
</script>

<dialog id="peopleChooser" class="modal">
	<form method="dialog" class="modal-box w-11/12 max-w-3xl">
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<h3 class="font-bold text-lg">Choose someone to chat with</h3>
		<div class="flex-wrap mt-5 text-center">
			<PeopleList />
		</div>
		<div class="flex justify-end bottom-0 border-t-2 border-neutral mt-2 pt-4">
			<div class="align-bottom">
				<button class="btn btn-ghost">Close</button>
			</div>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="flex flex-col overflow-hidden h-full p-2 w-full">
	<div class="sticky z-50 top-0 border-b-2 border-neutral mb-2">
		<div class="navbar">
			<div class="flex-1">
				Chatting with &nbsp;
				<a onclick="peopleChooser.showModal()" class="link link-info"
					>{personName || "anyone who'll listen"}</a
				>
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
		{#each $conversationStore.messages as message, index}
			{@const currentAnswer =
				index === $conversationStore.messages.length - 1 && message.role === 'assistant'}
			<ChatMessage {message} {currentAnswer} />
		{/each}
	</div>
	<div class=" bottom-0 mt-2">
		<form on:submit|preventDefault={sendRant}>
			<div class="form-control">
				<div class="input-group input-group-lg w-full">
					<input
						bind:this={chatBox}
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
