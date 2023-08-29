<script lang="ts">
	import CharacterList from './CharacterList.svelte';
	import InboxMenu from './InboxMenu.svelte';
	import { getAvatarInitials } from '$lib/util';
	import { page } from '$app/stores';

	export let showHome = false;
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

<div class="flex justify-between top-0 border-b-2 border-neutral mt-2 mb-2 pl-2 pb-4">
	<div class="items-center inline-flex">
		<div id="menuPanel" class="dropdown">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="cursor-pointer inline-flex items-center">
				{#if $page.data.user.settings.useAvatarImage}
					<div class="avatar inline">
						<div class="w-12 rounded-full">
							<img
								crossorigin="anonymous"
								src={$page.data.user.settings.avatarUrl}
								alt={$page.data.user.settings.displayName}
								title={$page.data.user.settings.displayName}
							/>
						</div>
					</div>
				{:else}
					<div class="chat-image avatar placeholder">
						<div class="w-12 rounded-full bg-secondary-focus">
							<span class="text-xl">{getAvatarInitials($page.data.user.settings.displayName)}</span>
						</div>
					</div>
				{/if}
				<div class="pl-4 text-sm sm:text-xl flex items-center">
					<span class="whitespace-nowrap">{$page.data.user.settings.displayName}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 448 512"
						fill="currentColor"
						stroke="currentColor"
						class="ml-2 w-4"
						><path
							d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
						/></svg
					>
				</div>
			</label>
			<InboxMenu />
		</div>
	</div>

	<div>
		{#if showHome}
			<a href="/" class="btn btn-ghost">Home</a>
		{/if}
		<!-- svelte-ignore a11y-missing-attribute -->
		<a class="btn btn-neutral" onclick="characterChooser.showModal()">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="1em"
				viewBox="0 0 512 512"
				fill="currentColor"
				stroke="currentColor"
				class=""
				><path
					d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
				/></svg
			>
			<span class="hidden xs:block">New Chat</span>
		</a>
	</div>
</div>
