<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Typewriter from 'svelte-typewriter';
	import type { RantResponse } from '$lib/rant-response';
	export let form: ActionData;

	let rantResponse: RantResponse | undefined = undefined;
	let currentRant = '';
	let rant = '';
	let rantTime = new Date();
	let waitingForResponse = false;

	const init = (el: HTMLElement) => el.focus();

	const sendRant = (event: Event) => {
		try {
			rant = currentRant;
			rantTime = new Date();
			waitingForResponse = true;
			setTimeout(() => (currentRant = ''), 100);
		} catch {
			event.stopPropagation();
			event.preventDefault();
		}
	};

	const rantResult = () => {
		return async (a: any) => {
			// `result` is an `ActionResult` object
			await applyAction(a.result);

			rantResponse = a.result.data as RantResponse;

			// TODO: all the stuff

			setTimeout(() => (waitingForResponse = false), 1000);
		};
	};
</script>

<div class="flex flex-col overflow-hidden h-full p-2 max-w-4xl w-full">
	<div class="sticky z-50 top-0 p-2 border-b-2 border-neutral mb-2">
		Chatting with {form?.personName || "anyone who'll listen"}
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

					<time class="text-xs opacity-70">{rantTime.toLocaleString()}</time>
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

		{#if form?.response || waitingForResponse}
			<div class="chat chat-start mt-10 text-xl">
				<div class="chat-image avatar">
					<div class="w-16 rounded-full">
						<img
							src="/images/personalities/{form?.personName || 'default'}.svg"
							alt={form?.personName || '[auto]'}
							title={form?.prompt}
						/>
					</div>
				</div>
				<div class="chat-header">
					{form?.personName || '???'}
					<time class="text-xs opacity-50">{form?.responseTime.toLocaleString()}</time>
				</div>
				<div class="chat-bubble mt-2">
					<div class="m-3">
						{#if waitingForResponse}
							<span class="loading loading-dots loading-md" />
						{:else}
							<Typewriter>{form?.response}</Typewriter>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div class=" bottom-0 mt-2">
		<form
			method="POST"
			action="?/getResponse"
			on:submit={(e) => sendRant(e)}
			use:enhance={rantResult}
		>
			<div class="form-control">
				<div class="input-group input-group-lg w-full">
					<input
						use:init
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
