<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import InboxHeader from '$lib/components/InboxHeader.svelte';
	import { UserType } from '$lib/user';
	import { getDisplayTime } from '../../relative-time';
	import type { PageData } from './$types';

	export let data: PageData;

	const loadConversation = (convoKey: string) => {
		console.log(convoKey);

		return null;
	};
</script>

<div class="max-w-4xl h-full w-full overflow-hidden">
	<div class="flex flex-col overflow-hidden h-full p-2 w-full">
		<InboxHeader />
		{#if data.session.user.type !== UserType.Authenticated}
			<div class="alert sm:alert">
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
				<span
					>You are not logged in. Create an account or login to save your chats. (Signup isn't ready
					yet)</span
				>
				<div>
					<!-- <button class="btn btn-sm btn-neutral">Join for free</button> -->
				</div>
			</div>
		{/if}
		<div class="flex-grow overflow-y-auto">
			{#each data.convoList as item}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					on:click={loadConversation(item.convoKey)}
					class="flex pt-4 pb-4 pl-2 pr-2 hover:bg-neutral hover:rounded-xl hover:cursor-pointer"
				>
					<div class="flex-none avatar inline">
						<div class="w-12 rounded-full">
							<img
								src="/images/characters/{item.characterName}.svg"
								alt={item.characterName}
								title={item.characterName}
							/>
						</div>
					</div>

					<div class="grow ml-4 overflow-hidden">
						<div class="text-xl">{item.characterName}</div>
						<div class="opacity-60 truncate">
							{item.snippet}
						</div>
					</div>

					<div class="flex-none">
						<div class="text-sm whitespace-nowrap">{getDisplayTime(item.time)}</div>
					</div>
				</div>
			{/each}
		</div>
		<Footer />
	</div>
</div>
