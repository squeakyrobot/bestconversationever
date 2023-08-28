<script lang="ts">
	import { PUBLIC_GITHUB_URL } from '$env/static/public';

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
	</div>
</div>
