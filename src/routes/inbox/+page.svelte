<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import InboxHeader from '$lib/components/InboxHeader.svelte';
	import type { PageData } from './$types';
	import { UserType } from '$lib/user';
	import { getDisplayTime } from '../../lib/relative-time';
	import { fade } from 'svelte/transition';

	export let data: PageData;
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:fade>
	<div class="flex flex-col overflow-hidden h-full p-2 w-full">
		<InboxHeader />

		<div class="flex-grow overflow-y-auto">
			{#if data.session.user.type !== UserType.Authenticated}
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
					<span
						>You are not logged in. Create an account or login to save your chats. (Signup isn't
						ready yet)</span
					>
					<div>
						<!-- <button class="btn btn-sm btn-neutral">Join for free</button> -->
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
						<div class="text-sm whitespace-nowrap">{getDisplayTime(item.time)}</div>
					</div>
				</a>
			{/each}
		</div>
		<Footer />
	</div>
</div>
