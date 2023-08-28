<script lang="ts">
	import { PUBLIC_GITHUB_URL } from '$env/static/public';
	import Settings from './Settings.svelte';

	export let disabled = false;
	export let showVersion = false;

	const versionInfo = `${__VERSION__}, ${__LASTMOD__}`;
	const commitUrl = `${PUBLIC_GITHUB_URL}/commit/${__VERSION__}`;
</script>

{#if showVersion}
	<div class="justify-end text-right text-info mt-5 pt-2">
		<a href={commitUrl} target="_blank">
			{versionInfo}
		</a>
	</div>
{/if}

<div class="flex justify-between bottom-0 border-t-2 border-neutral mt-2 pt-4">
	<div class="align-bottom">
		<a href="/" class="items-center inline-flex" title="BestConversationEver.com">
			<img src="/images/bce-logo.svg" alt="BCE Logo" class="w-10 mr-3" />
			<div class="hidden sm:block">
				BestConversationEver<em>.com</em>
			</div>
		</a>
	</div>
	<div class="flex">
		<a href="/about" class="btn {disabled ? 'btn-disabled' : 'btn-ghost'}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="shrink-0 w-6 h-6 {disabled ? 'stroke-neutral' : 'stroke-info'}"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			About
		</a>
		<details id="settingsPanel" class="dropdown dropdown-top dropdown-end">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<summary tabindex="0" class="btn btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1em"
					class="shrink-0 w-5 h-5"
					viewBox="0 0 512 512"
					stroke="currentColor"
					fill="currentColor"
					><path
						d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
					/></svg
				>
			</summary>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex="0"
				class="dropdown-content z-[1] card card-compact p-2 shadow rounded-box w-80 bg-neutral"
			>
				<Settings panel="settingsPanel" />
			</div>
		</details>
	</div>
</div>
