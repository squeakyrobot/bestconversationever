<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import InboxHeader from '$lib/components/InboxHeader.svelte';
	import SigninAlert from '$lib/components/SigninAlert.svelte';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { getDisplayTime } from '../../lib/relative-time';
	import { onMount } from 'svelte';
	import SigninAlert from '$lib/components/SigninAlert.svelte';

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
			<SigninAlert />
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
							<div class="text-sm whitespace-nowrap mr-2">{getDisplayTime(item.time)}</div>
						{/key}
					</div>
				</a>
			{/each}
		</div>
		<span class="relative hidden sm:block">
			<Footer />
		</span>
	</div>
</div>
