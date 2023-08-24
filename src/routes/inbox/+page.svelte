<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import InboxHeader from '$lib/components/InboxHeader.svelte';
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
		<div class="flex-grow overflow-y-auto">
			{#each data.convoList as item}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					on:click={loadConversation(item.convoKey)}
					class="flex p-5 hover:bg-neutral hover:rounded-xl hover:cursor-pointer"
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

					<div class="grow ml-5 overflow-hidden">
						<div class="text-sm sm:text-lg md:text-xl">{item.characterName}</div>
						<div class="opacity-60 text-xs sm:text-sm md:text-lg truncate">
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
