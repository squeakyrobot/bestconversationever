<script lang="ts">
	import CharacterList from './CharacterList.svelte';
	import InboxMenu from './InboxMenu.svelte';
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
				<div class="pl-4 text-sm sm:text-xl">
					{$page.data.user.settings.displayName}
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
		<a class="btn btn-neutral" onclick="characterChooser.showModal()">New Chat</a>
	</div>
</div>
