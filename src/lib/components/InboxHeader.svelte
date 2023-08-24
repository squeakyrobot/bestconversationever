<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../../routes/$types';
</script>

<div class="flex justify-between top-0 border-b-2 border-neutral mt-2 mb-2 pl-2 pb-4">
	<div class="items-center inline-flex text-xl">
		<div class="avatar inline">
			<div class="w-12 rounded-full">
				<img
					src={$page.data.session.user.avatarUrl}
					alt={$page.data.session.user.name}
					title={$page.data.session.user.name}
				/>
			</div>
		</div>
		<div class="pl-4">{$page.data.session.user.name}</div>
	</div>

	<div>
		<!-- TODO: Add Menu-->
		<a href="/" class="btn btn-ghost">Home</a>
	</div>
</div>
