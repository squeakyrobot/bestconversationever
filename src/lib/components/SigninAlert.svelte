<script lang="ts">
	import { page } from '$app/stores';
	import { UserType } from '$lib/user';

	export let state: string | undefined = undefined;

	const data = $page.data;
</script>

{#if data.user.type !== UserType.Authenticated}
	<div class="alert sm:alert mb-4">
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
			<a href="/auth/signin/google{state ? `?state=${state}` : ''}" class="btn btn-sm btn-neutral">
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
