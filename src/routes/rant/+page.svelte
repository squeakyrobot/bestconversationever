<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let form: ActionData;

	let currentRant = '';
	let rant = '';
	let rantTime = new Date();

	const setRant = () => {
		rant = currentRant;
		rantTime = new Date();
		if (form) {
			form.response = '...';
		}
	};
</script>

<div class="max-w-screen-md">
	<div class="response mt-10 text-xl">
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
				<div class="chat-bubble mt-2 chat-bubble-info">
					<div class="m-3">
						{rant}
					</div>
				</div>
			</div>
		{/if}

		{#if form?.response}
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
						{form?.response}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<form method="POST" action="?/getResponse" use:enhance>
		<div class="form-control mt-10">
			<div class="input-group input-group-lg w-full">
				<input
					type="text"
					name="rant"
					placeholder="What do you have to say?"
					class="input input-bordered w-full text-xl"
					bind:value={currentRant}
				/>
				<button type="submit" class="btn btn-square btn-neutral" on:click={setRant}>
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
