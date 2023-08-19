<script lang="ts">
	export let title = 'Best Conversation Ever';
	export let titleLink = '/';
</script>

<div class="flex justify-between top-0 border-b-2 border-neutral mb-10 pb-4">
	<a href={titleLink} class="items-center inline-flex text-xl" title="BestConversationEver.com">
		<img src="/images/bce-logo.svg" alt="BCE Logo" class="w-12 mr-3" />
		<div class="pl-2">{title}</div>
	</a>

	<div>
		<!-- TODO: Add Menu-->
		<a href="/" class="btn btn-ghost">Home</a>
	</div>
</div>
