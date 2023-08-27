<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import InboxHeader from '$lib/components/InboxHeader.svelte';
	import type { PageData } from './$types';
	import { UserType } from '$lib/user';
	import { getDisplayTime } from '../../lib/relative-time';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let data: PageData;

	// The message time display is keyed off refreshTime
	// so it updates the display when the value changes
	let refreshTime = 0;

	onMount(() => {
		const timer = setInterval(() => refreshTime++, 30000);
		return () => clearInterval(timer);
	});
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:fade>
	<div class="flex flex-col overflow-hidden h-full p-2 w-full">
		<InboxHeader />

		<div class="flex-grow overflow-y-auto">
			{#if data.user.type !== UserType.Authenticated}
				<div class="alert sm:alert">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-warning shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/></svg
					>
					<span>You are not signed in. Sign in to save your chats.</span>
					<div>
						<a href="/auth/signin/google" class="btn btn-sm btn-neutral">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="1em"
								viewBox="0 0 488 512"
								stroke="currentColor"
								fill="currentColor"
								><path
									d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
								/></svg
							>
							Sign in with Google
						</a>
					</div>
				</div>
			{/if}
			{#each data.convoList as item}
				<a
					href="/inbox/{item.consversationId}"
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
						{#key refreshTime}
							<div class="text-sm whitespace-nowrap">{getDisplayTime(item.time)}</div>
						{/key}
					</div>
				</a>
			{/each}
		</div>
		<Footer />
	</div>
</div>
