<script lang="ts">
	import CharacterList from './CharacterList.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import type { User } from '$lib/user';
	import { Character, Personality, Traits } from '$lib/personality';
	import { ConversationStore } from '$lib/stores/conversation-store';
	import { getEnumValue, nameFormat } from '$lib/util';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Conversation } from '$lib/conversation';
	import { goto, preloadData } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { getRecaptchaToken } from '$lib/recaptcha-client';
	import SigninAlert from './SigninAlert.svelte';

	export let conversation: Conversation | undefined = undefined;
	export let characterName = '';
	export let initialChat = '';
	export let preloadRoute = '';
	export let checkExisting = false;
	export let onClose: () => void;

	const user: User = $page.data.user;

	let chatBox: HTMLInputElement;

	let currentChat = '';
	let sendingChat = false;
	let shareUrl: string = '';
	let disableLinkButton = false;

	let existingConvoId: string | undefined = undefined;

	// const personality = new Personality();
	const conversationStore = conversation
		? ConversationStore.fromConversation(user, conversation)
		: new ConversationStore(
				user,
				new Personality({ character: getEnumValue(Character, nameFormat(characterName)) })
		  );

	conversationStore.personality.lock(Traits.Character);

	onMount(() => {
		if (conversation) {
			characterName = conversationStore.personality.getName(
				conversationStore.personality.character
			);
		}

		if (initialChat) {
			currentChat = initialChat;
			sendChatMessage();
		} else if (!conversation) {
			chatBox.focus();
		}

		shareUrl = `${location.origin}/view/${conversationStore.conversationId}`;

		if (!navigator.clipboard) {
			disableLinkButton = true;
		}

		const scrollEL: HTMLElement | null = document.querySelector('#messageDiv');

		if (scrollEL) {
			scrollEL.scrollTop = scrollEL.scrollHeight;
		}

		checkExistingConvo();
	});

	const checkExistingConvo = async () => {
		if (checkExisting && characterName) {
			const apiCall = await fetch(`/api/inbox/by-char/${characterName}`, {
				method: 'POST',
				body: JSON.stringify({ recaptchaToken: await getRecaptchaToken('inbox/byChar') })
			});

			const apiResponse = (await apiCall.json()) as { conversationId: string | undefined };

			existingConvoId = apiResponse.conversationId;
		}
	};

	const sendChatMessage = (e?: SubmitEvent) => {
		sendingChat = true;
		conversationStore.sendUserExchange(currentChat).then(() => (sendingChat = false));
		currentChat = '';

		if (!characterName) {
			characterName = conversationStore.personality.getName(
				conversationStore.personality.character
			);
		}
	};

	const shareConvoClick = () => {
		if (navigator.share) {
			navigator
				.share({
					title: $page.data.pageTitle,
					// text: `Check out my conversation with ${characterName}\n\n`,
					url: shareUrl
				})
				.then(() => {
					console.log('Thanks for sharing!');
				})
				.catch(console.error);
		} else {
			copyLinkModal.showModal();
			document.getElementById('shareUrlInput').select();
		}
	};

	const copyShareUrl = async () => {
		await navigator.clipboard.writeText(shareUrl);
	};

	const preloadClose = () => {
		if (preloadRoute) {
			preloadData(preloadRoute);
		}
	};
</script>

<dialog id="characterChooser" class="modal">
	<form method="dialog" class="modal-box w-11/12 max-w-3xl">
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<h3 class="font-bold text-lg">Choose someone to chat with</h3>
		<div class="flex-wrap mt-5 text-center">
			<CharacterList />
		</div>
		<div class="flex justify-end bottom-0 border-t-2 border-neutral mt-2 pt-4">
			<button class="btn btn-ghost">Close</button>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog id="copyLinkModal" class="modal">
	<form method="dialog" class="modal-box md:w-4/5 max-w-3xl">
		<h3 class="font-bold text-lg">Share this Conversation</h3>

		<div class="input-group w-full mt-10">
			<input
				type="text"
				id="shareUrlInput"
				value={shareUrl}
				class="input input-bordered w-full input-disabled"
			/>
			{#if !disableLinkButton}
				<button class="btn btn-neutral" on:click={copyShareUrl}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 448 512"
						stroke="currentColor"
						fill="currentColor"
						><path
							d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
						/></svg
					>
					Copy Link
				</button>
			{/if}
		</div>
		<div class="modal-action flex justify-end bottom-0 border-t-2 border-neutral mt-10 pt-2">
			<button class="btn btn-ghost">Close</button>
		</div>
	</form>
</dialog>

<div class="flex flex-col overflow-hidden h-full p-2 w-full">
	<div class="sticky z-50 top-0 border-b-2 border-neutral mb-2 navbar">
		<div class="flex-1">
			Chatting with &nbsp;
			<!-- svelte-ignore a11y-missing-attribute -->
			<a onclick="characterChooser.showModal()" class="link link-info">
				{characterName || "anyone who'll listen"}
			</a>
		</div>
		<div class="flex-none">
			{#if onClose}
				<button
					on:mouseenter={preloadClose}
					on:click={onClose}
					class="btn btn-square btn-sm btn-ghost"
				>
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

			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-square btn-sm btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 128 512"
						stroke="currentColor"
						fill="currentColor"
					>
						<path
							d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"
						/>
					</svg>
				</label>
				<ul class="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box w-52">
					<li>
						<button
							on:click={shareConvoClick}
							class={$conversationStore.shareable !== true ? 'btn-disabled text-base-100' : ''}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="1em"
								viewBox="0 0 448 512"
								stroke="currentColor"
								fill="currentColor"
							>
								<path
									d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"
								/></svg
							>
							Share Conversation
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div id="messageDiv" class="flex-grow overflow-y-auto">
		<SigninAlert state={characterName} />
		{#each $conversationStore.messages as message, index}
			{@const currentAnswer =
				index === $conversationStore.messages.length - 1 && message.role === 'assistant'}
			<ChatMessage {message} {currentAnswer} {user} />
		{/each}
	</div>
	<div class=" bottom-0 mt-2">
		{#if existingConvoId}
			<div
				class="alert mb-2"
				transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'y' }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-info shrink-0 w-6 h-6"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>There's an existing conversation with {characterName}. Load it?</span>
				<div>
					<button class="btn btn-sm" on:click={() => goto(`/inbox/${existingConvoId}`)}
						>Yes
					</button>
					<button class="btn btn-sm" on:click={() => (existingConvoId = undefined)}>No</button>
				</div>
			</div>
		{/if}
		<form on:submit|preventDefault={sendChatMessage} class="form-control">
			<div class="input-group input-group-lg w-full">
				<input
					bind:this={chatBox}
					type="text"
					name="rant"
					placeholder="What do you have to say?"
					class="input input-bordered w-full"
					bind:value={currentChat}
				/>
				<button
					type="submit"
					disabled={!currentChat || sendingChat}
					class="btn btn-square btn-neutral"
				>
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
		</form>
	</div>
</div>
