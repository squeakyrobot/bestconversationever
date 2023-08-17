<script lang="ts">
	import { Character } from '$lib/personality';
</script>

{#each Object.keys(Character) as name}
	<div class="inline-block m-4 text-center justify-center">
		<a href="/chat/{name.toLowerCase()}">
			<div class="chat-image avatar">
				<div class="w-16 rounded-full">
					<img src="/images/characters/{name}.svg" alt={name} title={name} />
				</div>
			</div>
			<div>
				{name}
			</div>
		</a>
	</div>
{/each}
