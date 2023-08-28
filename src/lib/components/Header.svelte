<script lang="ts">
	export let title = 'Best Conversation Ever';
	export let titleLink: string | null = '/';
</script>

<div class="flex justify-between top-0 border-b-2 border-neutral mb-5 pb-2">
	{#if titleLink && titleLink !== '/'}
		<a href={titleLink} class="items-center inline-flex text-xl m-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="1em"
				viewBox="0 0 448 512"
				stroke="currentColor"
				fill="currentColor"
				><path
					d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
				/></svg
			>
			<div class="pl-4">{title}</div>
		</a>
	{:else}
		<a href="/" class="items-center inline-flex text-xl m-4">
			<img src="/images/bce-logo.svg" alt="BCE Logo" class="w-12 mr-3" />
			<div class="pl-2">{title}</div>
		</a>
	{/if}

	<div>
		<!-- TODO: Add Menu-->
		<!-- <a href="/" class="btn btn-ghost">Home</a> -->
	</div>
</div>
